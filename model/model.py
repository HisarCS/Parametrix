import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import re

# Environment setup
os.environ["WANDB_DISABLED"] = "true"

# Model setup
token = "[ACSESS TOKEN]"
model_name = "fine_tuned_model"
tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=token)
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Directory setup
commands_dir = "./commands"
os.makedirs(commands_dir, exist_ok=True)

def parse_generated_text(input_string):
    try:
        structured_data = {}
        parameters = {}

        shape_match = re.search(r'"shape":\s*"([^"]+)"', input_string)
        if shape_match:
            structured_data['shape'] = shape_match.group(1).strip()

        param_matches = re.findall(r'"(\w+)":\s*([\d\.]+)', input_string)
        for param_key, param_value in param_matches:
            if param_key not in ("shape", "plane", "coordinates"):
                try:
                    param_value = int(param_value)
                except ValueError:
                    param_value = float(param_value)
                parameters[param_key] = param_value

        structured_data["parameters"] = parameters

        plane_match = re.search(r'"plane":\s*"([^"]+)"', input_string)
        if plane_match:
            structured_data['plane'] = plane_match.group(1).strip()

        coordinates_match = re.search(r'"coordinates":\s*(\[[^\]]+\])', input_string)
        if coordinates_match:
            coordinates = json.loads(coordinates_match.group(1).strip())
            structured_data["coordinates"] = coordinates

        return structured_data
    except Exception as e:
        return {"error": f"Parsing error: {e}"}

def process_and_save_command(command):
    try:
        response = generator(command, max_length=100)
        generated_text = response[0]["generated_text"]
        parsed_output = parse_generated_text(generated_text)

        if not parsed_output or "error" in parsed_output:
            parsed_output = {
                "shape": "unknown",
                "parameters": {},
                "plane": "unknown",
                "coordinates": []
            }

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(commands_dir, f"command_{timestamp}.json")

        with open(output_file, "w") as file:
            json.dump(parsed_output, file, indent=4)

        return parsed_output
    except Exception as e:
        return {"error": f"Processing error: {e}"}

app = Flask(__name__)

@app.route("/process", methods=["POST"])
def process_command():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid request format. JSON expected."}), 400

        data = request.get_json()
        command = data.get("command")

        if not command:
            return jsonify({"error": "Command is required."}), 400

        output = process_and_save_command(command)
        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/commands", methods=["GET"])
def list_commands():
    try:
        files = os.listdir(commands_dir)
        commands_list = [file for file in files if file.endswith(".json")]
        return jsonify({"commands": commands_list})
    except Exception as e:
        return jsonify({"error": f"Could not list commands: {e}"}), 500

@app.route("/command/<filename>", methods=["GET"])
def get_command(filename):
    try:
        file_path = os.path.join(commands_dir, filename)

        if not os.path.exists(file_path):
            return jsonify({"error": "File not found."}), 404

        with open(file_path, "r") as file:
            content = json.load(file)

        return jsonify(content)
    except Exception as e:
        return jsonify({"error": f"Could not retrieve file: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
