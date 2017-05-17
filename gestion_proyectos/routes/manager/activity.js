"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
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
              res.render('manager/activities/list', {
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
                      res.render('manager/activities/list', {
                        projects: result,
                        activities: data,
                        user: req.session.user[0]
                      })
                    }
                  });
                }
              });
            } else {
              res.redirect('/activity/list');
            }
          });
        } else {
          res.redirect('/activity/list');
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
                  res.render('manager/activities/createEdit', {
                    visible: false,
                    projects: data,
                    members: member,
                    json: JSON.stringify(member),
                    color: 'success',
                    action: 'Crear',
                    url: 'create',
                    user: req.session.user[0]
                  });
                } else {
                  res.render('manager/activities/createEdit', {
                    visible: true,
                    action: 'Crear',
                    user: req.session.user[0]
                  });
                }
              }
            });
          } else {
            res.render('manager/activities/createEdit', {
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

router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.body.project, req.body.member, req.body.name, req.body.start, req.body.end, req.body.description];
      let validate = util.isNotEmptyNotNull(array[0], array[1], array[2], array[3], array[4], array[5]);
      if (validate) {
        let activity = {
          project: array[0],
          member: array[1],
          name: array[2],
          start: array[3],
          end: array[4],
          description: array[5]
        }
        db.execute(queries.addActivity, activity, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/activity/list');
          }
        });
      } else {
        res.redirect('/activity/create');
      }
    }
  }
});

router.get('/delete', (req, res) => {
  res.redirect('/');
});

router.get('/delete/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id, req.params.id];
      let validate = util.isNotEmptyNotNull(array[0], array[1]);
      if (validate) {
        db.execute(queries.selectActivity, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user_project == req.session.user[0].id) {
                let ids = [array[1]];
                db.execute(queries.deleteActivity, ids, (error, req) => {
                  if (error) {
                    res.redirect('/');
                  } else {
                    res.redirect('/activity/list');
                  }
                });
              } else {
                res.redirect('/');
              }
            } else {
              res.redirect('/');
            }
          }
        });
      } else {
        res.redirect('/');
      }
    }
  }
});

router.get('/edit', (req, res) => {
  res.redirect('/');
})

router.get('/edit/:id', (req, res) => {
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
                  let array = [user[0], req.params.id];
                  db.execute(queries.selectActivity, array, (err, result) => {
                    if (err) {
                      res.redirect('/');
                    } else {
                      let activity = {
                        id: result[0].id,
                        name: result[0].name,
                        description: result[0].description,
                        start: result[0].start,
                        end: result[0].end,
                        project: result[0].project,
                        member: result[0].member
                      };
                      for (let i = 0; i < data.length; i++) {
                        if (data[i].id == activity.project) {
                          data[i]['select'] = true;
                          break;
                        }
                      }
                      res.render('manager/activities/createEdit', {
                        visible: false,
                        projects: data,
                        members: member,
                        activity: activity,
                        json: JSON.stringify(member),
                        color: 'warning',
                        action: 'Editar',
                        url: 'edit',
                        user: req.session.user[0]
                      });
                    }
                  });
                } else {
                  res.render('manager/activities/createEdit', {
                    visible: true,
                    action: 'Crear',
                    user: req.session.user[0]
                  });
                }
              }
            });
          } else {
            res.render('manager/activities/createEdit', {
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

router.post('/edit', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.body.project, req.body.member, req.body.name, req.body.start,
        req.body.end, req.body.description, req.body.id
      ];
      let validate = util.isNotEmptyNotNull(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
      if (validate) {
        db.execute(queries.editActivity, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/activity/list');
          }
        });
      } else {
        res.redirect('/activity/list');
      }
    }
  }
});

module.exports = router;
