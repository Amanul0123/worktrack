const router = require('express').Router();
const ctrl = require('../controllers/activity.controller');
const authGuard = require('../middlewares/authGuard');

router.get('/', authGuard, ctrl.getActivity);

module.exports = router;
