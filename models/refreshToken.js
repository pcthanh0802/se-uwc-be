const conn = require('../db/conn');
const query = require('../db/query');

async function refreshTokenExist(token) {
    const q = "SELECT refreshToken FROM refreshToken WHERE ?";
    const params = { refreshToken: token };
    const findResult =  await query(conn, q, params).catch(console.log);
    return findResult.length > 0;
}

async function insertRefreshToken(refreshToken) {
    const q = "INSERT INTO refreshToken(refreshToken) VALUES (?)";
    const params = [refreshToken];
    await query(conn, q, params);
}

async function removeRefreshToken(token) {
    await query(conn, "DELETE FROM refreshToken WHERE ?", { refreshToken: token });
}

module.exports = {
    refreshTokenExist,
    insertRefreshToken,
    removeRefreshToken
}