const form = document.getElementById("new-task-form")
const input = document.getElementById("new-task-input")
const list_el = document.getElementById("tasks")
const submitButton = document.getElementById('new-task-submit')
const loading = document.getElementById("loading")

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

window.addEventListener("load", () => {
  const preloader = document.getElementById("loading");
  preloader.style.opacity = "0";
  setTimeout(() => preloader.style.display = "none", 500);
});


// Handle form submission to add new task
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskTitle = input.value.trim();
      if (taskTitle === "") {
         alert("Please enter a task!");
         return;
      }
      const newTask = { title: taskTitle, completed: false };

      try {
         const response = await fetch(API_URL, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
         });

         if (!response.ok) {
            throw new Error("Failed to add task");
         }

         const addedTask = await response.json();
         addTaskToDOM(addedTask);
         input.value = ""; // Clear input field
      } catch (error) {
         console.error(error);
      }
   }
);

// Fetch initial tasks from the API
async function fetchTasks() {
  loading.classList.remove("hidden");

  try {
    const response = await fetch(API_URL + '?_limit=5'); 
    const tasks = await response.json();

    list_el.innerHTML = "";
    tasks.forEach(task => {
      addTaskToDOM(task);
    });
  } catch (err) {
    list_el.innerHTML = `<p style="color: red; font-family: 'Sans Serif';">Failed to load Tasks.</p>`;
    console.error(err);
  } finally {
    loading.classList.add("hidden");
  }
}

// Add a task to the DOM
function addTaskToDOM(task) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");

  taskElement.innerHTML = `
    <div class="task-content" style="display: flex; align-items: center; gap: 16px; background-color: #797979; padding: 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 8px; width: 100%;">
      <input type="text" value="${task.title}" readonly style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #acacac;">
      <div style="display: flex; gap: 8px;">
        <button class="edit-btn" style="background-color: #4caf50; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer;">✏️Edit</button>
        <button class="delete-btn" style="background-color: #f44336; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer;">🗑️ Delete</button>
      </div>
    </div>
  `;

  const inputField = taskElement.querySelector("input");
  const editBtn = taskElement.querySelector(".edit-btn");
  const deleteBtn = taskElement.querySelector(".delete-btn");

  // ✅ Edit task
  editBtn.addEventListener("click", async () => {
    if (editBtn.dataset.mode === "edit") {
      inputField.removeAttribute("readonly");
      inputField.focus();
      editBtn.innerText = "✅ Save";
      editBtn.dataset.mode = "save";
    } else {
      const updatedTask = { ...task, title: inputField.value };

      try {
        await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
      } catch (err) {
        console.error("Error updating task:", err);
      }

      inputField.setAttribute("readonly", "readonly");
      editBtn.innerText = "✏️Edit";
      editBtn.dataset.mode = "edit";
    }
  });

  // ✅ Delete task
  deleteBtn.addEventListener("click", async () => {
    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: "DELETE",
      });
      taskElement.remove();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  });

  list_el.appendChild(taskElement);
}

fetchTasks();
