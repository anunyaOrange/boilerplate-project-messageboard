'use strict';

const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require('uuid');

// const db = [{
//   uuidid: uuidv4(),
//   nanoid: nanoid(),
//   board: 'example',
//   delete_password: 'xxxxx',
//   text: 'This is example text',
//   created_on: new Date(),
//   replies: [{
//     uuidid: uuidv4(),
//     nanoid: nanoid(),
//     text: 'This is example reply',
//     delete_password: 'xxxxx',
//     created_on: new Date(),
//   }],
// }];

const db = [
  {
    board: 'example',
    threads: [
      {
        tid: uuidv4(),
        delete_password: 'xxxxx',
        text: 'This is example text',
        created_on: new Date(),
        replies: [{
          rid: uuidv4(),
          text: 'This is example reply',
          delete_password: 'xxxxx',
          created_on: new Date(),
        }],
      }
    ],
  }
];

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);
      console.log("GET /api/threads/:board boardDB: ", boardDB);
      const threads = boardDB.length > 0 ? boardDB[0].threads : [];
      console.log("GET /api/threads/:board threads: ", threads);

      if (threads.length === 0) {
        return res.status(404).json({ message: 'No threads found for this board' });
      }
      // Limit to 10 most recent threads with 3 replies each
      const recentThreads = threads.slice(-10).map(thread => ({
        tid: thread.tid,
        text: thread.text,
        created_on: thread.created_on,
        replies: thread.replies.slice(-3), // Limit to 3 replies
      }));
      console.log("GET /api/threads/:board recentThreads: ", recentThreads);
      res.json(recentThreads);
    })
    .post((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);

      const data = {
        tid: uuidv4(),
        delete_password: req.body.delete_password,
        text: req.body.text,
        created_on: new Date(),
        replies: [],
      };

      if (boardDB.length === 0) {
        const newBoard = {
          board: board,
          threads: data
        };
        db.push(newBoard);
      } else {
        boardDB[0].threads.push(data);
      }
      console.log("POST /api/threads/:board DB after push: ", db);
      res.text = 'success';
    })
    .put((req, res) => {
      const report_id = req.body.report_id;
      console.log("PUT /api/threads/:board report_id: ", report_id);
      res.status(200).text('reported');
    })
    .delete((req, res) => {
      console.log("DELETE /api/threads/:board DB before delete: ", db);
      const board = req.params.board;
      const threadIndex = db.findIndex(thread => thread.board === board && thread.delete_password === req.body.delete_password);
      if (threadIndex === -1) {
        return res.status(400).json({ message: 'Incorrect password or thread not found' });
      }
      db.splice(threadIndex, 1);
      console.log("DELETE /api/threads/:board DB after delete: ", db);
      res.json({ message: 'deleted - NEED Re-check' });
    });

  app.route('/api/replies/:board');

};
