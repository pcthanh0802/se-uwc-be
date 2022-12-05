const Vehicle = require('../models/vehicle');

async function addVehicle(req, res) {
    const vehicle = req.body;
    try{
        await Vehicle.addVehicle(vehicle);
        res.status(201).send("Vehicle added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getVehicleById(req, res) {
    try {
        const result = await Vehicle.getVehicleById(req.params.id);
        if(!result) return res.status(404).send("Vehicle not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getVehicleByType(req, res) {
    try {
        const result = await Vehicle.getVehicleByType(req.body.type);
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getAllVehicle(req, res) {
    try {
        const result = await Vehicle.getAllVehicle();
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addVehicle,
    getVehicleById,
    getVehicleByType,
    getAllVehicle
}