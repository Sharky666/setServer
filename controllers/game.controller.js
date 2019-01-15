const router = require('express').Router();

router.use('/randomNumber', require('./games/randomNumber.controller'));

exports = module.exports = router;