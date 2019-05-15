const sha = require('sha.js');
const router = require('express').Router();
const lobbyService = require('../services/lobby.service');
const clientDefinitions = require("../utils/definitions").Client;
const resultHandling = require("../utils/functions").resultHandling;

const maxNameLength = 20;

router.post('/create', (req, res) => {
    const results = lobbyService.pushLobby();
    resultHandling.handleResults(res, results);
});

router.post('/join', (req, res) => {
    const result = resultHandling.getResultStruct();
    const lobby = lobbyService.getLobbyByKey(req.headers.lobbykey);
    let clientKey = null;
    if (lobby) {
        clientKey = lobby.key;
    }
    let clientName = null;
    if (clientKey) {
        // Validating the client's name
        clientName = String(req.headers.name);
        if (clientName.length > maxNameLength) {
            result.error = clientDefinitions.TOO_LONG;
        };
        // if the client's name already exists in the lobby
        lobby.clients.forEach(c => {
            if (c.name === clientName) {
                // Name already exsits
                result.error = clientDefinitions.ALREADY_EXISTS;
            }
        });
    }
    else {
        result.error = clientDefinitions.WRONG_KEY;
    }
    if (!result.error) {
        // Everything is valid, pushing the client to his lobby.
        const clientToken = generateClientToken();
        lobbyService.pushClient(clientName, clientToken, lobby);
        result.result = clientToken;
        resultHandling.handleResults(res, result);
    }
    else {
        resultHandling.handleResults(res, result);
    }
});

router.get('/allowedGames', (req, res) => {
    res.send(lobbyService.getAllowedGames());
});

router.put('/gameMode/:gameName', (req, res) => {
    const userData = req.userData;
    // checking if client is authorized
    if (!userData || !userData.client.isOwner) {
        res.status(401)
            .json({
                error: 'you are not authorized.'
            });
        return;
    }
    // client is authorized
    const requestedGame = req.params.gameName;
    if (!requestedGame || lobbyService.allowedGames.indexOf(requestedGame) === -1) {
        // Game not found
        res.status(400)
            .json({
                error: 'Wtf is this game'
            });
        return;
    }
    lobbyService.setLobbyGameMode(userData.lobby.key, requestedGame);
    // TODO: Real shit - set the game in the lobby by calling a method from the service
    res.send('ok');
});

router.post('/start', (req, res) => {
    const userData = req.userData;
    // checking if client is authorized
    if (!userData || !userData.client.isOwner) {
        res.status(401)
            .json({
                error: 'you are not authorized.'
            });
        return;
    }
    // VERY BAD!
    if (!userData.lobby.gameMode) {
        res.status(400)
            .json({
                error: 'this a very bad request you fucking bitch.'
            });
        return;
    }
    // make it happen!
    resultHandling.handleResults(res, lobbyService.startLobby(req.userData.lobby));
});

router.get('/status', (req, res) => {
    const userData = req.userData;
    if (userData) {
        res.json({
            status: userData.lobby.status,
            gameMode: userData.lobby.gameMode
        });
    }
    
    else {
        res.status(401)
            .json({
                error: 'you are not authorized.'
            });
    }
});

function generateClientToken() {
    return sha('sha256').update((Math.random() * 500).toString()).digest('hex');
}

module.exports = router;
