def generate_and_save_json(generator, command):
    print(f"Processing command: {command}")
    response = generator(command, max_length=100)
    generated_text = response[0]["generated_text"]
    print(f"Generated text: {generated_text}")

    try:
        structured_output = json.loads(generated_text)
    except json.JSONDecodeError:
        print("Error: Generated text is not valid JSON.")
        structured_output = {"error": "Invalid JSON"}

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"./commands/command_{timestamp}.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as file:
        json.dump(structured_output, file, indent=4)
    print(f"Output saved to {output_path}")
    return structured_output
