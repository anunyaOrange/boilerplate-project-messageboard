'use strict';

const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require('uuid');

const db = [{
  uuidid: uuidv4(),
  nanoid: nanoid(),
  board: 'example',
  delete_password: 'xxxxx',
  text: 'This is example text',
  created_on: new Date(),
  replies: [{
    uuidid: uuidv4(),
    nanoid: nanoid(),
    text: 'This is example reply',
    delete_password: 'xxxxx',
    created_on: new Date(),
  }],
}];

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get((req, res) => {
      const board = req.params.board;
      const threads = db.filter(thread => thread.board === board);
      console.log("GET /api/threads/:board DB: ", db);
      console.log("GET /api/threads/:board threads: ", threads);
      if (threads.length === 0) {
        return res.status(404).json({ message: 'No threads found for this board' });
      }
      // Limit to 10 most recent threads with 3 replies each
      const recentThreads = threads.slice(-10).map(thread => ({
        uuidid: thread.uuidid,
        nanoid: thread.nanoid,
        board: thread.board,
        text: thread.text,
        created_on: thread.created_on,
        replies: thread.replies.slice(-3), // Limit to 3 replies
      }));
      console.log("GET /api/threads/:board recentThreads: ", recentThreads);
      res.json(recentThreads);
    })
    .post((req, res) => {
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
      console.log("POST /api/threads/:board DB after push: ", db);
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
