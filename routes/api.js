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

const newDate = new Date();
const db = [
  {
    board: 'example',
    threads: [
      {
        _id: uuidv4(),
        delete_password: 'xxxxx',
        text: 'This is example text',
        created_on: newDate,
        bumped_on: newDate,
        reported: false,
        replies: [{
          _id: uuidv4(),
          text: 'This is example reply',
          delete_password: 'xxxxx',
          created_on: newDate,
          reported: false,
        }],
      },
      {
        _id: '3650e13f-820c-4365-b127-29497b4fa93f',
        delete_password: '123456',
        text: 'This thread for delete',
        created_on: newDate,
        bumped_on: newDate,
        reported: false,
        replies: [{
          _id: uuidv4(),
          text: 'This is example reply',
          delete_password: 'xxxxx',
          created_on: newDate,
          reported: false,
        }],
      },
      {
        _id: 'f250e13f-820c-4365-b127-29497b4fa9f2',
        delete_password: '123456',
        text: 'This thread for replies',
        created_on: newDate,
        bumped_on: newDate,
        reported: false,
        replies: [{
          _id: 'a250e13f-820c-4365-b127-29497b4fa9fa',
          text: 'This reply for delete',
          delete_password: '1234567',
          created_on: newDate,
          reported: false,
        },
        {
          _id: 'b250e13f-820c-4365-b127-29497b4fa9fb',
          text: 'This reply for reporting',
          delete_password: '1234567890',
          created_on: newDate,
          reported: false,
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
      const recentThreads = threads.sort((a, b) => b.bumped_on - a.bumped_on).slice(-10).map(thread => ({
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        // reported: thread.reported,
        replies: thread.replies.sort((a, b) => b.created_on - a.created_on).slice(-3).map(reply => ({
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on,
        })), // Limit to 3 replies
      }));
      // console.log("GET /api/threads/:board recentThreads: ", recentThreads);
      res.json(recentThreads);
    })

    .post((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);

      const curDate = new Date();
      const data = {
        _id: uuidv4(),
        delete_password: req.body.delete_password,
        text: req.body.text,
        created_on: new Date(),
        created_on: curDate,
        bumped_on: curDate,
        reported: false,
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
      res.json([data]);
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

      const f = boardDB[0].threads.find(thread => thread._id === thread_id && thread.delete_password === delete_password);
      if (!f) {
        return res.send('incorrect password');
      } else {
        boardDB[0].threads = boardDB[0].threads.filter(thread => !(thread._id === req.body.thread_id && thread.delete_password === req.body.delete_password));
        // console.log("DELETE /api/threads/:board DB after delete: ", db[0]);
        return res.send('success');
      }
    });

  app.route('/api/replies/:board')

    .post((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);
      const { thread_id, text, delete_password } = req.body;

      const curDate = new Date();
      const reply = {
        _id: uuidv4(),
        delete_password: delete_password,
        text: text,
        created_on: curDate,
        reported: false,
      };

      res.set('Content-Type', 'text/plain');

      if (boardDB.length === 0) {
        return res.send('incorrect board');
      }

      if (!thread_id || !text || !delete_password) {
        return res.status(400).send('missing required fields');
      }

      const thread = boardDB[0].threads.find(thread => thread._id === thread_id);
      if (!thread) {
        return res.send('incorrect thread_id');
      }
      thread.bumped_on = curDate;
      thread.replies.push(reply);
      res.send('success');
    })

    .get((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);
      const thread_id = req.query.thread_id;

      if (boardDB.length === 0) {
        res.set('Content-Type', 'text/plain');
        return res.send('incorrect board');
      }

      const threads = boardDB.length > 0 ? boardDB[0].threads : [];

      if (threads.length === 0) {
        // return res.status(404).json({ message: 'No threads found for this board' });
        res.set('Content-Type', 'text/plain');
        return res.send('no threads found');
      }

      const thread = threads.find(t => t._id === thread_id);
      if (!thread) {
        res.set('Content-Type', 'text/plain');
        return res.send('incorrect thread_id');
      }
      const resThread = {
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies.sort((a, b) => b.created_on - a.created_on).slice(-3).map(reply => ({
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on,
        }))
      };
      res.json(resThread);
    })

    .delete((req, res) => {
      const board = req.params.board;
      const boardDB = db.filter(b => b.board === board);
      const { thread_id, reply_id, delete_password } = req.body;

      res.set('Content-Type', 'text/plain');

      if (boardDB.length === 0) {
        return res.send('incorrect board');
      }

      if (!thread_id || !reply_id || !delete_password) {
        return res.status(400).send('missing required fields');
      }

      const thread = boardDB[0].threads.find(thread => thread._id === thread_id);
      if (!thread) {
        return res.send('incorrect thread');
      }

      const f = thread.replies.find(reply => reply._id === reply_id && reply.delete_password === delete_password);
      if (!f) {
        return res.send('incorrect password');
      } else {
        thread.replies = thread.replies.filter(reply => !(reply._id === reply_id && reply.delete_password === delete_password));
        // console.log("DELETE /api/replies/:board DB after delete: ", db[0].threads[1]);
        return res.send('success');
      }
    })

    .put((req, res) => {
      const { thread_id, reply_id } = req.body;
      // console.log("PUT /api/threads/:board report_id: ", report_id);
      res.set('Content-Type', 'text/plain');
      res.send('reported');
    });
};




