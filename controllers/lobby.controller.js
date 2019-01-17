const router = require('express').Router();
const sha = require('sha.js');
const lobbyService = require('../services/lobby.service');

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
    const clientKey = validateClientLobbyKey(req.headers.key, defaultKeyLength);
    let clientName = null
    if (clientKey) {
        clientName = validateClientName(req.headers.name, lobbyService.getLobbyByKey(clientKey), maxNameLength);
    }
    else {
        res.send('incorrect lobby key.')
    }
    if (clientName) {
        let clientToken = null;
        let lobby = lobbyService.getLobbyByKey(clientKey);
        clientToken = generateClientToken()
        lobby.clients.push({
            clientName: clientName,
            token: clientToken
        })
        res.send({clientToken});
    }
    else {
        res.send('username already exists.');
    }
});

router.put('/gamemode', (req, res) => {
    // TODO:
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

function validateClientLobbyKey(clientKey, givenDefaultKeyLength) {
    // if clientKey doesn't exist
    if (!clientKey) return false;
    // set the clientKey to a string (so we could check it's length)
    clientKey = String(clientKey);
    clientKey = clientKey.toUpperCase()
    // if the clientkey's length isn't the default key length
    if (clientKey.length !== givenDefaultKeyLength) return false;
    // if the lobby exists, return the key, otherwise false.
    return lobbyService.doesLobbyExist(clientKey) ? clientKey : false;
}

function validateClientName(clientName, lobby, givenMaxNameLength) {
    if (!clientName) return false;
    clientName = String(clientName);
    if (clientName.length > givenMaxNameLength) return false;
    // if the client name already exists in the lobby, return false, otherwise return the name.
    return lobby.clients.find(e => e.clientName === clientName) ? false : clientName
}

function generateClientToken() {
    return sha('sha256').update((Math.random() * 500).toString()).digest('hex');
}

module.exports = router;
