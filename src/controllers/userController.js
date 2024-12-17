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
    const { user_name, password, branch_id, is_adm } = req.body;  // Agregar is_adm aquí
    console.log("Request body:", req.body);
    console.log("Received data:", { user_name, password, branch_id, is_adm });

    if (!user_name || !password || !branch_id || is_adm === undefined) {
        return res.status(400).json({ success: false, message: "Todos los campos son requeridos." });
    }

    try {
        // Si is_adm no se envía, se asigna un valor predeterminado de 0 (no administrador)
        const isAdmin = is_adm !== undefined ? is_adm : 0;

        await userModel.create({ user_name, password: password, branch_id, is_adm: isAdmin });
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
    const { name, password } = req.body;  // Eliminamos is_adm del destructuring porque será siempre 0

    console.log('Datos recibidos:', { ID, name, password });

    try {
        if (!name && !password) {
            return res.status(400).json({ success: false, message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        const is_adm = 0;

        await userModel.update({ ID, name, password, is_adm });
        res.json({ success: true, message: 'El usuario se ha modificado correctamente' });
    } catch (error) {
        console.error('Error al intentar actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al intentar actualizar el usuario' });
    }
};



exports.auth = async (req, res) => {
    console.log("Request body recibido en auth:", req.body);
    const { name, password } = req.body;
    console.log('Nombre de usuario recibido:', name);
    console.log('Contraseña recibida:', password);

    try {
        const user = await userModel.auth({ name, password });

        if (user) {
            console.log('Usuario encontrado:', user);
            const payload = {
                id: user.user_id,
                name: user.user_name,
                branch_id: user.branch_id,
                is_adm: user.is_adm
            };

            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            res.json({ success: true, message: 'Autenticación exitosa', user, token: accessToken });
        } else {
            console.log('No se encontró el usuario o contraseña incorrecta');
            res.status(401).json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
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