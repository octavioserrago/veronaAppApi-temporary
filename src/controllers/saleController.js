const saleModel = require('../models/saleModel');

exports.index = async (req, res) => {
    try {
        const results = await saleModel.all();
        res.json({ success: true, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar ventas' });
    }
}

exports.store = async (req, res) => {
    const { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status } = req.body;
    console.log("Received data:", { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status });

    try {
        await saleModel.create({ branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status });
        res.json({ success: true, message: 'La venta se ha creado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar agregar la venta' });
    }
}

exports.show = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await saleModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'La venta no existe o ha dejado de existir' });
        } else {
            res.json({ success: true, result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar el usuario' });
    }
}

exports.delete = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await saleModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'La venta no existe o ha dejado de existir' });
        } else {
            await saleModel.delete(ID);
            res.json({ success: true, message: 'La venta se ha eliminado correctamente' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar eliminar la venta' });
    }
}

exports.update = async (req, res) => {
    const { ID } = req.params;
    const { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status } = req.body;

    try {
        const result = await saleModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'La venta no existe o ha dejado de existir' });
        } else {
            await saleModel.update(ID, { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status });
            res.json({ success: true, message: 'La venta se ha actualizado correctamente' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar actualizar la venta' });
    }
}


exports.findByName = async (req, res) => {
    const { customer_name } = req.params;

    try {
        const results = await saleModel.findByName(customer_name);

        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'No se encontraron ventas con ese nombre' });
        } else {
            res.json({ success: true, results });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar las ventas' });
    }
};


