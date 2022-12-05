const Task = require('../models/task');

async function addTask(req, res) {
    const task = req.body;
    try {
        await Task.addTask(task);
        res.status(201).send("Task added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getTaskById(req, res) {
    try {
        const result = await Task.getTaskById(req.params.id);
        if(!result) return res.status(404).send("Task not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getTaskByEmployee(req, res) {
    try {
        const result = await Task.getTaskByEmployee(req.params.id);
        if(result.length == 0) return res.status(404).send("Employee's tasks not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function removeTaskById(req, res) {
    try {
        await Task.removeTaskById(req.params.id);
        res.status(204).send("Task removed successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addTask,
    getTaskById,
    getTaskByEmployee,
    removeTaskById
}