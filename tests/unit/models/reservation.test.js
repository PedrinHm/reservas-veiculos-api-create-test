// tests/unit/models/reservation.test.js
const Reservation = require('../../../models/reservation');
const db = require('../../../models/db');

jest.mock('../../../models/db');

describe('Reservation Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    it('should create a reservation', async () => {
    const mockReservationId = 1;
    const vehicleId = 101;
    const startDate = '2024-01-01';
    const endDate = '2024-01-05';
    const totalAmount = 500.00;
    db.query.mockResolvedValue([{ insertId: mockReservationId }]);

    const reservationId = await Reservation.create(vehicleId, startDate, endDate, totalAmount);
    expect(reservationId).toEqual(mockReservationId);
    expect(db.query).toHaveBeenCalledWith('INSERT INTO reservations (vehicle_id, start_date, end_date, total_amount) VALUES (?, ?, ?, ?)', [vehicleId, startDate, endDate, totalAmount]);
  });


  it('should check availability for a vehicle', async () => {
    const vehicleId = 101;
    const startDate = '2024-01-01';
    const endDate = '2024-01-05';
    const mockAvailability = [{ id: 1, vehicle_id: 101, start_date: '2024-01-01', end_date: '2024-01-05' }];
    db.query.mockResolvedValue([mockAvailability]);
  
    const availability = await Reservation.checkAvailability(vehicleId, startDate, endDate);
    expect(availability).toEqual(mockAvailability);
  
    // Normalizando as strings de SQL para garantir que espaços e quebras de linha não causem falha nos testes
    const expectedSQL = `
      SELECT * FROM reservations
      WHERE vehicle_id = ?
      AND (start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ?)
    `.replace(/\s+/g, ' ').trim();
  
    const actualSQL = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
  
    expect(actualSQL).toEqual(expectedSQL);
    expect(db.query.mock.calls[0][1]).toEqual([vehicleId, startDate, endDate, startDate, endDate]);
  });
  
});
