'use strict';

module.exports = function (app) {
    var todoList = require('../controllers/quizController');

    // todoList Routes
    app.route('/quiz')
        .get(todoList.list_quiz);
};