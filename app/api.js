var Todo = require('../app/models/todo.js');

module.exports = function(app, passport) {

  app.get('/api/todos', function(req, res) {
    //fing all todos and send them is json format
    Todo.find(
      { userId: req.user.id },
      function(err, todos) {
      if (err)
        res.send(err)

      res.json(todos);
    });
  });

  app.post('/api/todos', function(req, res) {

    Todo.create({
      userId: req.user.id,
      text: req.body.text,
      done:false
    }, function(err, todo) {
      if (err)
        res.send(err);

      Todo.find(
        { userId: req.user.id },
        function(err, todos) {
        if (err)
          res.send(err)

        res.json(todos);
      });
    });
  });

  app.delete('/api/todos/:todo_id', function(req, res) {

    Todo.remove({
      _id : req.params.todo_id
    }, function(err, todo) {
      if (err)
        res.send(err);

      Todo.find(
        { userId: req.user.id },
        function(err, todos) {
        if (err)
          res.send(err)

        res.json(todos);
      });
    });
  });

}
