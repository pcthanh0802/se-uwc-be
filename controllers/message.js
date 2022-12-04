const Message = require('../models/message')

async function addMessage(req, res) {
    const message = req.body;
    try{
        await Message.addMessage(message);
        res.status(201).send("Message added successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getMessage(req, res) {
    const user1 = req.body.user1;
    const user2 = req.body.user2;
    try {
        const result = await Message.getMessage(user1, user2);
        if(result.length == 0) res.status(404).send("No message was found");
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addMessage,
    getMessage
}