const pool = require('../../db');

exports.all = async () => {
    const query = 'SELECT * FROM blueprints';
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.create = async ({ sale_id, blueprintCode, description, material, colour }) => {
    const query = 'INSERT INTO blueprints (sale_id, blueprintCode, description, material, colour) VALUES (?, ?, ?, ?, ?)';
    try {
        await pool.query(query, [sale_id, blueprintCode, description, material, colour]);
        return { success: true, message: 'El plano se ha creado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.find = async (ID) => {
    const query = 'SELECT * FROM blueprints WHERE blueprint_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.update = async (ID, { sale_id, blueprintCode, description, material, colour }) => {
    const query = 'UPDATE blueprints SET sale_id = ?, blueprintCode = ?, description = ?, material = ?, colour = ? WHERE blueprint_id = ?';
    try {
        const [result] = await pool.query(query, [sale_id, blueprintCode, description, material, colour, ID]);
        if (result.affectedRows === 0) {
            throw new Error('No se actualizó ninguna fila');
        }
        return { success: true, message: 'El plano se ha actualizado correctamente' };
    } catch (error) {
        console.error('Error en la actualización:', error);
        throw error;
    }
};

exports.delete = async (ID) => {
    const query = 'DELETE FROM blueprints WHERE blueprint_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};

// Obtener todos los planos relacionados a una venta
exports.findBySaleId = async (sale_id) => {
    const query = 'SELECT blueprint_id, blueprintCode, description FROM blueprints WHERE sale_id = ?';
    try {
        const [results] = await pool.query(query, [sale_id]);
        return results;
    } catch (error) {
        throw error;
    }
};

// Obtener fotos asociadas a un plano específico
exports.findPhotosBySaleId = async (sale_id) => {
    const query = `
        SELECT bp.photo_url 
        FROM blueprint_photos bp 
        JOIN blueprints b ON bp.blueprint_id = b.blueprint_id 
        WHERE b.sale_id = ?;
    `;
    try {
        const [results] = await pool.query(query, [sale_id]);
        return results;
    } catch (error) {
        throw error;
    }
};
