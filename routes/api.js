'use strict';

const db = [{
  id: 1,
  board: 'test-board',
  delete_password: '123456',
  text: 'This is a sample thread text',
  created_on: new Date(),
  replies: [{
    id: 1,
    text: 'This is a sample reply',
    delete_password: '123456',
    created_on: new Date(),
  }],
}];

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get((req, res) => {
    res.json({ message: 'GET threads for board: ' + req.params.board });
  })
  .post((req, res) => {
    db.push(`${db.length + 1} - ${req.body.text} on board ${req.params.board}`);
    res.json({ message: 'POST thread to board: ' + req.params.board + ' => ' + JSON.stringify(req.body) + ' => ' + db });
  })
  .put((req, res) => {
    res.json({ message: 'PUT thread on board: ' + req.params.board });
  })
  .delete((req, res) => {
    res.json({ message: 'DELETE thread from board: ' + req.params.board });
  });
    
  app.route('/api/replies/:board');

};
