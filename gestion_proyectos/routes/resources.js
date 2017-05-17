"use strict";

var express= require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/resource/list');
});

router.get('/list',(req, res)=>{
  if (!req.session.user) {
    res.redirect('/');
  }else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    }else {
      let user =[req.session.user[0].id];
      db.execute(queries.listAllResources, user, (error, data)=>{
        if (error) {
          res.redirect('/');
        }else {
          db.execute(queries.listProjectByUser, user, (err, result) => {
            if (err) {
              res.redirect('/');
            } else {
              res.render('resources/list', {
                projects: result,
                resources: data,
                user: req.session.user[0]
              });
            }
          });
        }
      })
    }
  }
})

module.exports = router;
