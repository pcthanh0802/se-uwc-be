const Setting = require('../models/setting');

async function addSetting(req, res) {
    const setting = req.body;
    try{
        await Setting.addSetting(setting);
        res.status(201).send("Setting added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getSettingByUser(req, res) {
    try{
        const result = await Setting.getSettingByUser(req.params.id);
        if(!result) res.send("Setting not found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function updateSetting(req, res) {
    try {
        const id = req.params.id;
        const update = req.body;
        await Setting.updateSetting(id, update);
        res.send("Setting updated")
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addSetting,
    getSettingByUser,
    updateSetting
}