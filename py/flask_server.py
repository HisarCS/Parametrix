from flask import Flask, request, jsonify

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
