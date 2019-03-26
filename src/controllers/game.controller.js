const router = require('express').Router();

router.use(require('../middleware/auth.middleware'));
router.use(require('../middleware/gameAuth.middleware'));

router.use('/randomNumber', require('./games/randomNumber.controller'));

exports = module.exports = router;
