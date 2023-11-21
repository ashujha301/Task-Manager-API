const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Task Manager API Application !!");
});

//Get all the tasks
app.get("/tasks", (req, res) => {
  let tasks = require("./task");
  res.status(200).send(tasks);
});

//Get single task by id
app.get("/tasks/:id", (req, res) => {
  let taskId = req.params.id;
  if (!taskId) {
    res.status(400).send("Invalid Task ID");
  }
  let tasks = require("./task");
  let task = tasks.find((t) => t.id === parseInt(taskId));

  if (!task) {
    res.status(400).send("Task not found");
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
  let tasks = require("./task");
  let priorityTasks = tasks.filter((t) => t.priority === level);

  if (priorityTasks.length === 0) {
    res
      .status(404)
      .send("No tasks with this priority level (Use low/medium/high)");
  } else {
    res.status(200).send(priorityTasks);
  }
});

//Post new tasks
// app.post("/tasks", (req, res) => {
//   let task = {
//     "id": req.body.id,
//     "title": req.body.title,
//     "description": req.body.description,
//     "priority": req.body.priority,
//     "completed": req.body.completed,
//   };

//   //Adding a new task to array of tasks
//   let tasks = require("./task");
//   tasks.push(task);
//   //console.log(tasks);
//   //Saving data in json file
//   const jsCode = `tasks = ${stringify(tasks)};`;

//   // Use fs.writeFile with a callback
//   fs.writeFile("./task.js", jsCode, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Internal Server Error");
//     } else {
//       res.status(201).send({ message: "New task added successfully !!" });
//     }
//   });
// });

app.listen(port, (err) => {
  if (err) {
    console.log("error!");
  } else {
    console.log(`server is running on ${port}`);
  }
});
