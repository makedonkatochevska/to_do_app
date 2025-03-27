//html elements
const form = document.getElementById("form");
const ulList = document.getElementById("todoList");
const allCheckedContainer = document.querySelector(".all-checked-container");
const allCheckedInput = document.getElementById("allChecked");
const alert = document.getElementById("alert");

class ToDo {
  constructor(_title, _id = null, _status = false) {
    this.title = _title;
    this.status = _status;
    this.id = _id || Date.now();
    this.isEditing = false;
  }
}

class ToDoLibrary {
  constructor() {
    this.todos = this.retrieveListFromLocalStorage();
  }

  addTask(newTask) {
    this.todos.push(newTask);
    this.saveListToLocalStorage(); //saves updated list
  }

  removeTask(todoID) {
    this.todos = this.todos.filter((todo) => todo.id !== todoID);
    this.saveListToLocalStorage(); //saves updated list
  }

  saveListToLocalStorage() {
    localStorage.setItem("taskList", JSON.stringify(this.todos));
  }

  retrieveListFromLocalStorage() {
    const savedTodos = localStorage.getItem("taskList");

    if (savedTodos) {
      return JSON.parse(savedTodos).map(
        (todo) => new ToDo(todo.title, todo.id, todo.status)
      ); //return it with map() so they can be instance from Task class and not plain objects
    } else {
      return [];
    }
  }
}

//library instance
const toDoLibrary = new ToDoLibrary();

//store todos to array
function storeTasks() {
  const toDoInputValue = form.todoInput.value.trim();

  if (!toDoInputValue) {
    alert.textContent = "Please enter valid task name!";
    return;
  }

  const newTask = new ToDo(toDoInputValue);
  toDoLibrary.addTask(newTask);

  form.todoInput.value = "";

  alert.textContent = "";

  updateAllCheckedCheckbox();

  console.log(toDoLibrary);
}

//display todos
function displayTasks() {
  ulList.innerHTML = "";

  //check if no tasks are added
  noTasksAdded();

  toDoLibrary.todos.forEach((todo) => {
    const li = document.createElement("li");

    //check status from storage and render it the same way
    if (todo.status) {
      li.classList.add("done");
    }

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

      //save changes to local storage
      toDoLibrary.saveListToLocalStorage();

      //update if one is unchecked
      updateAllCheckedCheckbox();

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

    //check status from storage and render it the same way
    if (todo.status) {
      editBtn.classList.add("button-disabled");
    }

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

          //save changes to local storage
          toDoLibrary.saveListToLocalStorage();
        } else {
          alert("Please enter a valid task name!");
        }
      } else {
        //If we're not editing, start editing
        todo.isEditing = true;
        editInput.style.display = "inline-block";
        label.style.display = "none";
        editBtn.textContent = "Save";

        //save changes to local storage
        toDoLibrary.saveListToLocalStorage();
      }

      console.log(toDoLibrary);
    });

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

      //falling effect
      li.classList.add("falling");

      setTimeout(() => {
        toDoLibrary.removeTask(todo.id);
        li.remove();
        markAllAsCheckedDisplay();
        noTasksAdded();
      }, 500);

      //if there are no tasks

      console.log(toDoLibrary);
    });

    btnsDiv.append(editBtn, deleteBtn);
    li.append(checkbox, label, editInput, btnsDiv);
    ulList.appendChild(li);
  });
}

//no tasks fnc
function noTasksAdded() {
  if (toDoLibrary.todos.length === 0) {
    ulList.innerHTML = `<li>No tasks added yet!</li>`;
  }
}

//mark all as checked fnc
function markAllAsCheckedDisplay() {
  allCheckedContainer.style.display =
    toDoLibrary.todos.length <= 1 ? "none" : "flex";
}

function updateAllCheckedCheckbox() {
  const liElements = document.querySelectorAll("li");

  //check if all tasks are marked as done
  const allDone =
    [...liElements].length > 0 &&
    [...liElements].every((element) => element.classList.contains("done"));

  //update checkbox state
  allCheckedInput.checked = allDone;
}

//mark all as checked event
allCheckedInput.addEventListener("click", (e) => {
  const liElements = document.querySelectorAll("li");
  console.log(liElements);

  //check if all tasks are already marked as done
  const allDone = [...liElements].every((element) =>
    element.classList.contains("done")
  );

  liElements.forEach((element, index) => {
    const editBtn = element.querySelector(".edit-button");

    if (allDone) {
      //if all are done, uncheck all
      element.classList.remove("done");
      toDoLibrary.todos[index].status = false;
      editBtn.classList.remove("button-disabled");
    } else {
      //otherwise, mark as done
      element.classList.add("done");
      toDoLibrary.todos[index].status = true;
      editBtn.classList.add("button-disabled");
    }
  });

  toDoLibrary.saveListToLocalStorage();
});

//form event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  storeTasks();
  displayTasks();
  markAllAsCheckedDisplay();

  allCheckedInput.checked = false;
});

//load event
window.addEventListener("DOMContentLoaded", () => {
  displayTasks();
  markAllAsCheckedDisplay();
  updateAllCheckedCheckbox();
});
