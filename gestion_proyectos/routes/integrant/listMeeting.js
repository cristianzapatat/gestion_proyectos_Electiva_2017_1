"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/listmeeting/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      if (!req.session.project) {
        res.redirect('/integrant/projects');
      } else {
        let array = [req.session.user[0].id, req.session.project[0].id];
        db.execute(queries.listMeetingForMemberAndProject, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.render('integrant/listMeeting', {
              meetings: data,
              user: req.session.user[0],
              project: req.session.project[0].name
            });
          }
        });
      }
    }
  }
});

module.exports = router;
