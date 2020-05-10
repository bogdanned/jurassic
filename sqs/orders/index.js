const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const port = process.env.PORT

const messager = require("./messager")

app.use(bodyParser.json());

app.get('/index', () => {
    res.send("Welcome to NodeShop Orders.")
});

messager(app)

console.log(`Orders service listening on port ${port}`);
app.listen(port);