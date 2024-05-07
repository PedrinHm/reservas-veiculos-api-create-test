// controllers/vehiclesController.js
const Vehicle = require('../models/vehicle');

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        res.json(vehicles);
    } catch (err) {
        console.error('Erro ao obter todos os veículos:', err.message);
        res.status(500).json({ error: 'Erro ao obter todos os veículos.' });
    }
};

exports.getVehicleById = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicle = await Vehicle.getById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        res.json(vehicle);
    } catch (err) {
        console.error(`Erro ao obter o veículo ${id}:`, err.message);
        res.status(500).json({ error: `Erro ao obter o veículo ${id}.` });
    }
};
