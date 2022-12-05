const conn = require('../db/conn');
const query = require('../db/query');
const crypto = require('crypto');

async function addMaintainLog(maintainLog) {
    // generate id and check for duplication
    let id = crypto.randomBytes(5).toString('hex');
    const findDuplicate = await query(conn, "SELECT id FROM maintainLog WHERE ?", { id });
    while(findDuplicate.length){
        id = crypto.randomBytes(5).toString('hex');
        findDuplicate = await query(conn, "SELECT id FROM maintainLog WHERE ?", { id });
    }
    
    if(maintainLog.createdAt) {
        const q = "INSERT INTO maintainLog(id, vehicle_id, createdAt, detail, cost) VALUES (?,?,?,?,?)";
        const params = [
            id,
            maintainLog.vehicle_id,
            maintainLog.createdAt,
            maintainLog.detail,
            maintainLog.cost
        ];
        await query(conn, q, params);
    }
    else {
        const q = "INSERT INTO maintainLog(id, vehicle_id, detail, cost) VALUES (?,?,?,?)";
        const params = [
            id,
            maintainLog.vehicle_id,
            maintainLog.detail,
            maintainLog.cost
        ];
        await query(conn, q, params);
    }
}

async function getMaintainLogById(id) {
    const res = await query(conn, "SELECT * FROM maintainLog WHERE ?", { id });
    return res.length ? res[0] : null;
}

async function getMaintainLogByVehicle(id) {
    return await query(conn, "SELECT * FROM maintainLog WHERE ?", { vehicle_id: id });
}

async function getAllMaintainLog() {
    return await query(conn, "SELECT * FROM maintainLog", []);
}

module.exports = {
    addMaintainLog,
    getMaintainLogById,
    getMaintainLogByVehicle,
    getAllMaintainLog
}