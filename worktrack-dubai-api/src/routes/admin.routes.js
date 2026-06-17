const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const exportCtrl = require('../controllers/export.controller');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.use(authGuard, roleGuard('admin'));

router.get('/users', ctrl.listUsers);
router.get('/users/:id', ctrl.getUserDetail);
router.patch('/users/:id/status', ctrl.setUserStatus);
router.get('/stats', ctrl.getStats);
router.get('/export', exportCtrl.exportReport);

module.exports = router;
