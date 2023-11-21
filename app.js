const express = require('express');
const app = express();

app.use(express.json());

let port =3000;

app.get("/" , (req,res) =>{
    res.status(200).send("Hello World!!");
})

//Get all the tasks
app.get("/tasks" , (req,res) =>{
    let tasks = require('./task');
    res.status(200).send(tasks);
})

//Get single task by id
app.get("/tasks/:id" , (req,res) =>{
    let taskId = req.params.id;
    if(!taskId){
        res.status(400).send("Invalid Task ID");
    }
    let tasks = require('./task');
    let task = tasks.find(t => t.id === parseInt(taskId));

    if(!task){
        res.status(400).send("Task not found");
    }else{
        res.status(200).send(task);
    }
})



app.listen(port, (err) => {
    if(err){
        console.log("error!")
    }else{
        console.log(`server is running on ${port}`);
    }
})