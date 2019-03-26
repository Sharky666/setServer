const sha = require('sha.js');
const router = require('express').Router();
const lobbyService = require('../services/lobby.service');
const auth = require('../services/auth.service');

router.post('/create', (req, res) => {
    const lobbyKey = lobbyService.pushLobby();
    res.json({ lobbyKey });
});

router.post('/join', (req, res) => {
    // TODO: the controller should only validate the request, then the service should add it to the database and return the clientToken.
    const lobby = lobbyService.getLobbyByKey(req.headers.lobbykey);
    let clientKey = null;
    if (lobby) {
        clientKey = lobby.key;
    }
    let clientName = null;
    if (clientKey) {
        clientName = auth.validateClientName(
            req.headers.name,
            lobbyService.getLobbyByKey(clientKey)
        );
    }
    else {
        res.send('incorrect lobby key.');
    }
    if (clientName) {
        // Everything is valid, pushing the client to his lobby.
        const clientToken = generateClientToken();
        lobbyService.pushClient(clientName, clientToken, lobby);
        res.send({ clientToken });
    }
    else {
        res.send('username already exists.');
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
    lobbyService.startLobby(req.userData.lobby);
    res.send('ok');
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
