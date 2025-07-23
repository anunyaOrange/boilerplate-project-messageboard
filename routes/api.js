'use strict';

const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require('uuid');

const db = [{
  uuidid: uuidv4(),
  nanoid: nanoid(),
  board: 'test-board',
  delete_password: '123456',
  text: 'This is a sample thread text',
  created_on: new Date(),
  replies: [{
    uuidid: uuidv4(),
    nanoid: nanoid(),
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
    console.log("pre db: ", db);
    const data = {
      uuidid: uuidv4(),
      nanoid: nanoid(),
      board: req.params.board,
      delete_password: req.body.delete_password,
      text: req.body.text,
      created_on: new Date(),
      replies: [],
    };
    db.push(data);
    res.json(data);
  })
  .put((req, res) => {
    res.json({ message: 'PUT thread on board: ' + req.params.board });
  })
  .delete((req, res) => {
    res.json({ message: 'DELETE thread from board: ' + req.params.board });
  });
    
  app.route('/api/replies/:board');

};
