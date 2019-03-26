class RandomNumberService {
    start(gameData) {
        gameData.number = Math.floor(Math.random() * 90) + 1;
        console.log(gameData);
    }

    checkNumber(gameData, number) {
        if (gameData) {
            const gameNumber = gameData.number;
            return number === gameNumber;
        }
        return false;
    }
}

exports = module.exports = new RandomNumberService();