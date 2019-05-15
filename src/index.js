const app = require('express')();

const port = 2000;

app.use(require('body-parser').json());
app.use(require('./middleware/cors.middleware'));
app.use(require('./middleware/clientFinder.middleware'));
app.use('/lobby', require('./controllers/lobby.controller'));
app.use('/game', require('./controllers/game.controller'));

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
