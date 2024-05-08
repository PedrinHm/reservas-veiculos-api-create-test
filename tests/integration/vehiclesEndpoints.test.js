// tests/integration/vehiclesEndpoints.test.js
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

  /* await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('DELETE FROM vehicles');
  await db.query('SET FOREIGN_KEY_CHECKS = 1'); */

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

describe('Vehicles Endpoints', () => {
  it('should fetch all vehicles', async () => {
    const res = await request(app).get('/vehicles');
    expect(res.statusCode).toEqual(200);
  });

  it('should fetch a vehicle by id', async () => {
    const res = await request(app).get(`/vehicles/${lastInsertedVehicleId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('marca', 'Toyota');
  });

  it('should return 404 if vehicle not found', async () => {
    const res = await request(app).get('/vehicles/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Veículo não encontrado');
  });
});
