// tests/unit/models/vehicle.test.js
const Vehicle = require('../../../models/vehicle');
const db = require('../../../models/db');

jest.mock('../../../models/db');

describe('Vehicle Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all vehicles', async () => {
    const mockVehicles = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: 2020, placa: 'ABC-1234' },
      { id: 2, marca: 'Honda', modelo: 'Civic', ano: 2021, placa: 'DEF-5678' }
    ];
    db.query.mockResolvedValue([mockVehicles]);

    const vehicles = await Vehicle.getAll();
    expect(vehicles).toEqual(mockVehicles);
    expect(db.query).toHaveBeenCalledWith('SELECT id, marca, modelo, ano, placa FROM vehicles');
  });

  it('should fetch a vehicle by id', async () => {
    const mockVehicle = { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: 2020, placa: 'ABC-1234' };
    db.query.mockResolvedValue([[mockVehicle]]);

    const vehicle = await Vehicle.getById(1);
    expect(vehicle).toEqual(mockVehicle);
    expect(db.query).toHaveBeenCalledWith('SELECT id, marca, modelo, ano, placa FROM vehicles WHERE id = ?', [1]);
  });
});
