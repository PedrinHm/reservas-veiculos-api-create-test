// tests/unit/controllers/reservationsController.test.js
const reservationsController = require('../../../controllers/reservationsController');
const Reservation = require('../../../models/reservation');

jest.mock('../../../models/reservation');

describe('Reservations Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should create a reservation successfully', async () => {
    req.body = { vehicleId: 1, startDate: '2024-01-01', endDate: '2024-01-05' };
    Reservation.checkAvailability.mockResolvedValue([]);
    Reservation.create.mockResolvedValue('123');

    await reservationsController.createReservation(req, res);

    expect(Reservation.checkAvailability).toHaveBeenCalledWith(1, '2024-01-01', '2024-01-05');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Reserva criada com sucesso',
      reservationId: '123',
      totalAmount: 750 // Considerando a lógica de cálculo atual
    });
  });

  it('should return error if vehicle is already booked', async () => {
    req.body = { vehicleId: 1, startDate: '2024-01-01', endDate: '2024-01-05' };
    Reservation.checkAvailability.mockResolvedValue([{ id: '123' }]);

    await reservationsController.createReservation(req, res);

    expect(Reservation.checkAvailability).toHaveBeenCalledWith(1, '2024-01-01', '2024-01-05');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Veículo já reservado para este período'
    });
  });

  it('should handle errors during reservation creation', async () => {
    req.body = { vehicleId: 1, startDate: '2024-01-01', endDate: '2024-01-05' };
    const errorMessage = 'Erro ao acessar o banco de dados';
    Reservation.checkAvailability.mockRejectedValue(new Error(errorMessage));

    await reservationsController.createReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro ao criar reserva.'
    });
  });
});
