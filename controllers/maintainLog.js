const MaintainLog = require('../models/maintainLog');

async function addMaintainLog(req, res) {
    const log = req.body;
    try {
        await MaintainLog.addMaintainLog(log);
        res.status(201).send("Log added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMaintainLogById(req, res) {
    try {
        const result = await MaintainLog.getMaintainLogById(req.params.id);
        if(!result) return res.status(404).send("Log not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMaintainLogByVehicle(req, res) {
    try {
        const result = await MaintainLog.getMaintainLogByVehicle(req.params.id);
        if(!result) return res.status(404).send("Vehicle's log not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getAllMaintainLog(req, res) {
    try {
        const result = await MaintainLog.getAllMaintainLog();
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addMaintainLog,
    getMaintainLogById,
    getMaintainLogByVehicle,
    getAllMaintainLog
}