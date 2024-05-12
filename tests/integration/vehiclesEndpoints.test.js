// tests/integration/vehiclesEndpoints.test.js
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

describe('Vehicles API', () => {
  describe('GET /vehicles', () => {
    it('should retrieve a list of all vehicles', async () => {
      const response = await request(app).get('/vehicles');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expect.any(Array)); // Verifying the structure is an array
    });
  });

  describe('GET /vehicles/:id', () => {
    it('should retrieve a specific vehicle by id', async () => {
      const response = await request(app).get(`/vehicles/${lastInsertedVehicleId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('marca', 'Toyota');
      expect(response.body).toHaveProperty('modelo', 'Corolla');
      expect(response.body).toHaveProperty('ano', 2020);
      expect(response.body).toHaveProperty('placa', 'ABC-1234');
    });

    it('should return a 404 status if the vehicle is not found', async () => {
      const response = await request(app).get('/vehicles/999'); // Using an unlikely ID to simulate not found
      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty('message', 'Veículo não encontrado');
    });
  });
});
