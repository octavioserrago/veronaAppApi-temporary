const pool = require('../../db');

exports.all = async () => {
    const query = 'SELECT * FROM sales';
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.create = async ({ branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status }) => {
    const query = 'INSERT INTO sales (branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        await pool.query(query, [branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status]);
        return { success: true, message: 'La venta se ha creado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.find = async (ID) => {
    const query = 'SELECT * FROM sales WHERE id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.update = async ({ ID, branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status }) => {
    const query = 'UPDATE sales SET branch_id = ?, customer_name = ?, details = ?, payment_method = ?, total_amount = ?, total_money_entries = ?, status = ? WHERE id = ?';
    try {
        await pool.query(query, [branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status, ID]);
        return { success: true, message: 'La venta se ha actualizado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.delete = async (ID) => {
    const query = 'DELETE FROM sales WHERE id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};
