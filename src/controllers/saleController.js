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

exports.filterAll = async (req, res) => {
    try {
        const { status, branch_id, complete_payment, created_at } = req.query;

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
            } else {
                return res.status(400).json({ success: false, message: 'Valor inválido para complete_payment' });
            }
        }

        // Filtro por fecha específica
        if (created_at) {
            const date = new Date(created_at);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ success: false, message: 'Fecha inválida en created_at' });
            }
            query += ' AND DATE(created_at) = ?';
            params.push(date.toISOString().split('T')[0]); // Formatear como 'YYYY-MM-DD'
        }

        // Ejecutar la consulta y devolver los resultados
        const [sales] = await pool.query(query, params);
        res.json({ success: true, sales });
    } catch (error) {
        console.error('Error al intentar filtrar las ventas:', error);
        res.status(500).json({ success: false, message: `Error interno del servidor: ${error.message}` });
    }
};
