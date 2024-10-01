const blueprintModel = require('../models/blueprintModel');


exports.index = async (req, res) => {
    try {
        const results = await blueprintModel.all();
        res.json({ success: true, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar los planos' });
    }
}

exports.store = async (req, res) => {
    const { sale_id, blueprintCode, description, material, colour } = req.body;
    console.log("Received data:", { sale_id, blueprintCode, description, material, colour });

    try {
        await blueprintModel.create({ sale_id, blueprintCode, description, material, colour });
        res.json({ success: true, message: 'El plano se ha creado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar agregar al plano' });
    }
}

exports.show = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await blueprintModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'El plano no existe o ha dejado de existir' });
        } else {
            res.json({ success: true, result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar el plano' });
    }
}

exports.update = async (req, res) => {
    const { ID } = req.params;
    const { sale_id, blueprintCode, description, material, colour } = req.body;

    try {
        const result = await blueprintModel.find(ID);
        console.log('Resultado de `find`:', result);

        if (result == null) {
            res.status(404).json({ success: false, message: 'El plano no existe o ha dejado de existir' });
        } else {
            try {
                const updateResult = await blueprintModel.update(ID, { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status });
                res.json(updateResult);
            } catch (updateError) {
                console.error('Error durante la actualización:', updateError);
                res.status(500).json({ success: false, message: 'Error al intentar actualizar la venta', error: updateError.message });
            }
        }
    } catch (error) {
        console.error('Error al buscar la venta:', error);
        res.status(500).json({ success: false, message: 'Error al intentar encontrar la venta', error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { ID } = req.params;

    try {
        const result = await blueprintModel.find(ID);

        if (result == null) {
            res.status(404).json({ success: false, message: 'El plano no existe o ha dejado de existir' });
        } else {
            await blueprintModel.delete(ID);
            res.json({ success: true, message: 'El plano se ha eliminado correctamente' });
        }
    } catch (error) {
        console.error('Error al intentar eliminar el plano:', error);
        res.status(500).json({ success: false, message: 'Error al intentar eliminar el plano', error: error.message });
    }
};

exports.seePhotos = async (req, res) => {
    const saleId = req.params.ID;

    try {
        const blueprintQuery = `
            SELECT blueprint_id 
            FROM blueprints 
            WHERE sale_id = $1
        `;
        const blueprintResult = await pool.query(blueprintQuery, [saleId]);

        if (blueprintResult.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró ningún plano asociado a esta venta.' });
        }

        const blueprintId = blueprintResult.rows[0].blueprint_id;

        const photoQuery = `
            SELECT photo_url 
            FROM blueprint_photos 
            WHERE blueprint_id = $1
        `;
        const photoResult = await pool.query(photoQuery, [blueprintId]);

        if (photoResult.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron fotos para este plano.' });
        }

        return res.status(200).json(photoResult.rows);
    } catch (error) {
        console.error('Error al obtener las fotos:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
