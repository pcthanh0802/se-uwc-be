const conn = require('../db/conn');
const query = require('../db/query');

async function addSetting(setting) {
    const q = "INSERT INTO setting VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const params = [
        setting.user_id,
        setting.theme_colour,
        setting.dark_theme,
        setting.colour_blind,
        setting.reduced_motion,
        setting.language,
        setting.message_notify,
        setting.employees_login,
        setting.employees_logout,
        setting.mcp_full_notify,
        setting.mcp_empty_notify,
        setting.maintain_log_update,
        setting.update_notify,
        setting.online_status,
        setting.auto_logout,
        setting.auto_send_crash_log
    ];
    await query(conn, q, params);
}

async function getSettingByUser(id) {
    const result = await query(conn, "SELECT * FROM setting WHERE ?", { user_id: id });
    return result.length ? result[0] : null;
}

async function updateSetting(id, update) {
    return await query(conn, `UPDATE setting SET ? WHERE user_id = \'${id}\'`, update);
}

module.exports = {
    addSetting,
    getSettingByUser,
    updateSetting
}