const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const quiz = require('./api/models/quizModel');
const bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



let routes = require('./api/routes/quizRoutes');
routes(app);

app.listen(port, () => console.log(`Listening on port ${port}`));