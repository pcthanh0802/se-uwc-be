const conn = require('../db/conn');
const query = require('../db/query');

async function addMessage(messageInfo) {
    if(messageInfo.sentAt) {
        const q = "INSERT INTO message VALUES (?,?,?,?)";
        const params = [
            messageInfo.sender_id,
            messageInfo.receiver_id,
            messageInfo.sentAt,
            messageInfo.content
        ];
        await query(conn, q, params);
    }
    else {
        const q = "INSERT INTO message(sender_id, receiver_id, content) VALUES (?,?,?)";
        const params = [
            messageInfo.sender_id,
            messageInfo.receiver_id,
            messageInfo.content
        ];
        await query(conn, q, params);
    }
}

async function getMessage(user1, user2) {
    return await query(
        conn, 
        'SELECT * FROM message WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sentAt DESC', 
        [user1, user2, user2, user1]    
    );
}

module.exports = {
    addMessage,
    getMessage
}