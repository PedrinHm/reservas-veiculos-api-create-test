// models/payment.js
const db = require('./db');

const Payment = {
    create: async function (reservationId, method, status) {
        const sql = 'INSERT INTO payments (reservation_id, method, status) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [reservationId, method, status]);
        return result.insertId;
    }
};

module.exports = Payment;
