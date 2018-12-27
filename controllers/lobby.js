const router = require('express').Router();

const rooms = [];

router.post('/create', (req, res) => {
    // TODO:
    rooms.push({
        roomID: '3152246',
        status: 'waiting',
        game: 'randNum',
        clients: [
            {
                username: 'dsa',
                token: 'erwqt24w'
            }
        ]
    });
});
router.post('/join', (req, res) => {
    // TODO:
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

module.exports = router;
