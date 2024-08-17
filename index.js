const todoInput = document.querySelector("input");
const addButton = document.getElementById("add-todo");
const todoList = document.querySelector(".todo-list");

if (todoInput.value.trim() === "") {
    addButton.classList.add("disabled");
} else {
    addButton.classList.remove("disabled");
}

todoInput.addEventListener("input", () => {
    if (todoInput.value.trim() === "") {
        addButton.classList.add("disabled");
    } else {
        addButton.classList.remove("disabled");
    }
});

addButton.addEventListener("click", addTodoItem);
todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.code === "Enter") {
        addTodoItem();
    }
});

function checkIfExists(value) {
    const items = document.querySelectorAll('.todo-list-item');
    for (let item of items) {
        const itemText = item.childNodes[0].textContent.trim();
        if (itemText === value.trim()) {
            return true;
        }
    }
    return false;
}

function addTodoItem() {
    if (todoInput.value.trim() === "" || addButton.classList.contains("disabled")) {
        return;
    }
    if (checkIfExists(todoInput.value)) {
        alert("Item exists");
        return;
    }

    const item = document.createElement('div');
    item.classList.add('todo-list-item');
    item.textContent = todoInput.value;
    item.setAttribute('draggable', true);

    addDeleteFeature(item);
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);

    todoList.appendChild(item);
    todoInput.value = "";
    addButton.classList.add("disabled");

    updateH3Visibility();
    saveTodos();
}

function addDeleteFeature(item) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');

    deleteButton.addEventListener("click", () => {
        todoList.removeChild(item);
        updateH3Visibility();
        saveTodos();
    });

    item.appendChild(deleteButton);
}

function handleDragStart(event) {
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

todoList.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        todoList.appendChild(draggable);
    } else {
        todoList.insertBefore(draggable, afterElement);
    }
    saveTodos(); // Save the updated order
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-list-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-list-item').forEach(item => {
        todos.push(item.childNodes[0].textContent.trim());
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.classList.add('todo-list-item');
        item.textContent = todo;
        item.setAttribute('draggable', true);

        addDeleteFeature(item);
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);

        todoList.appendChild(item);
    });

    updateH3Visibility();
}

function updateH3Visibility() {
    const h3 = document.querySelector("h3");
    if (todoList.children.length === 0) {
        h3.style.display = "none";
    } else {
        h3.style.display = "block";
    }
}

window.addEventListener('load', loadTodos);
