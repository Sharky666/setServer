const sha = require('sha.js');
const router = require('express').Router();
const lobbyService = require('../services/lobby.service');
const clientDefinitions = require("../utils/definitions").Client;
const lobbyDefinitions = require("../utils/definitions").Lobby;
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
    let clients = [];
    let isOwner = false;
    if (lobby) {
        clients = lobby.clients;
        clientKey = lobby.key;
    }
    // TODO: does it really need to be declared outside of the if statements?
    let clientName = null; 
        // TODO: do we really need to check if the clientKey exists?
    if (clientKey) {
        // Validating the client's name
        clientName = req.headers.name;
        if (!clientName) {
            result.error = clientDefinitions.BAD_NAME
            clientName = String(clientName);
        }
        else if (clientName.length > maxNameLength) {
            result.error = clientDefinitions.TOO_LONG;
        }
        else if (clients.length === 0) {
            // if the lobby is empty than the client is the owner.
            isOwner = true;
        }
        else {
            // if the client's name already exists in the lobby
            clients.forEach(c => {
                if (c.name === clientName) {
                    // Name already exsits
                    result.error = clientDefinitions.ALREADY_EXISTS;
                }
            });
        }
    }
    else {
        result.error = clientDefinitions.WRONG_KEY;
    }
    if (!result.error) {
        // Everything is valid, pushing the client to his lobby.
        const clientToken = generateClientToken();
        lobbyService.pushClient(clientName, clientToken, lobby, isOwner);
        result.result = {
            clientToken,
            isOwner
        };
        resultHandling.handleResults(res, result);
    }
    else {
        resultHandling.handleResults(res, result);
    }
});

router.get('/allowedGames', (req, res) => {
    const result = resultHandling.getResultStruct();
    result.result = lobbyService.getAllowedGames()
    resultHandling.handleResults(res, result);
});

router.put('/gameMode/:gameName', (req, res) => {
    const results = resultHandling.getResultStruct();
    const userData = req.userData;
    let requestedGame = '';
    // checking if client is authorized
    if (!userData) {
        results.error = 'you are not authorized';
    }
    else if (userData.client.isOwner) {
        // client is authorized
        requestedGame = req.params.gameName;
        if (!requestedGame || lobbyService.allowedGames.indexOf(requestedGame) === -1) {
            results.error = 'unknown game ya bittchh'
        }
    }

    if (!results.error) {
        // TODO: Real shit - set the game in the lobby by calling a method from the service
        lobbyService.setLobbyGameMode(userData.lobby.key, requestedGame);
        results.result = 'Ok';
    }
    resultHandling.handleResults(res, results)
});

router.post('/start', (req, res) => {
    const result = resultHandling.getResultStruct();
    const userData = req.userData;
    // checking if client is authorized
    if (!userData || !userData.client.isOwner) {
        result.error = clientDefinitions.UNAUTHORIZED;
    }
    // VERY BAD!
    else if (!userData.lobby.gameMode) {
        result.error = lobbyDefinitions.LobbyErrors.NO_GAMEMODE_FOUND;
    }
    // if error from the client
    if (result.error) {
        resultHandling.handleResults(res, result);
    }
    // if error from the lobby
    else {
        // make it happen!
        resultHandling.handleResults(res, lobbyService.startLobby(req.userData.lobby));
    }
});

router.get('/status', (req, res) => {
    const results = resultHandling.getResultStruct();
    const userData = req.userData;
    if (userData) {
        results.result = {
            status: userData.lobby.status,
            gameMode: userData.lobby.gameMode
        }
    }
    else {
        results.error = clientDefinitions.UNAUTHORIZED;
    }
    resultHandling.handleResults(res, results);
});

router.get('/clients', (req, res) => {
    const results = resultHandling.getResultStruct();
    const userData = req.userData;
    const clientsNames = [];
    // client is authorized
    if(userData) {
        // for each client in the lobby
        userData.lobby.clients.forEach(client => {
            // push only the client's name
            clientsNames.push(client.name);
         });
         results.result = clientsNames;
    }
    else {
        // client is not authorized
        results.error = clientDefinitions.UNAUTHORIZED;
    }
    resultHandling.handleResults(res, results);
});

function generateClientToken() {
    return sha('sha256').update((Math.random() * 500).toString()).digest('hex');
}

module.exports = router;