const MCP = require('../models/mcp');

async function addMCP(req, res) {
    try{
        const mcp = req.body;
        await MCP.addMCP(mcp);
        res.status(201).send("MCP added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMCPById(req, res) {
    try {
        const result = await MCP.getMCPById(req.params.id);
        result ? res.send(result) : res.status(404).send("MCP not found");        
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMCPByCoordinate(req, res) {
    try {
        const result = await MCP.getMCPByCoordinate(req.body.latitude, req.body.longitude);
        result ? res.send(result) : res.status(404).send("MCP not found");        
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function updateMCPCurrent(req, res) {
    try {
        await MCP.updateMCPCurrent(req.body.id, req.body.current);
        res.status(200).send("MCP current status updated");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMCPCurrent(req, res) {
    try {
        const result = await MCP.getMCPCurrent(req.params.id);
        result ? res.send(result) : res.status(404).send("MCP not found");        
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMCPCurrentPercentage(req, res) {
    try {
        const mcp = await MCP.getMCPById(req.params.id);
        const current = await MCP.getMCPCurrent(req.params.id);
        if(!mcp || !current) res.status(404).send("MCP not found");        

        const percentage = (current.current / mcp.capacity) * 100;
        console.log(current.current);
        console.log(mcp.capacity);
        res.send({
            id: req.params.id,
            percentage: percentage
        })
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function simulateMCPStatusUpdating(req, res) {
    try {
        const current = await MCP.getMCPCurrent(req.params.id);
        if(!current) res.status(404).send("MCP not found");

        const increment = Math.round(Math.random()*20);
        current.current += increment;
        await MCP.updateMCPCurrent(current.id, current.current);
        res.send("MCP status updated");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addMCP,
    getMCPById,
    getMCPByCoordinate,
    updateMCPCurrent,
    getMCPCurrent,
    getMCPCurrentPercentage,
    simulateMCPStatusUpdating
}