const express = require('express')
const ratingController = require('../controllers/raitingController');

const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/', authMiddleware, ratingController.addRating);
router.get('/average/:id', ratingController.getAverageRating);
router.get('/user-rating/:itemId', authMiddleware, ratingController.getUserRating);

module.exports = router