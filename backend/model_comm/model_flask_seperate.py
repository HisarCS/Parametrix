from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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
