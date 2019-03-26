const RandomNumberService = require("../../services/games/randomNumber.service");

const router = require('express').Router();

router.get("/", (req, res) => {

});

//randomNumber API:

router.post("/guessNumber", (req, res) => {
    const gameData = req.getGameData();
    const clientNumber = req.body.number;
    RandomNumberService.checkNumber(gameData, clientNumber);
});

exports = module.exports = router;