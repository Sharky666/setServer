//TODO: add a functionallity that finshes rounds and restarts the "hasGuessed" values
const Utils = require("../../utils/definitions");
const resultHandling = require("../../utils/functions").resultHandling;
const { Subject } = require('rxjs');

class RandomNumberService {
    init() {
        this.status$ = new Subject();
    }

    start(gameData, clients) {
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
                            final.result = Utils.randomNumber.Results.CORRECT;
                            won = true;
                        }
                        else if (number > gameNumber) {
                            final.result = Utils.randomNumber.Results.TOO_BIG;
                        }
                        else if (number < gameNumber) {
                            final.result = Utils.randomNumber.Results.TOO_SMALL;
                        }
                        this.onClientGuessed(gameData, lobbyKey, currentClient, won);
                    }
                    // the client already guessed
                    else {
                        final.error = Utils.randomNumber.Errors.ALREADY_GUESSED;
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
            this.nextRound(gameData);
        }
    }

    endGame(lobbyKey) {
        //TOOD: congratulate the client
        this.status$.next({
            status: Utils.Game.GameStatuses.COMPLETED,
            lobbyKey: lobbyKey
        });
    }

    nextRound(gameData) {
        gameData.rounds++;
        gameData.clients.forEach((c, i) => {
            c.hasGuessed = false;
        });
        gameData.guessesLeft = gameData.clients.length;
    }
}

exports = module.exports = new RandomNumberService();
