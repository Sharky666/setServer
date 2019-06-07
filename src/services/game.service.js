const resultHandling = require("../utils/functions").resultHandling;
const utils = require("../utils/definitions").Game;
const { Subject } = require('rxjs');

class GameService {
    constructor() {
        this.initGames();
        this.initObservables();
    }

    initGames() {
        this.gameServices = {
            randomNumber: this.initGame("./games/randomNumber.service")
        };
    }

    initObservables() {
        this.gameStatus$ = new Subject();
    }

    initGame(path) {
        const game = require(path);
        game.init();
        game.status$.subscribe(this.onGameStatusChange.bind(this));
        return game;
    }

    onGameStatusChange(statusEvent) {
        this.gameStatus$.next(statusEvent);
    }

    startGame(gameName, gameData, clients) {
        const final = resultHandling.getResultStruct();
        const service = this.getGameService(gameName);
        if (service) {
            return service.start(gameData, clients);
        }
        final.error = utils.gameErrors.NOT_FOUND;
        return final;
    }

    /**
     * Will be triggered when a game emits and end event
     */
    onGameEnd(lobby){

    }

    getGameService(gameName) {
        return this.gameServices[gameName];
    }
}

exports = module.exports = new GameService();
