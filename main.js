const express = require('express');
const users = require('./routes/userRoute');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
users(app)

app.get('/', (req, res) => res.send('Salve'))

app.listen(port, () => console.log('Api pronta'))

module.exports = app;