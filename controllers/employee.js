const Employee = require('../models/user');

async function getEmployeeByRole(req, res) {
    try {
        const result = await Employee.getEmployeeByRole(req.body.role)
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getEmployeeByUsername(req, res) {
    try {
        const result = await Employee.getEmployeeByUsername(req.params.username);
        if(!result) return res.status(404).send("User not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    getEmployeeByRole,
    getEmployeeByUsername
}