// tests/integration/reservationsEndpoints.test.js
const request = require('supertest');
const app = require('../../app');
const db = require('../../models/db');

let lastInsertedVehicleId;

async function setupDatabase() {
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

  const [result] = await db.query(`
    INSERT INTO vehicles (marca, modelo, ano, placa) VALUES
    ('Toyota', 'Corolla', 2020, 'ABC-1234'),
    ('Honda', 'Civic', 2021, 'DEF-5678')
  `);

  lastInsertedVehicleId = result.insertId;
}

beforeAll(setupDatabase);

afterAll(async () => {
  await db.end();
});

describe('Reservations API', () => {
  describe('POST /reservations', () => {
    it('should create a new reservation successfully', async () => {
      const response = await request(app)
        .post('/reservations')
        .send({
          vehicleId: lastInsertedVehicleId,
          startDate: '2024-05-10',
          endDate: '2024-05-15'
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toHaveProperty('message', 'Reserva criada com sucesso');
      expect(response.body).toHaveProperty('reservationId');
    });

    it('should reject a reservation when the vehicle is already booked', async () => {
      // Attempt to create a conflicting reservation
      const initialResponse = await request(app)
        .post('/reservations')
        .send({
          vehicleId: lastInsertedVehicleId,
          startDate: '2024-05-10',
          endDate: '2024-05-15'
        });

      const conflictResponse = await request(app)
        .post('/reservations')
        .send({
          vehicleId: lastInsertedVehicleId,
          startDate: '2024-05-10',
          endDate: '2024-05-15'
        });
      expect(conflictResponse.statusCode).toEqual(400);
      expect(conflictResponse.body).toHaveProperty('message', 'Veículo já reservado para este período');
    });
  });
});
