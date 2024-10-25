const blueprintPhotosModel = require('../models/blueprintPhotosModel');

exports.index = async (req, res) => {
    try {
        const results = await blueprintPhotosModel.all();
        res.json({ success: true, results });
    } catch (error) {
        console.error(error); // Mejor práctica para la depuración
        res.status(500).json({ success: false, message: 'Error al intentar recuperar las fotos de los planos' });
    }
};

exports.store = async (req, res) => {
    const { blueprint_id, photo_url } = req.body;
    console.log("Received data:", { blueprint_id, photo_url });

    try {
        // Validar datos de entrada
        if (!blueprint_id || !photo_url) {
            return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
        }

        await blueprintPhotosModel.create({ blueprint_id, photo_url });
        res.json({ success: true, message: 'La foto del plano se ha creado correctamente' });
    } catch (error) {
        console.error(error); // Mejor práctica para la depuración
        res.status(500).json({ success: false, message: 'Error al intentar agregar la foto del plano' });
    }
};

exports.show = async (req, res) => {
    const { ID } = req.params;

    try {
        const result = await blueprintPhotosModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'La foto no existe o ha dejado de existir' });
        } else {
            res.json({ success: true, result });
        }
    } catch (error) {
        console.error(error); // Mejor práctica para la depuración
        res.status(500).json({ success: false, message: 'Error al intentar recuperar la foto' });
    }
};

exports.update = async (req, res) => {
    const { ID } = req.params;
    const { blueprint_id, photo_url } = req.body; // Asegúrate de recibir los datos necesarios

    try {
        const existingPhoto = await blueprintPhotosModel.find(ID);
        console.log('Resultado de `find`:', existingPhoto);

        if (existingPhoto == null) {
            return res.status(404).json({ success: false, message: 'La foto no existe o ha dejado de existir' });
        }

        // Actualizar solo si se proporciona un nuevo URL o ID
        const updatedData = {};
        if (blueprint_id) updatedData.blueprint_id = blueprint_id;
        if (photo_url) updatedData.photo_url = photo_url;

        const updateResult = await blueprintPhotosModel.update(ID, updatedData);
        res.json({ success: true, message: 'La foto se ha actualizado correctamente', result: updateResult });
    } catch (error) {
        console.error('Error al intentar actualizar la foto:', error); // Mejor práctica para la depuración
        res.status(500).json({ success: false, message: 'Error al intentar actualizar la foto', error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { ID } = req.params;

    try {
        const existingPhoto = await blueprintPhotosModel.find(ID);

        if (existingPhoto == null) {
            return res.status(404).json({ success: false, message: 'La foto no existe o ha dejado de existir' });
        }

        await blueprintPhotosModel.delete(ID);
        res.json({ success: true, message: 'La foto se ha eliminado correctamente' });
    } catch (error) {
        console.error('Error al intentar eliminar la foto:', error); // Mejor práctica para la depuración
        res.status(500).json({ success: false, message: 'Error al intentar eliminar la foto', error: error.message });
    }
};
