/* =========================================
   GET HTML ELEMENTS
========================================= */

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const today = document.getElementById("today");


/* =========================================
   LOAD TASKS FROM LOCAL STORAGE
========================================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


/* =========================================
   FIX OLD TASKS
   This makes old tasks compatible with
   priority, due date and important features.
========================================= */

tasks = tasks.map(function(task) {

    return {
        id: task.id || Date.now(),
        title: task.title || "",
        completed: task.completed || false,
        important: task.important || false,
        priority: task.priority || "Medium",
        dueDate: task.dueDate || ""
    };

});


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD TASK
========================================= */

function addTask() {

    // Get task name
    const taskText = taskInput.value.trim();

    // Get priority
    const priority = priorityInput.value;

    // Get due date
    const dueDate = dueDateInput.value;


    /* =========================
       CHECK EMPTY TASK
    ========================= */

    if (taskText === "") {

        message.textContent =
            "Please enter a task.";

        message.style.color =
            "#c44848";

        return;
    }


    /* =========================
       CREATE NEW TASK OBJECT
    ========================= */

    const newTask = {

        id: Date.now(),

        title: taskText,

        completed: false,

        important: false,

        priority: priority,

        dueDate: dueDate

    };


    /* =========================
       ADD TASK TO ARRAY
    ========================= */

    tasks.push(newTask);


    /* =========================
       SAVE TO LOCAL STORAGE
    ========================= */

    saveTasks();


    /* =========================
       UPDATE SCREEN
    ========================= */

    displayTasks();

    updateStatistics();


    /* =========================
       SUCCESS MESSAGE
    ========================= */

    message.textContent =
        "Task added successfully!";

    message.style.color =
        "#16803c";


    /* =========================
       CLEAR INPUTS
    ========================= */

    taskInput.value = "";

    dueDateInput.value = "";

}


/* =========================================
   DISPLAY TASKS
========================================= */

function displayTasks() {

    taskList.innerHTML = "";


    /* =========================
       SEARCH TEXT
    ========================= */

    const searchText =
        searchInput.value.toLowerCase().trim();


    /* =========================
       FILTER TASKS
    ========================= */

    const filteredTasks =
        tasks.filter(function(task) {

            // Search
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            // Default filter
            let matchesFilter = true;


            // Completed
            if (currentFilter === "completed") {

                matchesFilter =
                    task.completed;

            }


            // Active / Pending
            if (currentFilter === "active") {

                matchesFilter =
                    !task.completed;

            }


            // Important
            if (currentFilter === "important") {

                matchesFilter =
                    task.important;

            }


            return matchesSearch &&
                   matchesFilter;

        });


    /* =========================
       CREATE EACH TASK
    ========================= */

    filteredTasks.forEach(function(task) {

        const li =
            document.createElement("li");


        /* =========================
           CHECKBOX
        ========================= */

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            task.completed;


        /* =========================
           TASK NAME
        ========================= */

        const span =
            document.createElement("span");

        span.textContent =
            task.title;


        /* =========================
           PRIORITY
        ========================= */

        const priority =
            document.createElement("small");

        priority.textContent =
            task.priority;

        priority.className =
            "priority " +
            task.priority.toLowerCase();


        /* =========================
           DUE DATE
        ========================= */

        const dateText =
            document.createElement("small");


        if (task.dueDate !== "") {

            dateText.textContent =
                formatDate(task.dueDate);

            dateText.className =
                "due-date";

        }


        /* =========================
           IMPORTANT BUTTON
        ========================= */

        const importantButton =
            document.createElement("button");

        importantButton.textContent =
            task.important ? "★" : "☆";

        importantButton.className =
            "important-button";


        /* =========================
           DELETE BUTTON
        ========================= */

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-button";


        /* =========================
           ADD EVERYTHING TO LI
        ========================= */

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(priority);

        li.appendChild(dateText);

        li.appendChild(importantButton);

        li.appendChild(deleteButton);


        /* =========================
           COMPLETED STYLE
        ========================= */

        if (task.completed) {

            li.classList.add("completed");

        }


        /* =========================
           CHECKBOX EVENT
        ========================= */

        checkbox.addEventListener(
            "change",
            function() {

                task.completed =
                    checkbox.checked;

                saveTasks();

                displayTasks();

                updateStatistics();

            }
        );


        /* =========================
           IMPORTANT EVENT
        ========================= */

        importantButton.addEventListener(
            "click",
            function() {

                task.important =
                    !task.important;

                saveTasks();

                displayTasks();

            }
        );


        /* =========================
           DELETE EVENT
        ========================= */

        deleteButton.addEventListener(
            "click",
            function() {

                tasks =
                    tasks.filter(function(t) {

                        return t.id !== task.id;

                    });


                saveTasks();

                displayTasks();

                updateStatistics();

            }
        );


        /* =========================
           ADD TASK TO PAGE
        ========================= */

        taskList.appendChild(li);

    });

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    pendingTasks.textContent =
        pending;

    completedTasks.textContent =
        completed;

}


/* =========================================
   ADD BUTTON
========================================= */

addButton.addEventListener(
    "click",
    addTask
);


/* =========================================
   ENTER KEY
========================================= */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


/* =========================================
   FILTER BUTTONS
========================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                displayTasks();

            }
        );

    }
);


/* =========================================
   SIDEBAR MENU
========================================= */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


menuItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                currentFilter =
                    item.dataset.filter;


                menuItems.forEach(
                    function(menu) {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                displayTasks();

            }
        );

    }
);


/* =========================================
   TODAY'S DATE
========================================= */

const date =
    new Date();


today.textContent =
    date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );


/* =========================================
   INITIAL LOAD
========================================= */

saveTasks();

displayTasks();

updateStatistics();