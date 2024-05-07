// routes/vehicles.js
const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehiclesController');

router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);

module.exports = router;
