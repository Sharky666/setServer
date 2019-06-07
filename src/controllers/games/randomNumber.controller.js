const RandomNumberService = require("../../services/games/randomNumber.service");
const resultHandling = require("../../utils/functions").resultHandling;
const Utils = require("../../utils/definitions").randomNumber;

const router = require('express').Router();

router.get("/", (req, res) => {

});

router.post("/guessNumber", (req, res) => {
    const result = resultHandling.getResultStruct();
    const gameData = req.getGameData();
    const token = req.userData.client.token;
    const lobbyKey = req.userData.lobby.key;
    // trying to parse as int, maybe the client gave us a string
    const clientNumber = parseInt(req.body.number, 10);
    // if clientNumber is NaN
    if (!clientNumber) {
        result.error = Utils.Errors.INVALID_NUM;
        resultHandling.handleResults(res, result);
        return;
    }
    resultHandling.handleResults(res, RandomNumberService.checkNumber(gameData, lobbyKey, clientNumber, token));
});

// TOOD: a function that handles the results

exports = module.exports = router;