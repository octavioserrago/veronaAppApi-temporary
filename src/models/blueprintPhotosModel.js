const pool = require('../../db');

exports.all = async () => {
    const query = 'SELECT * FROM blueprint_photos';
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.create = async ({ blueprint_id, photo_url }) => {
    const query = 'INSERT INTO blueprint_photos (blueprint_id, photo_url) VALUES (?, ?)';
    try {
        await pool.query(query, [blueprint_id, photo_url]);
        return { success: true, message: 'La foto del plano se ha creado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.find = async (ID) => {
    const query = 'SELECT * FROM blueprint_photos WHERE id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.update = async (ID, { blueprint_id, photo_url }) => {
    const query = 'UPDATE blueprint_photos SET blueprint_id = ?, photo_url = ? WHERE id = ?';
    try {
        const [result] = await pool.query(query, [blueprint_id, photo_url, ID]);
        if (result.affectedRows === 0) {
            throw new Error('No se actualizó ninguna fila');
        }
        return { success: true, message: 'La foto del plano se ha actualizado correctamente' };
    } catch (error) {
        console.error('Error en la actualización:', error);
        throw error;
    }
};

exports.delete = async (ID) => {
    const query = 'DELETE FROM blueprint_photos WHERE id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};

// Obtener todas las fotos relacionadas a un plano específico
exports.findByBlueprintId = async (blueprint_id) => {
    const query = 'SELECT * FROM blueprint_photos WHERE blueprint_id = ?';
    try {
        const [results] = await pool.query(query, [blueprint_id]);
        return results;
    } catch (error) {
        throw error;
    }
};
