const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const branchRoute = require('./src/routes/branchRoute');
const userRoute = require('./src/routes/userRoute');
const saleRoute = require('./src/routes/saleRoute');


const app = express();
const port = 3333;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/branches', branchRoute);
app.use('/users', userRoute);
app.use('/sales', saleRoute)


app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi aplicación!');
});

app.listen(port, () => {
    console.log(`Servidor iniciado en: http://localhost:${port}`);
});

//node --env-file=.env --watch app.js