"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/meeting/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let user = [req.session.user[0].id];
      db.execute(queries.listAllMeeting, user, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          db.execute(queries.listProjectByUser, user, (err, result) => {
            if (err) {
              res.redirect('/');
            } else {
              res.render('meeting/list', {
                projects: result,
                meetings: data,
                user: req.session.user[0]
              });
            }
          });
        }
      });
    }
  }
})

router.get('/list/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let id = req.params.id;
      if (id == '-1') {
        res.redirect('/meeting/list');
      } else {
        let array = [req.session.user[0].id, id];
        let validate = util.isNotEmptyNotNull(array[0], array[1]);
        if (validate) {
          let values = [id];
          db.execute(queries.selectProject, values, (error, value) => {
            if (value.length > 0) {
              db.execute(queries.listMeetingByProject, array, (err, data) => {
                if (err) {
                  res.redirect('/');
                } else {
                  let user = [array[0]];
                  db.execute(queries.listProjectByUser, user, (fail, result) => {
                    if (fail) {
                      res.redirect('/');
                    } else {
                      for (let i = 0; i < result.length; i++) {
                        if (result[i].id == id) {
                          result[i]['select'] = true;
                          break;
                        }
                      }
                      res.render('meeting/list', {
                        projects: result,
                        meetings: data,
                        user: req.session.user[0]
                      })
                    }
                  });
                }
              });
            } else {
              res.redirect('/meeting/list');
            }
          });
        } else {
          res.redirect('/meeting/list');
        }
      }
    }
  }
});

module.exports = router;
