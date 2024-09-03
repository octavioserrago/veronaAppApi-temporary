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
        res.status(500).json({ success: false, message: 'Error al intentar recuperar la venta' });
    }
}

exports.update = async (req, res) => {
    const { ID } = req.params;
    const { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status } = req.body;

    try {
        const result = await saleModel.find(ID);
        console.log('Resultado de `find`:', result);

        if (result == null) {
            res.status(404).json({ success: false, message: 'La venta no existe o ha dejado de existir' });
        } else {
            try {
                const updateResult = await saleModel.update(ID, { branch_id, customer_name, details, payment_method, total_amount, total_money_entries, status });
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
        const result = await saleModel.find(ID);

        if (result == null) {
            res.status(404).json({ success: false, message: 'La venta no existe o ha dejado de existir' });
        } else {
            await saleModel.delete(ID);
            res.json({ success: true, message: 'La venta se ha eliminado correctamente' });
        }
    } catch (error) {
        console.error('Error al intentar eliminar la venta:', error);
        res.status(500).json({ success: false, message: 'Error al intentar eliminar la venta', error: error.message });
    }
};

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

exports.filterSales = async (req, res) => {
    const { status, branch_id, complete_payment, created_at } = req.params;

    console.log('Parametros recibidos:', { status, branch_id, complete_payment, created_at });

    try {
        const filters = {};
        if (status) filters.status = status;
        if (branch_id) filters.branch_id = branch_id;
        if (complete_payment) filters.complete_payment = complete_payment;
        if (created_at) filters.created_at = created_at;

        const result = await saleModel.filterSales(filters);
        console.log('Resultado de la consulta:', result);
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};


