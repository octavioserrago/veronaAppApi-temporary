const connection = require('../../db');


exports.all = async () => {
    const query = `SELECT branch_id, branch_name FROM branches`;
    try {
        [results] = await connection.query(query);
        return results;
    } catch (error) {
        throw error;
    }
}


exports.create = async ({ nombre }) => {
    const query = `
        INSERT INTO branches (branch_name)
        VALUES(?)
    `;
    try {
        await connection.query(query, [nombre]);
    } catch (error) {
        throw error;
    }
}


exports.find = async (ID) => {
    const query = `
        SELECT branch_id, branch_name FROM branches WHERE branch_id = ?
    `;
    try {
        [results] = await connection.query(query, [ID]);
        return (results.length == 1) ? results[0] : null;
    } catch (error) {
        throw error;
    }
}


exports.update = async ({ ID, nombre }) => {
    const query = `
        UPDATE branches
        SET
            branch_name = ?
        WHERE id = ?
    `;
    try {
        await connection.query(query, [nombre, ID]);
    } catch (error) {
        throw error;
    }
}
