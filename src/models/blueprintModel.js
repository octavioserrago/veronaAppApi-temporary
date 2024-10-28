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

exports.create = async ({ sale_id, blueprintCode, description, material, colour, status }) => {
    const query = 'INSERT INTO blueprints (sale_id, blueprintCode, description, material, colour, status) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        await pool.query(query, [sale_id, blueprintCode, description, material, colour, status]);
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
exports.update = async (ID, { sale_id, blueprintCode, description, material, colour, status }) => {
    const query = 'UPDATE blueprints SET sale_id = ?, blueprintCode = ?, description = ?, material = ?, colour = ?, status = ? WHERE blueprint_id = ?';

    try {
        // Ejecutar consulta para actualizar datos del plano
        const [result] = await pool.query(query, [sale_id, blueprintCode, description, material, colour, status, ID]);

        // Verificar si se actualizó alguna fila
        if (result.affectedRows === 0) {
            return { success: false, message: 'No se encontró el plano o no se realizó ninguna actualización' };
        }

        // Retornar mensaje de éxito si la actualización fue exitosa
        return { success: true, message: 'El plano se ha actualizado correctamente' };

    } catch (error) {
        console.error('Error en la actualización:', error);
        // Lanzar error con mensaje claro para manejarlo en la capa de controladores
        throw new Error('Error al intentar actualizar el plano: ' + error.message);
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


exports.findBySaleId = async (sale_id) => {
    const query = 'SELECT blueprint_id, blueprintCode, description, material, colour, status FROM blueprints WHERE sale_id = ?';
    try {
        const [results] = await pool.query(query, [sale_id]);
        return results;
    } catch (error) {
        throw error;
    }
};


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

exports.updateBlueprintStatus = async (id, { status }) => {
    const query = 'UPDATE blueprints SET status = ? WHERE blueprint_id = ?';

    try {
        const [result] = await pool.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'No se encontró el plano o no se realizó ninguna actualización.' };
        }

        return { success: true, message: 'El estado del plano se ha actualizado correctamente.' };

    } catch (error) {
        console.error('Error en la actualización:', error);
        return { success: false, message: 'Error al intentar actualizar el plano: ' + error.message };
    }
}
