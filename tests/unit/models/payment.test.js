// tests/unit/models/payment.test.js
const Payment = require('../../../models/payment');
const db = require('../../../models/db');

jest.mock('../../../models/db');

describe('Payment Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment record', async () => {
    const mockPaymentId = 1;
    const reservationId = 123;
    const method = 'credit card';
    const status = 'processed';
    db.query.mockResolvedValue([{ insertId: mockPaymentId }]);

    const paymentId = await Payment.create(reservationId, method, status);
    expect(paymentId).toEqual(mockPaymentId);
    expect(db.query).toHaveBeenCalledWith('INSERT INTO payments (reservation_id, method, status) VALUES (?, ?, ?)', [reservationId, method, status]);
  });
});
