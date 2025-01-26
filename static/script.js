let tasks = [];
let taskChart;
let isEditing = false;
let editIndex = null;

// Register the plugin
Chart.register(ChartDataLabels);

// Initialize Chart.js for the spin wheel
const ctx = document.getElementById('spinWheel').getContext('2d');
taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [], // Labels (A, B, C, etc.)
        datasets: [{
            data: [], // Equal slices
            backgroundColor: [
                '#00FF00', '#00CC00', '#009900', '#006600', '#003300', '#000000'
            ],
            borderColor: 'black', // Black dissection lines
            borderWidth: 2 // Thicker black lines
        }]
    },
    options: {
        responsive: true,
        animation: {
            animateRotate: true,
            animateScale: true
        },
        plugins: {
            datalabels: { // Add this plugin to display labels inside slices
                color: 'black', // Black text for contrast
                font: {
                    size: 14,
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex]; // Display only the label
                }
            }
        }
    }
});

// Function to update the wheel and task table
function updateWheel() {
    const labels = tasks.map((_, index) => String.fromCharCode(65 + index)); // A, B, C, etc.
    const data = tasks.map(() => 1); // Equal slices

    taskChart.data.labels = labels;
    taskChart.data.datasets[0].data = data;
    taskChart.update();

    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    taskTable.innerHTML = tasks.map((task, index) => `
        <tr>
            <td>${labels[index]}</td>
            <td>${task}</td>
            <td>
                <button onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
                <button onclick="completeTask(${index})"><i class="fas fa-check"></i></button>
                <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Add Task Button
document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.querySelector('.task-input').style.display = 'block';
    isEditing = false;
});

// Save Task Button
document.getElementById('saveTaskBtn').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (task) {
        if (isEditing) {
            tasks[editIndex] = task;
        } else {
            tasks.push(task);
        }
        taskInput.value = '';
        document.querySelector('.task-input').style.display = 'none';
        updateWheel();
    }
});

// Spin Wheel Button
document.getElementById('spinWheelBtn').addEventListener('click', () => {
    if (tasks.length === 0) {
        alert("No tasks available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * tasks.length);
    const selectedTask = tasks[randomIndex];
    document.getElementById('selectedTask').value = selectedTask;

    // Animate the wheel
    const rotation = 360 * 5 + (360 / tasks.length) * randomIndex;
    taskChart.options.rotation = -rotation;
    taskChart.update();
});

// Edit Task
function editTask(index) {
    document.querySelector('.task-input').style.display = 'block';
    document.getElementById('taskInput').value = tasks[index];
    isEditing = true;
    editIndex = index;
}

// Complete Task
function completeTask(index) {
    tasks.splice(index, 1);
    updateWheel();
}

// Delete Task
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        updateWheel();
    }
}

// Initialize
updateWheel();
