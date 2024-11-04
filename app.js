const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2/promise'); // Importa mysql2/promise para la conexión

const branchRoute = require('./src/routes/branchRoute');
const userRoute = require('./src/routes/userRoute');
const saleRoute = require('./src/routes/saleRoute');
const blueprintRoute = require('./src/routes/blueprintRoute');
const blueprintPhotosRoute = require('./src/routes/blueprintPhotosRoute');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/branches', branchRoute);
app.use('/users', userRoute);
app.use('/sales', saleRoute);
app.use('/blueprints', blueprintRoute);
app.use('/blueprintPhotos', blueprintPhotosRoute);

app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi aplicación!');
});

// Función para conectarse a la base de datos
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD // Si tienes contraseña
        });

        console.log('Conexión a la base de datos exitosa.');

        // Realiza una consulta simple
        const [rows] = await connection.query('SELECT NOW() AS currentTime');
        console.log('Hora actual en la base de datos:', rows[0].currentTime);

        // Cierra la conexión
        await connection.end();
    } catch (error) {
        console.error('Error al conectarse a la base de datos:', error);
    }
}

// Inicia el servidor y conecta a la base de datos
app.listen(port, async () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    console.log('Conectando a la base de datos con:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
    });

    // Llama a la función para conectar a la base de datos
    await connectToDatabase();
});
