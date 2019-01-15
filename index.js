const app = require('express')();

const port = 2000;

app.use('/lobby', require('./controllers/lobby.controller'));
app.use('/game', require('./controllers/game.controller'));

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
