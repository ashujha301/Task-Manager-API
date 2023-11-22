const express = require("express");
const bodyParser = require('body-parser');
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

//Get single task by id
app.get("/tasks/:id", (req, res) => {
  let taskId = req.params.id;
  if (!taskId) {
    res.status(400).send("Invalid Task ID");
  }
  
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

app.post('/tasks', (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ error: 'Incomplete task details provided' });
  }

  const newTask = {
    id: tasksArray.length + 1,
    title,
    description,
    priority,
    completed: false,
  };

  console.log(newTask);
  tasksArray.push(newTask);

  // Update the task.js file with the new tasks array
  fs.writeFileSync('./task.js', `module.exports = ${JSON.stringify(tasksArray, null, 2)};`);

  res.status(201).json(tasksArray);
});

//UPDATE existing task by its ID
app.put("/tasks/:id" , (req ,res) => {
  let id = parseInt(req.params.id);
  let task =  tasks.find((t)=> t.id === id);

  if(!task){
    return res.status(400).send("Invalid Task");
  }
  const {title , description , priority , completed} = req.body;
  if(!title || !description || !priority){
    return res.status(400).send("Please provide all fields");
    }

    //Update the task 
    task.title = title;
    task.description = description;
    task.priority = priority;

    if(completed !== undefined){
      task.completed = completed;
    }

    //Update the task.js file 
    fs.writeFileSync('./task.js', `module.exports = ${JSON.stringify(tasksArray, null, 2)};`);

    res.status(200).send(task);
})

app.listen(port, (err) => {
  if (err) {
    console.log("error!");
  } else {
    console.log(`server is running on ${port}`);
  }
});
