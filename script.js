const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const taskCounts = document.getElementById("task-counts");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
}

function renderTasks() {
  const doneCount = tasks.filter((task) => task.done).length;
  const activeCount = tasks.length - doneCount;

  taskCounts.textContent =
    `Wszystkie: ${tasks.length} · ` +
    `Do zrobienia: ${activeCount} · ` +
    `Wykonane: ${doneCount}`;

  list.innerHTML = "";

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `todo-item ${task.done ? "done" : ""}`;

    const text = document.createElement("span");
    text.textContent = task.text;
    text.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Usuń";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((item) => item !== task);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(deleteBtn);
    li.appendChild(text);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    updateFilterButtons();
    renderTasks();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  tasks.push({ text: value, done: false });
  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
});

updateFilterButtons();
renderTasks();
