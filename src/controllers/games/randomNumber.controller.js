const RandomNumberService = require("../../services/games/randomNumber.service");

const router = require('express').Router();

router.get("/", (req, res) => {

});

router.post("/guessNumber", (req, res) => {
    const gameData = req.getGameData();
    const clientStatus = req.getGameData().status;
    // TODO: get the client token.
    const token = req.userData.client.token;
    const clientNumber = req.body.number;
    res.send(RandomNumberService.checkNumber(gameData, clientNumber, token));
});

exports = module.exports = router;