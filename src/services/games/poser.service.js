const Utils = require("../../utils/definitions");
const resultHandling = require("../../utils/functions").resultHandling;
const { Subject } = require('rxjs');

class poserService {
    start(gameData, clients) {
        // choose one random client to be the poser
        gameData.clients = clients;
        gameData.poser = clients[Math.floor(Math.random() * clients.length) + 1];
    }
}

exports = module.exports = new poserService();