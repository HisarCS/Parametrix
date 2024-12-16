import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    pipeline
)
import re

os.environ["WANDB_DISABLED"] = "true"  


token = "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"


model_name = "fine_tuned_model" 
tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=token)


generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)


commands_dir = "./commands"
os.makedirs(commands_dir, exist_ok=True)


def stringman(input_string):
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
                    pass
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
        print(f"Error in formatting: {e}")
        return None


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


app = Flask(__name__)

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
