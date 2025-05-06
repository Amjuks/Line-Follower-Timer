from flask import Flask, render_template, jsonify
from threading import Lock

app = Flask(__name__)

state = {
    "running": False
}
lock = Lock()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['GET'])
def start_timer():
    with lock:
        state["running"] = True
    return jsonify({"status": "started"})

@app.route('/stop', methods=['GET'])
def stop_timer():
    with lock:
        state["running"] = False
    return jsonify({"status": "stopped"})

@app.route('/reset', methods=['GET'])
def reset_timer():
    with lock:
        state["running"] = False
    return jsonify({"status": "reset"})

@app.route('/status', methods=['GET'])
def get_status():
    with lock:
        return jsonify({"running": state["running"]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
