// tests/unit/controllers/paymentsController.test.js
const { processPayment } = require('../../../controllers/paymentsController');
const Payment = require('../../../models/payment');

jest.mock('../../../models/payment');

describe('Payments Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        reservationId: 1,
        method: 'credit_card',
        cardDetails: { number: '1234567890123456', expiry: '12/24', cvv: '123' }
      }
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should process a valid payment successfully', async () => {
    await processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Pagamento realizado com sucesso',
      status: 'completed'
    }));
  });

  it('should return error for invalid payment method', async () => {
    req.body.method = 'cash';
    await processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Método de pagamento inválido' });
  });

  it('should handle payment failures', async () => {
    req.body = {
      reservationId: 1,
      method: 'credit_card',
      cardDetails: null  // Missing card details
    };
    await processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pagamento falhou, dados do cartão inválidos' });
  });
});
