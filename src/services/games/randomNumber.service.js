class RandomNumberService {
    start(gameData) {
        gameData.number = Math.floor(Math.random() * 90) + 1;
    }

    guessNumber(gameData, number) {

    }
}

exports = module.exports = new RandomNumberService();