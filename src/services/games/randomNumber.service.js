//TODO: add a functionallity that finshes rounds and restarts the "hasGuessed" values
const Results = require("../../utils/definitions").randomNumberResults;

class RandomNumberService {
    start(gameData, clients) {
        gameData.number = Math.floor(Math.random() * 90) + 1;
        gameData.clients = clients;
    }
    
    //TODO: think if all this functionallity even belongs here (it probably does)
    checkNumber(gameData, number, clientToken) {
        const clients = gameData.clients;
        let result = false;
        if (gameData) {
            // going over each client
            for (let i = 0; i < clients.length; i++) {
                const currentClient = clients[i];
                // found the client
                if (clientToken === currentClient.token) {
                    // if the client didn't guess yet.
                    if (!currentClient.hasGussed) {
                        const gameNumber = gameData.number;
                        if(number === gameNumber) {
                            result = Results.CORRECT;
                        }
                        else if (number > gameNumber) {
                            result = Results.TOO_BIG;
                        }
                        else if (number < gameNumber) {
                            result = Results.TOO_SMALL;
                        }
                        currentClient.hasGussed = true;
                    }
                }
            }
        }
        return result;
    }
}

exports = module.exports = new RandomNumberService();