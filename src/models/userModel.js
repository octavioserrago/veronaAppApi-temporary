const pool = require('../../db');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.all = async () => {
    const query = 'SELECT user_id, user_name, user_password, branch_id, is_adm FROM users'; // Incluir is_adm
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};

// Crear un usuario
exports.create = async ({ user_name, password, branch_id, is_adm }) => {
    const saltRounds = 10;
    try {
        console.log('Recibiendo datos para crear usuario:', { user_name, password, branch_id, is_adm });

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Contraseña encriptada generada:', hashedPassword);

        // Insertar en la base de datos
        const query = 'INSERT INTO users (user_name, user_password, branch_id, is_adm) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [user_name, hashedPassword, branch_id, is_adm]);

        console.log('Resultado de inserción en la base de datos:', result);

        return { success: true, message: 'Usuario creado exitosamente' };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Buscar un usuario por ID
exports.find = async (ID) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id, is_adm FROM users WHERE user_id = ?'; // Incluir is_adm
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

// Actualizar un usuario
exports.update = async ({ ID, name, password, is_adm }) => {
    const query = 'UPDATE users SET user_name = ?, user_password = ?, is_adm = ? WHERE user_id = ?'; // Incluir is_adm
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(query, [name, hashedPassword, is_adm, ID]); // Actualizar is_adm
        return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        throw error;
    }
};

// Autenticar un usuario
exports.auth = async ({ name, password }) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id, is_adm FROM users WHERE user_name = ?'; // Incluir is_adm
    try {
        console.log('Intentando autenticar usuario:', { name, password });

        // Consulta a la base de datos
        const [rows] = await pool.query(query, [name]);
        console.log('Resultado de la consulta a la base de datos:', rows);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Usuario encontrado en la BD:', user);

            // Comparación de contraseñas
            const isPasswordValid = await bcrypt.compare(password, user.user_password);
            console.log('¿Contraseña válida?:', isPasswordValid);

            if (isPasswordValid) {
                console.log('Autenticación exitosa para usuario:', user.user_name);
                return user;
            } else {
                console.log('Contraseña incorrecta para usuario:', user.user_name);
            }
        } else {
            console.log('No se encontró el usuario en la base de datos.');
        }
        return null;
    } catch (error) {
        console.error('Error en auth:', error);
        throw error;
    }
};

// Eliminar un usuario
exports.delete = async (ID) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};
