// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const vehicleRoutes = require('./routes/vehicles');
const reservationRoutes = require('./routes/reservations');
const paymentRoutes = require('./routes/payments');
const db = require('./models/db');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/vehicles', vehicleRoutes);
app.use('/reservations', reservationRoutes);
app.use('/payments', paymentRoutes);

const testDbConnection = async () => {
    try {
        const connection = await db.getConnection();
        if (process.env.NODE_ENV !== 'test') {
            console.log('Conexão com o banco de dados bem-sucedida');
        }
        connection.release();
    } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        }
    }
};

testDbConnection();

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;
