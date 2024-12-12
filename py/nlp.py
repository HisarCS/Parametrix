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

# Step 1: Disable W&B Integration
os.environ["WANDB_DISABLED"] = "true"  # Prevent W&B from being used

# Step 2: Define Hugging Face Access Token
token = "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"

# Step 3: Load Tokenizer and Fine-Tuned Model
model_name = "fine_tuned_model"  # Replace with your model directory
tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=token)

# Step 4: Create Inference Pipeline
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Step 5: Ensure Commands Directory Exists
commands_dir = "./commands"
os.makedirs(commands_dir, exist_ok=True)

# Step 6: Stringman Function to Parse JSON
def stringman(input_string):
    try:
        structured_data = {}
        parameters = {}

        # Extract shape
        shape_match = re.search(r'"shape":\s*"([^"]+)"', input_string)
        if shape_match:
            structured_data['shape'] = shape_match.group(1).strip()

        # Extract individual parameters
        param_matches = re.findall(r'"(\w+)":\s*([\d\.]+)', input_string)
        for param_key, param_value in param_matches:
            if param_key not in ("shape", "plane", "coordinates"):  # Exclude non-parameter fields
                try:
                    param_value = int(param_value)
                except ValueError:
                    pass
                parameters[param_key] = param_value

        structured_data["parameters"] = parameters

        # Extract plane
        plane_match = re.search(r'"plane":\s*"([^"]+)"', input_string)
        if plane_match:
            structured_data['plane'] = plane_match.group(1).strip()

        # Extract coordinates
        coordinates_match = re.search(r'"coordinates":\s*(\[[^\]]+\])', input_string)
        if coordinates_match:
            coordinates = json.loads(coordinates_match.group(1).strip())
            structured_data["coordinates"] = coordinates

        return structured_data

    except Exception as e:
        print(f"Error in formatting: {e}")
        return None

# Step 7: Function to Generate and Save JSON Output
def generate_and_save_json(command):
    response = generator(command, max_length=100)
    generated_text = response[0]["generated_text"]

    # Use stringman to parse generated text
    parsed_output = stringman(generated_text)

    if not parsed_output:
        parsed_output = {
            "shape": "unknown",
            "parameters": {},
            "plane": "unknown",
            "coordinates": []
        }

    # Save to a JSON file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(commands_dir, f"command_{timestamp}.json")
    with open(output_file, "w") as file:
        json.dump(parsed_output, file, indent=4)

    return parsed_output
