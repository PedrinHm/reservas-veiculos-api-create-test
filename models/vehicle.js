// models/vehicle.js
const db = require('./db');

const Vehicle = {
    getAll: async function () {
        const sql = 'SELECT id, marca, modelo, ano, placa FROM vehicles';
        const [rows] = await db.query(sql);
        return rows;
    },
    getById: async function (id) {
        const sql = 'SELECT id, marca, modelo, ano, placa FROM vehicles WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }
};

module.exports = Vehicle;
