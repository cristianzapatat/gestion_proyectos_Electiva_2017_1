"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/activity/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id];
      db.execute(queries.listAllActivities, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          db.execute(queries.listProjectByUser, array, (fail, result) => {
            if (fail) {
              res.redirect('/');
            } else {
              res.render('activities/list', {
                projects: result,
                activities: data,
                user: req.session.user[0]
              })
            }
          });
        }
      });
    }
  }
});

router.get('/list/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let id = req.params.id;
      if (id == '-1') {
        res.redirect('/activity/list');
      } else {
        let array = [req.session.user[0].id, id];
        let validate = util.isNotEmptyNotNull(array[0], array[1]);
        if (validate) {
          let values = [id];
          db.execute(queries.selectProject, values, (error, value) => {
            if (value.length > 0) {
              db.execute(queries.listActivitiesByProject, array, (error, data) => {
                if (error) {
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
                      res.render('activities/list', {
                        projects: result,
                        activities: data,
                        user: req.session.user[0]
                      })
                    }
                  });
                }
              });
            } else {
              res.redirect('/activities/list');
            }
          });
        } else {
          res.redirect('/activities/list');
        }
      }
    }
  }
});

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let user = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, user, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          if (data.length > 0) {
            db.execute(queries.listAllMembers, user, (error, member) => {
              if (error) {
                res.redirect('/');
              } else {
                if (member.length > 0) {
                  res.render('activities/createEdit', {
                    visible: false,
                    projects: data,
                    members: member,
                    color: 'success',
                    action: 'Crear',
                    url: 'create',
                    user: req.session.user[0]
                  });
                } else {
                  res.render('charges/createEdit', {
                    visible: true,
                    action: 'Crear',
                    user: req.session.user[0]
                  });
                }
              }
            });
          } else {
            res.render('charges/createEdit', {
              visible: true,
              action: 'Crear',
              user: req.session.user[0]
            });
          }
        }
      });
    }
  }
});

module.exports = router;
