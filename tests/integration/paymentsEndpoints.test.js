// tests/integration/paymentsEndpoints.test.js
const request = require('supertest');
const app = require('../../app');
const db = require('../../models/db');

let lastInsertedVehicleId;
let lastInsertedReservationId;

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

  await db.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reservation_id INT,
      method ENUM('credit_card', 'debit_card', 'boleto'),
      status ENUM('pending', 'completed', 'failed'),
      FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    )
  `);

  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('DELETE FROM payments');
  await db.query('DELETE FROM reservations');
  await db.query('DELETE FROM vehicles');
  await db.query('SET FOREIGN_KEY_CHECKS = 1');

  const [vehicleResult] = await db.query(`
    INSERT INTO vehicles (marca, modelo, ano, placa) VALUES
    ('Toyota', 'Corolla', 2020, 'ABC-1234'),
    ('Honda', 'Civic', 2021, 'DEF-5678')
  `);

  lastInsertedVehicleId = vehicleResult.insertId;

  const [reservationResult] = await db.query(`
    INSERT INTO reservations (vehicle_id, start_date, end_date, total_amount) VALUES
    (${lastInsertedVehicleId}, '2024-05-10', '2024-05-15', 750)
  `);

  lastInsertedReservationId = reservationResult.insertId;
});

afterAll(async () => {
  await db.end();
});

describe('Payments Endpoints', () => {
  it('should process a credit card payment', async () => {
    const res = await request(app)
      .post('/payments')
      .send({
        reservationId: lastInsertedReservationId,
        method: 'credit_card',
        cardDetails: {
          number: '4111111111111111',
          expiryMonth: '12',
          expiryYear: '2024',
          cvv: '123'
        }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Pagamento realizado com sucesso');
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should process a boleto payment', async () => {
    const res = await request(app)
      .post('/payments')
      .send({
        reservationId: lastInsertedReservationId,
        method: 'boleto'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Pagamento realizado com sucesso');
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should return 400 if payment method is invalid', async () => {
    const res = await request(app)
      .post('/payments')
      .send({
        reservationId: lastInsertedReservationId,
        method: 'crypto'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Método de pagamento inválido');
  });
});
