const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const authGuard = require('../middlewares/authGuard');
const validate = require('../middlewares/validateRequest');
const upload = require('../middlewares/uploadAvatar');
const { updateProfileSchema, changePasswordSchema, languageSchema } = require('../validators/user.validator');

router.use(authGuard);
router.get('/', ctrl.getMe);
router.put('/', validate(updateProfileSchema), ctrl.updateMe);
router.post('/avatar', upload.single('avatar'), ctrl.uploadAvatar);
router.put('/language', validate(languageSchema), ctrl.updateLanguage);
router.put('/password', validate(changePasswordSchema), ctrl.changePassword);

module.exports = router;
