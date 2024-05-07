// controllers/paymentsController.js
const Payment = require('../models/payment');

exports.processPayment = async (req, res) => {
    const { reservationId, method, cardDetails } = req.body;
    const validMethods = ['credit_card', 'debit_card', 'boleto'];

    if (!validMethods.includes(method)) {
        return res.status(400).json({ message: 'Método de pagamento inválido' });
    }

    // Simulação de processamento de pagamento
    const paymentStatus = (method === 'boleto' || cardDetails) ? 'completed' : 'failed';

    if (paymentStatus === 'failed') {
        return res.status(400).json({ message: 'Pagamento falhou, dados do cartão inválidos' });
    }

    try {
        const paymentId = await Payment.create(reservationId, method, paymentStatus);
        res.status(201).json({ message: 'Pagamento realizado com sucesso', status: paymentStatus, paymentId });
    } catch (err) {
        console.error('Erro ao processar pagamento:', err.message);
        res.status(500).json({ error: 'Erro ao processar pagamento.' });
    }
};
