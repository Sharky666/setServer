const router = require('express').Router();

const defaultKeyLength = 4;
const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const rooms = [];

router.post('/create', (req, res) => {
    // TODO:
    rooms.push({
        key: generateKey(abc, defaultKeyLength),
        status: 'waiting',
        game: 'randNum',
        clients: [
            {
            
                // username: 'dsa',
                // token: generateToken(abc, 6)
            }
        ]
    });
    res.send('done.')
});

router.post('/join', (req, res) => {
    //TODO: add the client to the lobby
    const result = validateClientLobbyKey(req.headers.key, defaultKeyLength);
    console.log(result)
    if(result) {
        rooms.forEach(e => {
            console.log(e.key)
            if(result === e.key){
                console.log('BITCCHH')
                e.clients.push(result)
            }
        });
        res.send('done.')
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
    for (let i = 0; i < length; i++){
        key = key + arr[Math.floor(Math.random() * arr.length)];
    }
    // if no rooms exist return the key (so we won't check on an empty array)
    if (rooms.length === 0) return key;
    // if the key is equal to another room's key, run again.
    rooms.forEach((e, i) => {
        if (key === e.key) {
            return generateKey(length);
        }
    });
    return key;
}

function validateClientLobbyKey(clientKey, givenDefaultKeyLength) {
    //TODO: also possibly return the index of the lobby (from the 'rooms' array) to cut times.
    // if clientKey doesn't exist
    if (!clientKey) return false;
    // set the clientKey to a string (so we could check it's length)
    clientKey = String(clientKey);
    clientKey = clientKey.toUpperCase()
    // if the clientkey's length isn't the default key length
    if (clientKey.length !== givenDefaultKeyLength) return false;
    for(let i = 0; i < rooms.length; i++) {
        // if we found a match between the clientKey's and one of our lobby keys
        if(clientKey === rooms[i].key) return clientKey;
    }
    return false;
}

module.exports = router;
