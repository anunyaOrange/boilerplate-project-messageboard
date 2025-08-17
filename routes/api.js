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
      },
      {
        tid: '3650e13f-820c-4365-b127-29497b4fa93f',
        delete_password: '123456',
        text: 'This is example text for delete',
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
      // console.log("GET /api/threads/:board boardDB: ", boardDB);
      const threads = boardDB.length > 0 ? boardDB[0].threads : [];
      // console.log("GET /api/threads/:board threads: ", threads);

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
      // console.log("GET /api/threads/:board recentThreads: ", recentThreads);
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
          threads: [data]
        };
        db.push(newBoard);
      } else {
        boardDB[0].threads.push(data);
      }
      res.set('Content-Type', 'text/plain');
      res.send('success');
    })

    .put((req, res) => {
      const report_id = req.body.report_id;
      // console.log("PUT /api/threads/:board report_id: ", report_id);
      res.set('Content-Type', 'text/plain');
      res.send('reported');
    })

    .delete((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);
      const { thread_id, delete_password } = req.body;

      // console.log("DELETE /api/threads/:board req.body: ", thread_id, delete_password);

      res.set('Content-Type', 'text/plain');

      if (boardDB.length === 0) {
        return res.send('incorrect board');
      }

      if (!thread_id || !delete_password) {
        return res.status(400).send('missing required fields');
      }

      // console.log("DELETE /api/threads/:board boardDB[0].threads: ", boardDB[0].threads);

      const f = boardDB[0].threads.find(thread => thread.tid === thread_id && thread.delete_password === delete_password);
      if (!f) {
        return res.send('incorrect password');
      } else {
        boardDB[0].threads = boardDB[0].threads.filter(thread => !(thread.tid === req.body.thread_id && thread.delete_password === req.body.delete_password));
        // console.log("DELETE /api/threads/:board DB after delete: ", db[0]);
        return res.send('success');
      }
    });

  app.route('/api/replies/:board');

};




