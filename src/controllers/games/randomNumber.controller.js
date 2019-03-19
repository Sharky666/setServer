const router = require('express').Router();

router.get("/", (req, res) => {
    req.getGameData();
});

exports = module.exports = router;