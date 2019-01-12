const router = require('express').Router();
const sha = require('sha.js');

const defaultKeyLength = 4;
const defaultNameLength = 20;
const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const rooms = [];

router.post('/create', (req, res) => {
    // TODO:
    const roomKey = generateKey(abc, defaultKeyLength)
    rooms.push({
        key: roomKey,
        status: 'waiting',
        game: 'randNum',
        clients: [
            {
                // username: 'dsa',
                // token: generateToken(abc, 6)
            }
        ]
    });
    res.send({roomKey})
    // res.send('done.')
});

router.post('/join', (req, res) => {
    // TODO: add the client to the lobby
    const clientKey = validateClientLobbyKey(req.headers.key, defaultKeyLength);
    const clientName = validateClientName(req.headers.name, defaultNameLength)
    console.log(clientKey)
    if (clientKey && clientName) {
        let clientToken = null;
        rooms.forEach(e => {
            console.log(e.key)
            if (clientKey === e.key) {
                clientToken = generateClientToken()
                e.clients.push({
                    clientName: clientName,
                    token: clientToken
                })
            }
        });
        res.send({clientToken});
    }
    else {
        res.send('incorrect lobby key.');
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
    // if no rooms exist return the key (so we won't check on an empty array)
    if (rooms.length === 0) return key;
    // if the key is equal to another room's key, run again.
    rooms.forEach((e) => {
        if (key === e.key) {
            return generateKey(arr, length);
        }
    });
    return key;
}

function validateClientLobbyKey(clientKey, givenDefaultKeyLength) {
    // TODO: also possibly return the index of the lobby (from the 'rooms' array) to cut times.
    // if clientKey doesn't exist
    if (!clientKey) return false;
    // set the clientKey to a string (so we could check it's length)
    clientKey = String(clientKey);
    clientKey = clientKey.toUpperCase()
    // if the clientkey's length isn't the default key length
    if (clientKey.length !== givenDefaultKeyLength) return false;
    return rooms.find(e => e.key === clientKey) ? clientKey : false;
}

function validateClientName(clientName, maxNameLength) {
    //TODO: check if the same username aleady exsists in the lobby.
    if (!clientName) return false;
    clientName = String(clientName);
    if (clientName.length > maxNameLength) return false
    return clientName
}

function generateClientToken() {
    return sha('sha256').update((Math.random() * 500).toString()).digest('hex');
}

module.exports = router;
