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
    addDragFeature(item);

    document.querySelector("h3").setAttribute("style", "display: block;");
    todoList.appendChild(item);
    todoInput.value = "";
    addButton.classList.add("disabled");

    saveTodos();
}

function addDeleteFeature(item) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');

    deleteButton.addEventListener("click", () => {
        todoList.removeChild(item);
        if (todoList.children.length === 1) {
            document.querySelector("h3").setAttribute("style", "display: hidden;");
        }
        saveTodos();
    });

    item.appendChild(deleteButton);
}

function addDragFeature(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
}

let draggedItem = null;

function handleDragStart(event) {
    draggedItem = event.target;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    if (draggedItem !== event.target && draggedItem !== null) {
        if (event.target.classList.contains('todo-list-item')) {
            const rect = event.target.getBoundingClientRect();
            const offset = event.clientY - rect.top;
            if (offset > rect.height / 2) {
                todoList.insertBefore(draggedItem, event.target.nextSibling);
            } else {
                todoList.insertBefore(draggedItem, event.target);
            }
        }
    }
    handleDragEnd(event);
    saveTodos();
}

function handleDragEnd(event) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
    document.querySelectorAll('.todo-list-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragEnter(event) {
    if (event.target.classList.contains('todo-list-item')) {
        event.target.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    if (event.target.classList.contains('todo-list-item')) {
        event.target.classList.remove('drag-over');
    }
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
        addDragFeature(item);

        todoList.appendChild(item);
    });

    if (todos.length > 0) {
        document.querySelector("h3").setAttribute("style", "display: block;");
    }
}

window.addEventListener('load', loadTodos);
