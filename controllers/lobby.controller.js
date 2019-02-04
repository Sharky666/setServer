const router = require('express').Router();
const sha = require('sha.js');
const lobbyService = require('../services/lobby.service');
const auth = require('../services/auth.service');

const defaultKeyLength = 4;
const maxNameLength = 20;
const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

router.post('/create', (req, res) => {
    const lobbyKey = generateKey(abc, defaultKeyLength)
    const lobby = {
        key: lobbyKey,
        status: 'waiting',
        game: 'randNum',
        clients: [
            // clients go in here
        ],
        games: []
    };
    lobbyService.pushLobby(lobby)
    res.send({lobbyKey})
});

router.post('/join', (req, res) => {
    // TODO: add the client to the lobby
    const clientKey = auth.validateClientLobbyKey(req.headers.key, defaultKeyLength).key;
    let clientName = null
    if (clientKey) {
        clientName = auth.validateClientName(req.headers.name, lobbyService.getLobbyByKey(clientKey), maxNameLength);
    }
    else {
        res.send('incorrect lobby key.')
    }
    if (clientName) {
        let clientToken = null;
        let lobby = lobbyService.getLobbyByKey(clientKey);
        // Lobby is empty
        const isOwner = lobby.clients.length === 0;
        clientToken = generateClientToken()
        lobby.clients.push({
            clientName: clientName,
            token: clientToken,
            isOwner: isOwner
        });
        res.send({clientToken});
    }
    else {
        res.send('username already exists.');
    }
});

router.put('/gamemode', (req, res) => {
    const body = req.body;
    const room = req.userData.room;
    room.game = body.gamemode
});

router.post('/start', (req, res) => {
    // TODO:
});

// router.get('/status', (req, res) => {
//     res.send({
//         status: 'in-game',
//         game: 'randomNum',
//         path: '/game/randumNum'
//     });
// });

// function generateNumber(max) {
//     return Math.floor(Math.random() * max) + 1;
// }

function generateKey(arr, length) {
    let key = '';
    // generating the key
    for (let i = 0; i < length; i++) {
        key = key + arr[Math.floor(Math.random() * arr.length)];
    }
    // if the key is equal to another lobby's key, run again.
    if (lobbyService.doesLobbyExist(key)) {
        return generateKey(arr, length);
    }
    return key;
}

function generateClientToken() {
    return sha('sha256').update((Math.random() * 500).toString()).digest('hex');
}

module.exports = router;
