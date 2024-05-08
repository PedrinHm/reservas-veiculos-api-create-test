// tests/integration/reservationsEndpoints.test.js
const request = require('supertest');
const app = require('../../app');
const db = require('../../models/db');

let lastInsertedVehicleId;

beforeAll(async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      marca VARCHAR(50),
      modelo VARCHAR(50),
      ano INT,
      placa VARCHAR(10)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_id INT,
      start_date DATE,
      end_date DATE,
      total_amount DECIMAL(10, 2),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )
  `);

  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('DELETE FROM reservations');
  await db.query('DELETE FROM vehicles');
  await db.query('SET FOREIGN_KEY_CHECKS = 1');

  const [result] = await db.query(`
    INSERT INTO vehicles (marca, modelo, ano, placa) VALUES
    ('Toyota', 'Corolla', 2020, 'ABC-1234'),
    ('Honda', 'Civic', 2021, 'DEF-5678')
  `);

  lastInsertedVehicleId = result.insertId;
});

afterAll(async () => {
  await db.end();
});

describe('Reservations Endpoints', () => {
  it('should create a new reservation', async () => {
    const res = await request(app)
      .post('/reservations')
      .send({
        vehicleId: lastInsertedVehicleId,
        startDate: '2024-05-10',
        endDate: '2024-05-15'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Reserva criada com sucesso');
    expect(res.body).toHaveProperty('reservationId');
  });

  it('should not create a reservation if vehicle is already booked', async () => {
    // Criando reserva inicial
    await request(app)
      .post('/reservations')
      .send({
        vehicleId: lastInsertedVehicleId,
        startDate: '2024-05-10',
        endDate: '2024-05-15'
      });

    // Tentando criar uma nova reserva no mesmo período
    const res = await request(app)
      .post('/reservations')
      .send({
        vehicleId: lastInsertedVehicleId,
        startDate: '2024-05-10',
        endDate: '2024-05-15'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Veículo já reservado para este período');
  });
});
