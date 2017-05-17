"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
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
              res.render('manager/meeting/list', {
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
                      res.render('manager/meeting/list', {
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
            res.render('manager/meeting/createEdit', {
              visible: false,
              projects: data,
              color: 'success',
              action: 'Crear',
              url: 'create',
              user: req.session.user[0]
            });
          } else {
            res.render('manager/meeting/createEdit', {
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
      let meeting = {
        project: req.body.project,
        thematic: req.body.thematic,
        ubication: req.body.ubication,
        start: req.body.start
      };
      let validate = util.isNotEmptyNotNull(meeting.project, meeting.thematic, meeting.ubication,
        meeting.start);
      if (validate) {
        db.execute(queries.addMeeting, meeting, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/meeting/list');
          }
        });
      } else {
        res.render('manager/meeting/createEdit', {
          error: 'Complete el formulario',
          action: 'Crear',
          color: 'success',
          url: 'create',
          user: req.session.user[0]
        });
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
      let array = [req.session.user[0].id, req.params.id];
      let validate = util.isNotEmptyNotNull(array[0], array[1]);
      if (validate) {
        let ids = [array[0]];
        db.execute(queries.listProjectByUser, ids, (error, result) => {
          if (error) {
            res.redirect('/');
          } else {
            if (result.length > 0) {
              let idsM = [array[1]];
              db.execute(queries.selectMeeting, idsM, (err, data) => {
                if (err) {
                  res.redirect('/');
                } else {
                  if (data.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                      if (result[i].id == data[0].project) {
                        result[i]['select'] = true;
                        break;
                      }
                    }
                    if (data[0].user == req.session.user[0].id) {
                      res.render('manager/meeting/createEdit', {
                        action: 'Editar',
                        color: 'warning',
                        url: 'edit',
                        meeting: data[0],
                        projects: result,
                        user: req.session.user[0]
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
        });
      } else {
        res.redirect('/');
      }
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
      let array = [req.body.project, req.body.thematic, req.body.ubication, req.body.start,
        req.body.id
      ];
      let validate = util.isNotEmptyNotNull(array[0], array[1], array[2], array[3], array[4]);
      if (validate) {
        db.execute(queries.editMeeting, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/meeting/list');
          }
        });
      } else {
        res.redirect('/meeting/list');
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
      let array = [req.params.id];
      let validate = util.isNotEmptyNotNull(array[0]);
      if (validate) {
        db.execute(queries.selectMeeting, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user == req.session.user[0].id) {
                db.execute(queries.deleteMeeting, array, (err, result) => {
                  if (err) {
                    res.redirect('/');
                  } else {
                    res.redirect('/meeting/list');
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

module.exports = router;
