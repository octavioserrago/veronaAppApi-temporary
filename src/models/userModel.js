const pool = require('../../db');
const bcrypt = require('bcrypt');

exports.all = async () => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users';
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.create = async ({ name, password, branch_id }) => {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (user_name, user_password, branch_id) VALUES (?, ?, ?)';
        await pool.query(query, [name, hashedPassword, branch_id]);
        return { success: true, message: 'Usuario creado exitosamente' };
    } catch (error) {
        throw error;
    }
};

exports.find = async (ID) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users WHERE user_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.update = async ({ ID, name, password }) => {
    const query = 'UPDATE users SET user_name = ?, user_password = ? WHERE user_id = ?';
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(query, [name, hashedPassword, ID]);
        return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.auth = async ({ name, password }) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users WHERE user_name = ?';
    try {
        const [rows] = await pool.query(query, [name]);
        if (rows.length > 0) {
            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.user_password);
            if (isPasswordValid) {
                return user;
            }
        }
        return null;
    } catch (error) {
        throw error;
    }
};

exports.delete = async (ID) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};
