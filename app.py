from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# List to store tasks
tasks = []

# Route to render the main page
@app.route("/")
def index():
    return render_template("index.html", tasks=tasks)

# Route to add a task
@app.route("/add_task", methods=["POST"])
def add_task():
    task = request.json.get("task")
    tasks.append(task)
    return jsonify({"status": "success", "tasks": tasks})

# Route to spin the wheel
@app.route("/spin_wheel", methods=["GET"])
def spin_wheel():
    if not tasks:
        return jsonify({"status": "error", "message": "No tasks available."})
    import random
    selected_task = random.choice(tasks)
    return jsonify({"status": "success", "selected_task": selected_task})

# Route to edit a task
@app.route("/edit_task", methods=["POST"])
def edit_task():
    index = request.json.get("index")
    new_task = request.json.get("task")
    tasks[index] = new_task
    return jsonify({"status": "success", "tasks": tasks})

# Route to complete a task
@app.route("/complete_task", methods=["POST"])
def complete_task():
    index = request.json.get("index")
    tasks.pop(index)
    return jsonify({"status": "success", "tasks": tasks})

# Route to delete a task
@app.route("/delete_task", methods=["POST"])
def delete_task():
    index = request.json.get("index")
    tasks.pop(index)
    return jsonify({"status": "success", "tasks": tasks})

if __name__ == "__main__":
    app.run(debug=True)
