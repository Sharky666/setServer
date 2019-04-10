//TODO: add a functionallity that finshes rounds and restarts the "hasGuessed" values
const Utils = require("../../utils/definitions").randomNumber;
const resultHandling = require("../../utils/functions").resultHandling;
const gameService = require("/mnt/a/development/ecmascript/setServer/src/services/game.service.js");

class RandomNumberService {
    start(gameData, clients) {
        // TODO: rethink the next line.
        gameData.clients = clients;
        gameData.rounds = 0;
        gameData.number = Math.floor(Math.random() * 90) + 1;
        gameData.guessesLeft = clients.length;
        gameData.started = true;
    }

    checkNumber(gameData, lobbyKey, number, clientToken) {
        const clients = gameData.clients;
        const final = resultHandling.getResultStruct();
        if (gameData) {
            // going over each client
            for (let i = 0; i < clients.length; i++) {
                const currentClient = clients[i];
                // found the client
                if (clientToken === currentClient.token) {
                    // if the client didn't guess yet.
                    if (!currentClient.hasGuessed) {
                        const gameNumber = gameData.number;
                        let won = false;
                        if(number === gameNumber) {
                            final.result = Utils.Results.CORRECT;
                            won = true;
                        }
                        else if (number > gameNumber) {
                            final.result = Utils.Results.TOO_BIG;
                        }
                        else if (number < gameNumber) {
                            final.result = Utils.Results.TOO_SMALL;
                        }
                        this.onClientGuessed(gameData, lobbyKey, currentClient, won);
                    }
                    // the client already guessed
                    else {
                        final.error = Utils.Errors.ALREADY_GUESSED;
                    }
                }
            }
            
        }
        return final;
    }
    
    isEveryoneGuessed(gameData) {
        return gameData.guessesLeft === 0;
    }
    

    onClientGuessed(gameData, lobbyKey, client, won) {
        gameData.guessesLeft--;
        client.hasGuessed = true;
        if (won) {
            //end game
            this.endGame(lobbyKey, client);
        }
        else if (this.isEveryoneGuessed(gameData)) {
            //next round
            // this.nextRound(gameData);
            this.endGame(lobbyKey, client);
        }
    }

    endGame(lobbyKey) {
        //TOOD: congradulate the client
        let utils = Utils;
        ///mnt/a/development/ecmascript/setServer/src/services/game.service.js
        let _gameService = gameService;
        gameService.endGame(lobbyKey);
    }

    nextRound(gameData) {
        gameData.rounds++;
        gameData.clients.forEach((c, i) =>{
            c.hasGuessed = false;
        });
        gameData.guessesLeft = gameData.clients.length;
    }
}

exports = module.exports = new RandomNumberService();
