// models/reservation.js
const db = require('./db');

const Reservation = {
    create: async function (vehicleId, startDate, endDate, totalAmount) {
        const sql = 'INSERT INTO reservations (vehicle_id, start_date, end_date, total_amount) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [vehicleId, startDate, endDate, totalAmount]);
        return result.insertId;
    },
    checkAvailability: async function (vehicleId, startDate, endDate) {
        const sql = `
            SELECT * FROM reservations
            WHERE vehicle_id = ?
            AND (start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ?)
        `;
        const [rows] = await db.query(sql, [vehicleId, startDate, endDate, startDate, endDate]);
        return rows;
    }
};

module.exports = Reservation;
