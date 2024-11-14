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
    const { sale_id, blueprintCode, material, colour, status } = req.body;
    console.log("Received data:", { sale_id, blueprintCode, material, colour, status });

    try {
        await blueprintModel.create({ sale_id, blueprintCode, material, colour, status });
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
    const { sale_id, blueprintCode, material, colour, status } = req.body;

    try {
        const result = await blueprintModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'El plano no existe o ha dejado de existir' });
        } else {
            try {
                const updateResult = await blueprintModel.update(ID, {
                    sale_id,
                    blueprintCode,
                    material,
                    colour,
                    status
                });
                res.json({ success: true, result: updateResult });
            } catch (updateError) {
                console.error('Error durante la actualización:', updateError);
                res.status(500).json({ success: false, message: 'Error al intentar actualizar el plano', error: updateError.message });
            }
        }
    } catch (error) {
        console.error('Error al buscar el plano:', error);
        res.status(500).json({ success: false, message: 'Error al intentar encontrar el plano', error: error.message });
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

exports.verPlanos = async (req, res) => {
    const { ID } = req.params;
    try {
        const results = await blueprintModel.findBySaleId(ID);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error al obtener los planos de la venta:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los planos de la venta' });
    }
};

exports.getPlanosPorVenta = async (req, res) => {
    const { ID } = req.params;
    try {
        const results = await blueprintModel.findBySaleId(ID);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron planos para esta venta' });
        }
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error al obtener los planos de la venta:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los planos de la venta' });
    }
};


exports.verFotosPorVenta = async (req, res) => {
    const { ID } = req.params;
    try {
        const results = await blueprintModel.findPhotosBySaleId(ID);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron fotos para esta venta' });
        }
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error al obtener las fotos de la venta:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las fotos de la venta' });
    }
};

exports.updateBlueprintStatus = async (req, res) => {
    const { ID } = req.params;
    const { status } = req.body;

    try {
        const result = await blueprintModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'El plano no existe o ha dejado de existir' });
        } else {
            try {
                const updateResult = await blueprintModel.update(ID, {
                    status
                });
                res.json({ success: true, result: updateResult });
            } catch (updateError) {
                console.error('Error durante la actualización:', updateError);
                res.status(500).json({ success: false, message: 'Error al intentar actualizar el plano', error: updateError.message });
            }
        }
    } catch (error) {
        console.error('Error al buscar el plano:', error);
        res.status(500).json({ success: false, message: 'Error al intentar encontrar el plano', error: error.message });
    }
};