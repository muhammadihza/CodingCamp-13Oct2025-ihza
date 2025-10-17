/// Database Simulation
let tasksDb = [];

/// Add Functionality
function addTask() {
    /// Get Input Values
    const taskInput = document.getElementById('todo-input');
    const taskDate = document.getElementById('todo-date');

    /// Validate Input
    if (validateInput(taskInput.value, taskDate.value)) {
        /// Create Task Object
        const newTask = {
            task: taskInput.value,
            date: taskDate.value,
            status: 'OnGoing'
        }

        /// Add to database
        tasksDb.push(newTask);

        /// Render
        renderTasks();

        taskInput.value = '';
        taskDate.value = '';
        taskInput.focus();


    }
}

/// Render Functionality
function renderTasks(taskList = tasksDb) {
    const tableBody = document.getElementById('task-table-body');
    tableBody.innerHTML = '';

    if (taskList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No task found</td></tr>`;
        return;
    }

    taskList.forEach((taskObj, index) => {
        const row = document.createElement('tr');
        row.className = "transition-all duration-300 opacity-0 translate-y-2";

        // Status color logic
        const statusColor = taskObj.status === 'Complete' ? 'text-green-600 font-semibold' : 'text-yellow-500';


        row.innerHTML = `
            <td>${taskObj.task}</td>
            <td>${taskObj.date}</td>
            <td class="${statusColor}">${taskObj.status}</td>
            <td class="flex items-center gap-2 justify-center">

                <button onclick="editTask(${index})"
                class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition duration-200"
                title="Mark as Complete">✅</button>

                <p>||</p>

                <button onclick="deleteTask(${index})"
                class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition duration-200 ml-1"
                title="Delete Task">🗑️</button>

            </td>

        `;

        tableBody.appendChild(row);

        // Trigger animasi setelah elemen ditambahkan
        requestAnimationFrame(() => {
            row.classList.remove("opacity-0", "translate-y-2");
            row.classList.add("opacity-100", "translate-y-0");
        });

    });
}

renderTasks();

/// Search Functionality
function filterTasks() {
    const input = document.getElementById("todo-search");
    const query = document.getElementById("todo-search").value.toLowerCase();

    const filtered = tasksDb.filter(task =>
        task.task.toLowerCase().includes(query)
    );

    renderTasks(filtered);

    input.value = '';
    input.focus();
}

document.getElementById("todo-search-button").addEventListener("click", filterTasks);


/// Input Validation
function validateInput(task, date) {
    /// Simple Validation
    if (task.trim() === '') {
        showModal("What do you want to do today? ^^", [
            {
                label: "OK",
                class: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            }
        ]);
        return false;
    }
    else if (date.trim() === '') {
        showModal("Don't forget to set a due date! ^^", [
            {
                label: "OK",
                class: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            }
        ]);
        return false;
    }

    /// Check for duplicates
    const isDuplicate = tasksDb.some(existingTask =>
        existingTask.task === task.trim() && existingTask.date === date.trim()
    );

    if (isDuplicate) {
        showModal("Oops! That task is already added", [
            {
                label: "OK",
                class: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            }
        ]);
        return false;
    }

    return true;
}

/// Edit & Delete Functionality
function editTask(index) {
    const task = tasksDb[index];

    if (task.status === 'Complete') {
        showModal("You already marked this task as Complete.", [
            {
                label: "OK",
                class: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            }
        ]);
        return;
    }

    showModal("Mark this task as Complete?", [
        {
            label: "Yes",
            class: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
            onClick: () => {
                task.status = 'Complete';
                renderTasks();
            }
        },
        {
            label: "Cancel",
            class: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        }
    ]);
}

/// Modal Functionality
function deleteTask(index) {
    showModal("Are you sure you want to delete this task?", [
        {
            label: "Yes",
            class: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
            onClick: () => {
                tasksDb.splice(index, 1);
                renderTasks();
            }
        },
        {
            label: "Cancel",
            class: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        }
    ]);
}

function deleteAllTasks() {
    showModal("Delete all tasks? This cannot be undone.", [
        {
            label: "Delete All",
            class: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
            onClick: () => {
                tasksDb = [];
                renderTasks();
            }
        },
        {
            label: "Cancel",
            class: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        }
    ]);
}

function showModal(message, buttons) {
    const modal = document.getElementById('custom-modal');
    const messageEl = document.getElementById('modal-message');
    const buttonsEl = document.getElementById('modal-buttons');

    messageEl.textContent = message;
    buttonsEl.innerHTML = '';

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.label;
        button.className = btn.class;
        button.onclick = () => {
            btn.onClick?.();
            closeModal();
        };
        buttonsEl.appendChild(button);
    });

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}
