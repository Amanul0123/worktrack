const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const authGuard = require('../middlewares/authGuard');

router.get('/summary', authGuard, ctrl.summary);

module.exports = router;
