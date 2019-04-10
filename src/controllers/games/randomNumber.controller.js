const RandomNumberService = require("../../services/games/randomNumber.service");
const resultHandling = require("../../utils/functions").resultHandling;

const router = require('express').Router();

router.get("/", (req, res) => {

});

router.post("/guessNumber", (req, res) => {
    const gameData = req.getGameData();
    const clientStatus = req.getGameData().status;
    // TODO: get the client token.
    const token = req.userData.client.token;
    const lobbyKey = req.userData.lobby.key;
    const clientNumber = req.body.number;
    resultHandling.handleResults(res, RandomNumberService.checkNumber(gameData, lobbyKey, clientNumber, token));
});

// TOOD: a function that handles the results

exports = module.exports = router;