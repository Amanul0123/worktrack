const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const authGuard = require('../middlewares/authGuard');
const validate = require('../middlewares/validateRequest');
const { createTaskSchema, updateTaskSchema, toggleStatusSchema } = require('../validators/task.validator');

router.use(authGuard);
router.get('/', ctrl.list);
router.post('/', validate(createTaskSchema), ctrl.create);
router.put('/:id', validate(updateTaskSchema), ctrl.update);
router.patch('/:id/status', validate(toggleStatusSchema), ctrl.toggleStatus);
router.delete('/:id', ctrl.remove);

module.exports = router;
