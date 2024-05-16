// controllers/reservationsController.js
const Reservation = require('../models/reservation');

const calculateTotalAmount = (startDate, endDate) => {
    const dayInMillis = 24 * 60 * 60 * 1000;
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / dayInMillis) + 1;
    return days * 150;
};

exports.createReservation = async (req, res) => {
    const { vehicleId, startDate, endDate } = req.body;

    try {
        const existingReservations = await Reservation.checkAvailability(vehicleId, startDate, endDate);
        if (existingReservations.length > 0) {
            return res.status(400).json({ message: 'Veículo já reservado para este período' });
        }

        const totalAmount = calculateTotalAmount(startDate, endDate);
        const reservationId = await Reservation.create(vehicleId, startDate, endDate, totalAmount);

        res.status(201).json({ message: 'Reserva criada com sucesso', reservationId, totalAmount });
    } catch (err) {
        // console.error('Erro ao criar reserva:', err.message);
        res.status(500).json({ error: 'Erro ao criar reserva.' });
    }
};
