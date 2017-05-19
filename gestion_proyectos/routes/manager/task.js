"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/task/list');
});

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let user = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, user, (error, projects) => {
        if (error) {
          res.redirect('/');
        } else {
          db.execute(queries.listAllActivities, user, (__error, activities) => {
            if (__error) {
              res.redirect('/');
            } else {
              db.execute(queries.listAllResources, user, (fail, resources) => {
                if (fail) {
                  res.redirect('/');
                } else {
                  let visible = true;
                  if (projects.length > 0 && activities.length > 0) {
                    visible = false;
                  }
                  res.render('manager/tasks/createEdit', {
                    user: req.session.user[0],
                    color: 'success',
                    url: 'create',
                    action: 'Crear',
                    projects: projects,
                    activities: JSON.stringify(activities),
                    resources: resources,
                    visible: visible
                  });
                }
              });
            }
          });
        }
      });
    }
  }
});

router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let task = {
        activity: req.body.activity,
        name: req.body.name,
        start: req.body.start,
        end: req.body.end,
        state: req.body.state
      };
      let validate = util.isNotEmptyNotNull(task.activity, task.name, task.start, task.end, task.state);
      if (validate) {
        db.execute(queries.addTask, task, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            let idTask = data.insertId;
            let resources = req.body.resources.split(',');
            if (resources.length > 0) {
              let sql = queries.addReserve;
              for (let i = 0; i < resources.length; i++) {
                sql += "(" + idTask + "," + resources[i] + "),";
              }
              sql = sql.substring(0, (sql.length - 1));
              db.execute(sql, (fail, result) => {
                if (fail) {
                  res.redirect('/');
                } else {
                  res.redirect('/task/list');
                }
              });
            } else {
              res.redirect('/task/list');
            }
          }
        });
      } else {
        res.redirect('/task/create');
      }
    }
  }
});

router.get('/edit', (req, res) => {
  res.redirect('/');
});

router.get('/edit/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let user = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, user, (error, projects) => {
        if (error) {
          res.redirect('/');
        } else {
          db.execute(queries.listAllActivities, user, (__error, activities) => {
            if (__error) {
              res.redirect('/');
            } else {
              db.execute(queries.listAllResources, user, (fail, resources) => {
                if (fail) {
                  res.redirect('/');
                } else {
                  let id = req.params.id;
                  if (util.isNotEmptyNotNull(id)) {
                    let array = [id, req.session.user[0].id];
                    db.execute(queries.selectTask, array, (__fail, task) => {
                      if (__fail) {
                        res.redirect('/');
                      } else {
                        if (task.length > 0) {
                          let idTask = [id];
                          db.execute(queries.listReserve, idTask, (err, reserves) => {
                            if (err) {
                              res.redirect('/');
                            } else {
                              let visible = true;
                              if (projects.length > 0 && activities.length > 0) {
                                visible = false;
                              }
                              for (let i = 0; i < projects.length; i++) {
                                if (projects[i].id == task[0].id_project) {
                                  projects[i]['select'] = true;
                                  break;
                                }
                              }
                              //recorrer los recursos de la tarea.
                              for (var i = 0; i < reserves.length; i++) {
                                for (var j = 0; j < resources.length; j++) {
                                  if (reserves[i].resource == resources[j].id) {
                                    resources[i]['select'] = true;
                                  }
                                }
                              }
                              let temp = "";
                              for (var i = 0; i < reserves.length; i++) {
                                temp += reserves[i].resource + ",";
                              }
                              temp = temp.substring(0, (temp.length - 1));
                              res.render('manager/tasks/createEdit', {
                                user: req.session.user[0],
                                color: 'warning',
                                url: 'edit',
                                action: 'Editar',
                                projects: projects,
                                activities: JSON.stringify(activities),
                                resources: resources,
                                visible: visible,
                                task: task[0],
                                temp: temp
                              });
                            }
                          });
                        } else {
                          res.redirect('/task/list');
                        }
                      }
                    });
                  } else {
                    res.redirect('/task/list');
                  }
                }
              });
            }
          });
        }
      });
    }
  }
});

router.post('/edit', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let task = [req.body.activity, req.body.name, req.body.start, req.body.end,
        req.body.state, req.body.id
      ];
      let resources = req.body.resources.split(',');
      db.execute(queries.editTask, task, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          let ids = [req.body.id];
          db.execute(queries.deleteResourceByTask, ids, (__error, del) => {
            if (__error) {
              res.redirect('/');
            } else {
              if (resources.length > 0) {
                let sql = queries.addReserve;
                for (let i = 0; i < resources.length; i++) {
                  sql += "(" + ids[0] + "," + resources[i] + "),";
                }
                sql = sql.substring(0, (sql.length - 1));
                db.execute(sql, (fail, result) => {
                  if (fail) {
                    res.redirect('/');
                  } else {
                    res.redirect('/task/list');
                  }
                });
              } else {
                res.redirect('/task/list');
              }
            }
          });
        }
      });
    }
  }
});

module.exports = router;
