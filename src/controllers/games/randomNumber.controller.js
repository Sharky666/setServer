const RandomNumberService = require("../../services/games/randomNumber.service");
const resultHandling = require("../../utils/functions").resultHandling;
const Utils = require("../../utils/definitions");

const router = require('express').Router();

router.post("/guessNumber", (req, res) => {
    const result = resultHandling.getResultStruct();
    const gameData = req.getGameData();
    const token = req.userData.client.token;
    const lobbyKey = req.userData.lobby.key;
    // trying to parse as int, maybe the client gave us a string
    const clientNumber = parseInt(req.body.number, 10);
    // if clientNumber is NaN
    if (!clientNumber) {
        // 0 also means false, maybe I should stringify it
        // it doesn't work, if you give it a zero it throws 'INVALID_NUM'
        if (clientNumber !== 0) {
            result.error = Utils.randomNumber.Errors.INVALID_NUM;
        }
        resultHandling.handleResults(res, result);
        return;
    }
    resultHandling.handleResults(res, RandomNumberService.checkNumber(gameData, lobbyKey, clientNumber, token));
});

// status per client
router.get("/status", (req, res) => {
    // TODO: check if it actually works
    const result = resultHandling.getResultStruct();
    const gameData = req.getGameData();
    const token = req.userData.client.token;
    result.result = RandomNumberService.getClientGameStatus(gameData, token);
    resultHandling.handleResults(res, result);
});

router.put("/playAgain", (req, res) => {
    const gameData = req.getGameData();
    const results = resultHandling.getResultStruct();
    if (req.userData.client.isOwner && !gameData.isInGame) {
        RandomNumberService.restartGame(gameData, req.userData.lobby.clients);
        results.result = Utils.Global.OK;
    }
    else {
        results.error = Utils.Client.UNAUTHORIZED;
    }
    resultHandling.handleResults(res, results);
});

router.put("/finishGame", (req, res) => {
    const gameData = req.getGameData();
    const lobbyKey = req.userData.lobby.key;
    const results = resultHandling.getResultStruct();
    if (req.userData.client.isOwner && !gameData.isInGame) {
        RandomNumberService.endGame(lobbyKey);
        results.result = Utils.Global.OK;
    }
    else {
        results.error = Utils.Client.UNAUTHORIZED;
    }
    resultHandling.handleResults(res, results);
});



exports = module.exports = router;