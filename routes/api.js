'use strict';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get((req, res) => {
    res.json({ message: 'GET threads for board: ' + req.params.board });
  })
  .post((req, res) => {
    console.log("req.body", req.body);
    res.json({ message: 'POST thread to board: ' + req.params.board });
  })
  .put((req, res) => {
    res.json({ message: 'PUT thread on board: ' + req.params.board });
  })
  .delete((req, res) => {
    res.json({ message: 'DELETE thread from board: ' + req.params.board });
  });
    
  app.route('/api/replies/:board');

};
