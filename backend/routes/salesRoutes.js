// backend/routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/ranking', salesController.getSalesRanking);

module.exports = router;
