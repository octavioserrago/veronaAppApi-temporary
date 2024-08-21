const branchModel = require('../models/branchModel');


exports.index = async (req, res) => {
    try {
        const results = await branchModel.all();
        res.json({ success: true, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar las sucursales' });
    }
}


exports.store = async (req, res) => {
    const { nombre } = req.body;
    try {
        await branchModel.create({ nombre });
        res.json({ success: true, message: 'La sucursal se ha creado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar agregar la sucursal' });
    }
}


exports.show = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await branchModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'La sucursal no existe o ha dejado de existir' });
        } else {
            res.json({ success: true, result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar la sucursal' });
    }
}


exports.update = async (req, res) => {
    const { ID } = req.params;
    const { nombre } = req.body;
    try {
        branchModel.update({ nombre, ciudad, direccion, ID });
        res.json({ success: true, message: 'La sucursal se ha modificado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar la sucursal' });
    }
}
