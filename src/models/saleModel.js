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
    const query = 'SELECT * FROM sales WHERE sale_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.findByName = async (customer_name) => {
    const query = 'SELECT * FROM sales WHERE customer_name LIKE ?';
    const params = [`%${customer_name}%`];
    try {
        const [results] = await pool.query(query, params);
        return results;
    } catch (error) {
        throw error;
    }
};


exports.update = async (ID, { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status }) => {
    const query = 'UPDATE sales SET branch_id = ?, customer_name = ?, details = ?, payment_method = ?, total_amount = ?, total_money_entries = ?, status = ? WHERE sale_id = ?';
    try {
        const [result] = await pool.query(query, [branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status, ID]);
        if (result.affectedRows === 0) {
            throw new Error('No se actualizó ninguna fila');
        }
        return { success: true, message: 'La venta se ha actualizado correctamente' };
    } catch (error) {
        console.error('Error en la actualización:', error);
        throw error;
    }
};

exports.filter = async ({ status, branch_id, complete_payment, start_date, end_date }) => {
    let query = 'SELECT * FROM sales WHERE 1=1';
    const params = [];

    // Filtro por estado
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    // Filtro por sucursal
    if (branch_id) {
        query += ' AND branch_id = ?';
        params.push(branch_id);
    }

    // Filtro por pago completo/incompleto
    if (complete_payment !== undefined) {
        if (complete_payment === 'true') {
            query += ' AND total_amount = total_money_entries';
        } else if (complete_payment === 'false') {
            query += ' AND total_amount > total_money_entries';
        }
    }

    // Filtro por rango de fechas
    if (start_date && end_date) {
        query += ' AND created_at BETWEEN ? AND ?';
        params.push(start_date, end_date);
    } else if (start_date) {
        query += ' AND created_at >= ?';
        params.push(start_date);
    } else if (end_date) {
        query += ' AND created_at <= ?';
        params.push(end_date);
    }

    try {
        const [results] = await pool.query(query, params);
        return results;
    } catch (error) {
        console.error('Error al filtrar ventas:', error);
        throw error;
    }
};