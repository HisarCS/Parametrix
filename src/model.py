from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import os
import json
from datetime import datetime
import re
import logging
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment setup
os.environ["WANDB_DISABLED"] = "true"

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Directory setup
COMMANDS_DIR = "./commands"
os.makedirs(COMMANDS_DIR, exist_ok=True)

# Model configuration
MODEL_CONFIG = {
    "token": "A_TOKEN",
    "model_name": "ftm"
}

def initialize_model():
    """Initialize the model and tokenizer."""
    try:
        tokenizer = AutoTokenizer.from_pretrained(
            MODEL_CONFIG["model_name"], 
            token=MODEL_CONFIG["token"]
        )
        model = AutoModelForSeq2SeqLM.from_pretrained(
            MODEL_CONFIG["model_name"], 
            token=MODEL_CONFIG["token"]
        )
        generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)
        return generator
    except Exception as e:
        logger.error(f"Failed to initialize model: {str(e)}")
        raise

# Initialize the model
try:
    generator = initialize_model()
except Exception as e:
    logger.error(f"Model initialization failed: {str(e)}")
    generator = None

def error_handler(f):
    """Decorator for consistent error handling across routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}")
            return jsonify({
                "error": str(e),
                "type": type(e).__name__
            }), 500
    return decorated_function

def parse_generated_text(input_string):
    """Parse the generated text into structured data."""
    try:
        structured_data = {
            "shape": None,
            "parameters": {},
            "plane": None,
            "coordinates": []
        }

        # Parse shape
        shape_match = re.search(r'"shape":\s*"([^"]+)"', input_string)
        if shape_match:
            structured_data['shape'] = shape_match.group(1).strip()

        # Parse parameters
        param_matches = re.findall(r'"(\w+)":\s*([\d\.]+)', input_string)
        for param_key, param_value in param_matches:
            if param_key not in ("shape", "plane", "coordinates"):
                try:
                    param_value = int(param_value)
                except ValueError:
                    param_value = float(param_value)
                structured_data["parameters"][param_key] = param_value

        # Parse plane
        plane_match = re.search(r'"plane":\s*"([^"]+)"', input_string)
        if plane_match:
            structured_data['plane'] = plane_match.group(1).strip()

        # Parse coordinates
        coordinates_match = re.search(r'"coordinates":\s*(\[[^\]]+\])', input_string)
        if coordinates_match:
            try:
                coordinates = json.loads(coordinates_match.group(1).strip())
                structured_data["coordinates"] = coordinates
            except json.JSONDecodeError:
                logger.warning("Failed to parse coordinates JSON")

        return structured_data
    except Exception as e:
        logger.error(f"Parsing error: {str(e)}")
        return None

def process_and_save_command(command):
    """Process a command and save the result."""
    if not generator:
        raise RuntimeError("Model not initialized properly")

    try:
        # Generate text from command
        response = generator(command, max_length=100)
        generated_text = response[0]["generated_text"]
        logger.info(f"Generated text: {generated_text}")

        # Parse the generated text
        parsed_output = parse_generated_text(generated_text)
        if not parsed_output:
            raise ValueError("Failed to parse generated text")

        # Save to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(COMMANDS_DIR, f"command_{timestamp}.json")
        
        with open(output_file, "w") as file:
            json.dump(parsed_output, file, indent=4)

        return parsed_output

    except Exception as e:
        logger.error(f"Command processing error: {str(e)}")
        raise

@app.route("/health", methods=["GET"])
@error_handler
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": generator is not None
    })

@app.route("/process", methods=["POST"])
@error_handler
def process_command():
    """Process a shape generation command."""
    if not request.is_json:
        return jsonify({
            "error": "Invalid request format. JSON expected.",
            "received": str(request.data)
        }), 400

    data = request.get_json()
    command = data.get("command")

    if not command:
        return jsonify({
            "error": "Command is required.",
            "received_data": data
        }), 400

    logger.info(f"Processing command: {command}")
    
    # Process the command
    output = process_and_save_command(command)
    logger.info(f"Generated output: {output}")

    return jsonify(output)

@app.route("/commands", methods=["GET"])
@error_handler
def list_commands():
    """List all stored commands."""
    files = os.listdir(COMMANDS_DIR)
    commands_list = [file for file in files if file.endswith(".json")]
    return jsonify({
        "commands": commands_list,
        "count": len(commands_list)
    })

@app.route("/command/<filename>", methods=["GET"])
@error_handler
def get_command(filename):
    """Retrieve a specific command result."""
    file_path = os.path.join(COMMANDS_DIR, filename)
    
    if not os.path.exists(file_path):
        return jsonify({
            "error": "File not found",
            "filename": filename
        }), 404

    with open(file_path, "r") as file:
        content = json.load(file)
    
    return jsonify(content)

@app.before_request
def log_request_info():
    """Log details about each request."""
    logger.info(f"Request: {request.method} {request.url}")
    if request.is_json:
        logger.info(f"Request data: {request.json}")

if __name__ == "__main__":
    # Ensure the commands directory exists
    os.makedirs(COMMANDS_DIR, exist_ok=True)
    
    # Run the application
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5001,
        use_reloader=False  # Prevent double model loading in debug mode
    )
