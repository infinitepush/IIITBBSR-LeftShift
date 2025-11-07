from flask import Flask, jsonify, request, send_from_directory
from controllers.generate_controller import generate_assets

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

@app.route("/generate", methods=["OPTIONS"])
def handle_options():
    return '', 200

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_from_directory('output', filename, as_attachment=True)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"})

@app.route("/generate", methods=["POST"])
def generate():
    return generate_assets()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)