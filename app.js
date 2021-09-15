const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();
//below are depracted see: https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json());

app.use(express.json());

app.use('/feed', feedRoutes);

app.listen(port=3003);