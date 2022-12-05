const Employee = require('../models/user');

async function getEmployeeByRole(req, res) {
    try {
        const result = await Employee.getEmployeeByRole(req.body.role)
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    getEmployeeByRole
}