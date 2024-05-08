// tests/unit/controllers/vehiclesController.test.js
const vehiclesController = require('../../../controllers/vehiclesController');
const Vehicle = require('../../../models/vehicle');

jest.mock('../../../models/vehicle');

describe('Vehicles Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should return all vehicles', async () => {
    const mockVehicles = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: 2020, placa: 'ABC-1234' },
      { id: 2, marca: 'Honda', modelo: 'Civic', ano: 2021, placa: 'DEF-5678' }
    ];
    Vehicle.getAll.mockResolvedValue(mockVehicles);

    await vehiclesController.getAllVehicles(req, res);

    expect(Vehicle.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockVehicles);
  });

  it('should return a specific vehicle by id', async () => {
    req.params = { id: 1 };
    const mockVehicle = { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: 2020, placa: 'ABC-1234' };
    Vehicle.getById.mockResolvedValue(mockVehicle);

    await vehiclesController.getVehicleById(req, res);

    expect(Vehicle.getById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockVehicle);
  });

  it('should return 404 if vehicle is not found', async () => {
    req.params = { id: 999 };
    Vehicle.getById.mockResolvedValue(undefined);

    await vehiclesController.getVehicleById(req, res);

    expect(Vehicle.getById).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Veículo não encontrado' });
  });
});
