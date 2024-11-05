const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.index = async (req, res) => {
    try {
        const results = await userModel.all();
        res.json({ success: true, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar usuarios' });
    }
}


exports.store = async (req, res) => {
    const { user_name, password, branch_id } = req.body;
    console.log("Request body:", req.body);
    console.log("Received data:", { user_name, password, branch_id });

    if (!user_name || !password || !branch_id) {
        return res.status(400).json({ success: false, message: "Todos los campos son requeridos." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({ user_name, password: hashedPassword, branch_id });
        res.json({ success: true, message: 'El usuario se ha creado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar agregar usuario' });
    }
};


exports.show = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await userModel.find(ID);
        if (result == null) {
            res.status(404).json({ success: false, message: 'El usuario no existe o ha dejado de existir' });
        } else {
            res.json({ success: true, result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar el usuario' });
    }
}


exports.update = async (req, res) => {
    const { ID } = req.params;
    const { name, password } = req.body;

    console.log('Datos recibidos:', { ID, name, password });

    try {
        if (!name && !password) {
            return res.status(400).json({ success: false, message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        await userModel.update({ ID, name, password });
        res.json({ success: true, message: 'El usuario se ha modificado correctamente' });
    } catch (error) {
        console.error('Error al intentar actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al intentar actualizar el usuario' });
    }
};


exports.auth = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await userModel.auth({ name, password });
        if (user) {

            const payload = {
                id: user.user_id,
                name: user.user_name,
                branch_id: user.branch_id
            };


            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            res.json({ success: true, message: 'Autenticación exitosa', user, token: accessToken });

        } else {
            res.status(401).json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar autenticar el usuario' });
    }
};

exports.delete = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await userModel.delete(ID);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
};