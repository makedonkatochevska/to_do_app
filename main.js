//html elements
const form = document.getElementById("form");
const ulList = document.getElementById("todoList");

class ToDo {
  constructor(_title, _id = null) {
    this.title = _title;
    this.status = false;
    this.id = _id || Date.now();
    this.isEditing = false;
  }
}

class ToDoLibrary {
  constructor() {
    this.todos = [];
  }

  addTask(newTask) {
    this.todos.push(newTask);
  }

  removeTask(todoID) {
    this.todos = this.todos.filter((todo) => todo.id !== todoID);
  }
}

//library instance
const toDoLibrary = new ToDoLibrary();

//store todos to array
function storeTasks() {
  const toDoInputValue = form.todoInput.value.trim();

  if (!toDoInputValue) return alert("Please Enter Valid Task Name!");

  const newTask = new ToDo(toDoInputValue);
  toDoLibrary.addTask(newTask);

  form.todoInput.value = "";

  console.log(toDoLibrary);
}

//display todos
function displayTasks() {
  ulList.innerHTML = "";

  toDoLibrary.todos.forEach((todo) => {
    const li = document.createElement("li");

    //Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = todo.id;
    checkbox.hidden = true;

    //checkbox event
    checkbox.addEventListener("change", () => {
      todo.status = !todo.status;
      li.classList.toggle("done");
      editBtn.classList.toggle("button-disabled");

      console.log(toDoLibrary);
    });

    //Label
    const label = document.createElement("label");
    label.textContent = todo.title;
    label.htmlFor = todo.id;

    //Input field for editing task (Initially hidden)
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.title;
    editInput.classList.add("edit-input");
    editInput.style.display = "none";

    //btns
    const btnsDiv = document.createElement("div");

    //Edit btn
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("button", "edit-button");

    //edit btn event
    editBtn.addEventListener("click", () => {
      if (todo.isEditing) {
        //if we're in edit mode, save the changes
        const updatedTitle = editInput.value.trim();
        if (updatedTitle) {
          todo.title = updatedTitle;
          label.textContent = updatedTitle;
          todo.isEditing = false;
          editInput.style.display = "none";
          label.style.display = "inline-block";
          editBtn.textContent = "Edit";
        } else {
          alert("Please enter a valid task name!");
        }
      } else {
        //If we're not editing, start editing
        todo.isEditing = true;
        editInput.style.display = "inline-block";
        label.style.display = "none";
        editBtn.textContent = "Save";
      }

      console.log(toDoLibrary);
    });

    //check status from storage and render it the same way
    if (todo.status) {
      li.classList.toggle("done");
      editBtn.classList.toggle("button-disabled");
    }

    //Delete btn
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("button", "delete-button");

    //delete btn event
    deleteBtn.addEventListener("click", () => {
      //confirm before remove
      const confirmValue = confirm(
        "Are you sure you want to delete this ToDo item?"
      );
      if (!confirmValue) return;

      toDoLibrary.removeTask(todo.id);
      li.remove();

      console.log(toDoLibrary);
    });

    btnsDiv.append(editBtn, deleteBtn);
    li.append(checkbox, label, editInput, btnsDiv);
    ulList.appendChild(li);
  });
}

//form event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  storeTasks();
  displayTasks();
});
