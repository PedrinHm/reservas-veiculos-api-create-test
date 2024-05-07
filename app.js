// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const vehicleRoutes = require('./routes/vehicles');
const reservationRoutes = require('./routes/reservations');
const paymentRoutes = require('./routes/payments');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/vehicles', vehicleRoutes);
app.use('/reservations', reservationRoutes);
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
