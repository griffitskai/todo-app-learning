const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${task.done ? "done" : ""}`;

    const text = document.createElement("span");
    text.textContent = task.text;
    text.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Usuń";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((_, i) => i !== index);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(deleteBtn);
    li.appendChild(text);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

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

renderTasks();
