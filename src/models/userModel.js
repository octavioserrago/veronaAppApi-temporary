const pool = require('../../db');
const bcrypt = require('bcrypt');

exports.all = async () => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users';
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (error) {
        throw error;
    }
};


exports.create = async ({ user_name, password, branch_id }) => {
    const saltRounds = 10;
    try {
        console.log('Recibiendo datos para crear usuario:', { user_name, password, branch_id });

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Contraseña encriptada generada:', hashedPassword);

        // Insertar en la base de datos
        const query = 'INSERT INTO users (user_name, user_password, branch_id) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [user_name, hashedPassword, branch_id]);

        console.log('Resultado de inserción en la base de datos:', result);

        return { success: true, message: 'Usuario creado exitosamente' };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};


exports.find = async (ID) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users WHERE user_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results.length === 1 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

exports.update = async ({ ID, name, password }) => {
    const query = 'UPDATE users SET user_name = ?, user_password = ? WHERE user_id = ?';
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(query, [name, hashedPassword, ID]);
        return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        throw error;
    }
};

exports.auth = async ({ name, password }) => {
    const query = 'SELECT user_id, user_name, user_password, branch_id FROM users WHERE user_name = ?';
    try {
        console.log('Intentando autenticar usuario:', { name, password }); // Muestra el nombre y contraseña en texto plano

        // Consulta a la base de datos
        const [rows] = await pool.query(query, [name]);
        console.log('Resultado de la consulta a la base de datos:', rows);  // Verifica el resultado obtenido de la BD

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Usuario encontrado en la BD:', user); // Verifica el usuario recuperado
            console.log('Contraseña encriptada en la BD:', user.user_password);  // Muestra la contraseña encriptada del usuario

            // Comparación de contraseñas
            const isPasswordValid = await bcrypt.compare(password, user.user_password);
            console.log('¿Contraseña válida?:', isPasswordValid);  // Resultado de la comparación

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



exports.delete = async (ID) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    try {
        const [results] = await pool.query(query, [ID]);
        return results;
    } catch (error) {
        throw error;
    }
};