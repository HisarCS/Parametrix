import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import re

# Step 1: Disable W&B Integration
os.environ["WANDB_DISABLED"] = "true"

# Step 2: Define Hugging Face Access Token
token = "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"

# Step 3: Load Tokenizer and Fine-Tuned Model
model_name = "fine_tuned_model"
tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=token)

# Step 4: Create Inference Pipeline
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Step 5: Ensure Commands Directory Exists
commands_dir = "./commands"
os.makedirs(commands_dir, exist_ok=True)

# Step 6: Initialize Flask App and Enable CORS
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Function to parse and structure input/output
def stringman(input_string):
    try:
        structured_data = {}
        parameters = {}

        # Extract shape
        shape_match = re.search(r'"shape":\s*"([^"]+)"', input_string)
        if shape_match:
            structured_data["shape"] = shape_match.group(1).strip()

        # Extract parameters
        param_matches = re.findall(r'"(\w+)":\s*([\d\.]+)', input_string)
        for param_key, param_value in param_matches:
            try:
                param_value = float(param_value)
            except ValueError:
                pass
            parameters[param_key] = param_value
        structured_data["parameters"] = parameters

        # Extract plane
        plane_match = re.search(r'"plane":\s*"([^"]+)"', input_string)
        if plane_match:
            structured_data["plane"] = plane_match.group(1).strip()

        # Extract coordinates
        coords_match = re.search(r'"coordinates":\s*\[([^\]]+)\]', input_string)
        if coords_match:
            coords_str = coords_match.group(1)
            structured_data["coordinates"] = [
                float(coord.strip()) for coord in coords_str.split(",")
            ]

        return structured_data

    except Exception as e:
        print(f"Error in formatting: {e}")
        return {"error": str(e)}

# Function to generate and save JSON output
def generate_and_save_json(command):
    response = generator(command, max_length=100)
    generated_text = response[0]["generated_text"]

    parsed_output = stringman(generated_text)

    if not parsed_output:
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

@app.route("/process", methods=["POST"])
def process_command():
    try:
        data = request.json
        command = data.get("command")

        if not command:
            return jsonify({"error": "Command is required."}), 400

        output = generate_and_save_json(command)
        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
