const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];
const app = express();

const messager = require("./messager")

app.use(bodyParser.json());

app.get('/index', () => {
    res.send("Welcome to NodeShop Orders.")
});

messager(app)

console.log(`Orders service listening on port ${port}`);
app.listen(port);