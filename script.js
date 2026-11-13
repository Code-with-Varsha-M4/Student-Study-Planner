
// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// Load saved notes
const noteInput = document.getElementById("noteInput");

noteInput.value = localStorage.getItem("studyNotes") || "";

// Display all tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.onclick = () => toggleTask(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteTask(index);

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateDashboard();
}

// Add a new task
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();

    input.value = "";
    input.focus();
}

// Mark task complete or undo
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
}

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    displayTasks();
}

// Update dashboard and progress
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    document.getElementById("taskCount").textContent =
        total + (total === 1 ? " Task" : " Tasks");

    document.getElementById("completedCount").textContent =
        completed + (completed === 1 ? " Task" : " Tasks");

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (progressBar) {
        progressBar.style.width = percentage + "%";
    }

    if (progressText) {
        progressText.textContent = percentage + "% completed";
    }
}

// Save notes

function saveNote() {
    const notes = noteInput.value;

    localStorage.setItem("studyNotes", notes);

    document.getElementById("noteMessage").textContent =
        "All notes saved successfully! ♡";
}

// Automatically save notes while typing
noteInput.addEventListener("input", function() {
    localStorage.setItem("studyNotes", noteInput.value);

    document.getElementById("noteMessage").textContent =
        "Auto-saved ✓";
});

// Clear all notes
function clearNotes() {
    const confirmClear = confirm("Are you sure you want to clear your notes?");

    if (confirmClear) {
        noteInput.value = "";
        localStorage.removeItem("studyNotes");

        document.getElementById("noteMessage").textContent =
            "Notes cleared successfully!";
    }
}


// Allow Enter key to add tasks
document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when page opens
displayTasks();

// ===============================
// POMODORO FOCUS TIMER
// ===============================

let timerSeconds = 25 * 60;
let timerInterval = null;
let currentMode = "Focus";

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    document.getElementById("timerDisplay").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (timerInterval !== null) return;

    document.getElementById("timerMessage").textContent =
        "Stay focused. You've got this! 🌱";

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            document.getElementById("timerMessage").textContent =
                currentMode + " session completed! Great job! 🎉";

            document.getElementById("timerMode").textContent =
                "Session Complete";

            document.getElementById("startTimer").textContent = "Start Again";

            alert(currentMode + " session completed!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    document.getElementById("timerMessage").textContent =
        "Timer paused. Take a breath. 🌿";
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    timerSeconds = currentMode === "Focus" ? 25 * 60 : 5 * 60;

    updateTimerDisplay();

    document.getElementById("timerMessage").textContent =
        "Ready when you are! ♡";

    document.getElementById("timerMode").textContent =
        currentMode === "Focus" ? "Time to Focus" : "Time to Relax";

    document.getElementById("startTimer").textContent = "Start";
}

function setTimer(minutes, mode) {
    clearInterval(timerInterval);
    timerInterval = null;

    currentMode = mode;
    timerSeconds = minutes * 60;

    updateTimerDisplay();

    document.getElementById("timerMode").textContent =
        mode === "Focus" ? "Time to Focus" : "Time to Relax";

    document.getElementById("timerMessage").textContent =
        mode === "Focus"
        ? "One step at a time. You've got this! 🌱"
        : "Relax. You deserve a little break. ☁️";

    document.getElementById("startTimer").textContent = "Start";
}

// Initial timer display
updateTimerDisplay();

// ===============================
// EDITABLE STUDY TIMETABLE
// ===============================

// Load saved timetable
let schedule = JSON.parse(localStorage.getItem("studySchedule")) || [];

function displaySchedule() {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    // Sort subjects according to time
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    schedule.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "schedule-item";

        const time = document.createElement("span");
        time.textContent = new Date(
            "2000-01-01T" + item.time
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const details = document.createElement("div");
        details.className = "schedule-details";

        const subject = document.createElement("strong");
        subject.textContent = item.subject;

        details.appendChild(subject);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteSchedule(index);

        div.appendChild(time);
        div.appendChild(details);
        div.appendChild(deleteBtn);

        scheduleList.appendChild(div);
    });
}

// Add subject to timetable
function addSchedule() {
    const subjectInput = document.getElementById("subjectInput");
    const timeInput = document.getElementById("timeInput");
    const message = document.getElementById("scheduleMessage");

    const subject = subjectInput.value.trim();
    const time = timeInput.value;

    if (subject === "" || time === "") {
        message.textContent = "Please enter both subject and time.";
        return;
    }

    schedule.push({
        subject: subject,
        time: time
    });

    localStorage.setItem("studySchedule", JSON.stringify(schedule));

    subjectInput.value = "";
    timeInput.value = "";
    message.textContent = "Subject added successfully! 🌱";

    displaySchedule();
}

// Delete a timetable entry
function deleteSchedule(index) {
    schedule.splice(index, 1);

    localStorage.setItem("studySchedule", JSON.stringify(schedule));

    document.getElementById("scheduleMessage").textContent =
        "Timetable updated!";

    displaySchedule();
}

// Show saved timetable when page opens
displaySchedule();
