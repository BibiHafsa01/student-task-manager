
// Get HTML elements
const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const toast = document.getElementById("toast");

let currentUser = null;
let tasks = [];

let toastTimer;

// Show notification
function showMessage(message) {
    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// Show signup
document.getElementById("showSignup").addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.classList.add("hidden");
    signupSection.classList.remove("hidden");
});

// Show login
document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    signupSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
});

// Create account
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    if (!email || !password) {
        showMessage("Please fill all fields");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showMessage("Account already exists");
        return;
    }

    users.push({ email, password });

    localStorage.setItem("users", JSON.stringify(users));

    signupForm.reset();
    signupSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    showMessage("Account created successfully!");
});

// Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
        item => item.email === email && item.password === password
    );

    if (!user) {
        showMessage("Invalid email or password");
        return;
    }

    currentUser = email;

    loginForm.reset();
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    loadTasks();
    showMessage("Login successful!");
});

// Add task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        showMessage("Please enter a task");
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        title: title,
        completed: false
    });

    saveTasks();
    taskForm.reset();
    renderTasks();

    showMessage("Task added successfully!");
});

// Save tasks for current user
function saveTasks() {
    if (currentUser) {
        localStorage.setItem(
            "tasks_" + currentUser,
            JSON.stringify(tasks)
        );
    }
}

// Load tasks
function loadTasks() {
    tasks = JSON.parse(
        localStorage.getItem("tasks_" + currentUser) || "[]"
    );

    renderTasks();
}

// Render task list
function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty-message">No tasks added yet.</p>';
    }

    tasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        const left = document.createElement("div");
        left.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        if (task.completed) {
            title.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        left.append(checkbox, title);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            showMessage("Task deleted successfully!");
        });

        item.append(left, deleteButton);
        taskList.appendChild(item);
    });

    updateStats();
}

// Update dashboard statistics
function updateStats() {
    const completed = tasks.filter(task => task.completed).length;

    document.getElementById("totalTasks").textContent = tasks.length;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent =
        tasks.length - completed;
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    currentUser = null;
    tasks = [];

    dashboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    showMessage("Logged out successfully!");
});
