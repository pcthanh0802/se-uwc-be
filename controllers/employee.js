const Employee = require('../models/user');

async function getEmployeeByRole(req, res) {
    try {
        const users = await Employee.getEmployeeByRole(req.body.role);
        const result = users.map(user => {
            delete user.password;
            return user;
        });
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
        delete result.password;
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