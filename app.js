const express = require("express");
const uuid = require('uuid');
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const tasks = require("./task");

app.use(bodyParser.json());

let port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Task Manager API Application !!");
});

//Get all the tasks
app.get("/tasks", (req, res) => {
  res.status(200).send(tasks);
});


// GET tasks based on completion status using query parameter
app.get("/tasks/completed", (req, res) => {
  let filterTasks = req.query.completed;

  console.log(filterTasks);

  if (filterTasks === "true" || filterTasks === "false") {
    const completedStatus = filterTasks === "true"; 
    const filteredTasks = tasks.filter((t) => t.completed === completedStatus);
    res.status(200).send(filteredTasks);
  } else if (filterTasks === undefined) {
    // If no query parameter is provided
    res.status(200).send("FilterTask is undefined");
  } else {
    return res.status(400).send("Provide a valid value for the 'completed' parameter.");
  }
});


//Get single task by id
app.get("/tasks/:id", (req, res) => {
  let taskId = parseInt(req.params.id);
  if (!taskId) {
    res.status(400).send("Invalid Task ID");
  }

  let task = tasks.find((t) => t.id === taskId);

  if (!task) {
    res.status(400).send(`Task with ${taskId} not found in the array`);
  } else {
    res.status(200).send(task);
  }
});

//GET the task by priority levels
app.get("/tasks/priority/:level", (req, res) => {
  let level = req.params.level;
  if (!level) {
    res.status(400).send("Not Valid level");
  }

  let priorityTasks = tasks.filter((t) => t.priority === level);

  if (priorityTasks.length === 0) {
    res
      .status(404)
      .send("No tasks with this priority level (Use low/medium/high)");
  } else {
    res.status(200).send(priorityTasks);
  }
});


//POST new task

let tasksArray = tasks;

app.post("/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Incomplete task details provided" });
  }

  // Find the maximum ID in the existing tasksArray
  const maxId = tasksArray.reduce((max, task) => (task.id > max ? task.id : max), 0);


  const newTask = {
    id: maxId + 1,
    title,
    description,
    priority,
    completed: false,
  };

  console.log(newTask);
  tasksArray.push(newTask);

  // Update the task.js file with the new tasks array
  fs.writeFileSync(
    "./task.js",
    `const tasks = ${JSON.stringify(tasksArray, null, 2)}; module.exports = tasks`
  );

  res.status(201).json(tasksArray);
});

//PUT update existing task by its ID
app.put("/tasks/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(400).send("Invalid Task");
  }
  const { title, description, priority, completed } = req.body;

  //Update the task
  task.title = title;
  task.description = description;
  task.priority = priority;

  if (completed !== undefined) {
    task.completed = completed;
  }

  //Update the task.js file
  fs.writeFileSync(
    "./task.js",
    `const tasks = ${JSON.stringify(tasksArray, null, 2)}; module.exports = tasks`
  );

  res.status(200).send(task);
});

//DELETE the task from array
app.delete("/tasks/:id",(req,res) => {
  let id = parseInt(req.params.id);
  let taskid = tasks.find((t) => t.id === id);

  if(!taskid){
    return res.status(400).send(`Task with ${id} not found to delete`);
  }

  const deleteTask = tasks.splice(taskid,1)[0];

  //Update the task.js file
  fs.writeFileSync(
    "./task.js",
    `const tasks = ${JSON.stringify(tasks, null, 2)}; module.exports = tasks`
  );

  res.status(200).send(deleteTask);

});


app.listen(port, (err) => {
  if (err) {
    console.log("error!");
  } else {
    console.log(`server is running on ${port}`);
  }
});
