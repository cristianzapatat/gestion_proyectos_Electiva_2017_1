"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('member/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          db.execute(queries.listAllMembers, array, (fail, result) => {
            if (fail) {
              res.redirect('/');
            } else {
              res.render('members/list', {
                projects: data,
                members: result,
                user: req.session.user[0]
              });
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
        res.redirect('/member/list');
      } else {
        let array = [req.session.user[0].id, id];
        let validateCharge = util.isNotEmptyNotNull(array[0], array[1]);
        if (validateCharge) {
          let values = [id];
          db.execute(queries.selectProject, values, (error, value) => {
            if (value.length > 0) {
              db.execute(queries.listMemberByProject, array, (err, data) => {
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
                      res.render('members/list', {
                        projects: result,
                        members: data,
                        user: req.session.user[0]
                      })
                    }
                  });
                }
              });
            } else {
              res.redirect('/member/list');
            }
          });
        } else {
          res.redirect('/member/list');
        }
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
      let validateCharge = util.isNotEmptyNotNull(array[0], array[1]);
      if (validateCharge) {
        db.execute(queries.selectMember, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user == req.session.user[0].id) {
                let ids = [array[1]];
                db.execute(queries.deleteMember, ids, (error, req) => {
                  if (error) {
                    res.redirect('/');
                  } else {
                    res.redirect('/member/list');
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

router.post('/delete', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id, req.body.id];
      let validateCharge = util.isNotEmptyNotNull(array[0], array[1]);
      if (validateCharge) {
        db.execute(queries.selectMember, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user == req.session.user[0].id) {
                let ids = [array[1]];
                db.execute(queries.deleteMember, ids, (error, req) => {
                  if (error) {
                    res.redirect('/');
                  } else {
                    res.redirect('/member/create');
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

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.render('members/create', {
            user: req.session.user[0],
            projects: data,
            visible: !(data.length > 0),
            state: false,
            action: 'Añadir',
            color: 'success'
          })
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
      let array = [req.body.project, req.body.user];
      let validate = util.isNotEmptyNotNull(array[0], array[1]);
      if (validate) {
        let member = {
          project: array[0],
          user: array[1]
        }
        db.execute(queries.addMember, member, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/member/create');
          }
        });
      } else {
        res.redirect('/member/create');
      }
    }
  }
});

router.get('/search', (req, res) => {
  res.redirect('/member/create');
});

router.post('/search', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id];
      db.execute(queries.listProjectByUser, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          let datas = [array[0], req.body.document, req.body.project];
          let validate = util.isNotEmptyNotNull(datas[0], datas[1], datas[2]);
          if (validate) {
            db.execute(queries.selectMemberByDocument, datas, (__error, __data) => {
              if (__error) {
                res.redirect('/');
              } else {
                if (__data.length > 0) {
                  let member = {
                    id: __data[0].id,
                    name: __data[0].name,
                    last_name: __data[0].last_name,
                    mail: __data[0].mail,
                    project: __data[0].project,
                    project_name: __data[0].project_name
                  }
                  res.render('members/create', {
                    user: req.session.user[0],
                    projects: data,
                    visible: !(data.length > 0),
                    state: true,
                    err: false,
                    member: member,
                    url: 'delete',
                    action: 'Eliminar',
                    color_action: "danger",
                    color: 'success'
                  });
                } else {
                  let ids = [datas[1]];
                  db.execute(queries.selectUser, ids, (fail, result) => {
                    if (fail) {
                      res.redirect('/');
                    } else {
                      if (result.length > 0) {
                        let project_name = "";
                        for (let i = 0; i < data.length; i++) {
                          if (parseInt(datas[2]) == data[i].id) {
                            project_name = data[i].name;
                            break;
                          }
                        }
                        let member = {
                          name: result[0].name,
                          last_name: result[0].last_name,
                          project: datas[2],
                          id_user: result[0].id,
                          mail: result[0].mail,
                          project_name: project_name
                        }
                        res.render('members/create', {
                          user: req.session.user[0],
                          projects: data,
                          state: true,
                          err: false,
                          member: member,
                          url: 'create',
                          color_action: 'success',
                          color: 'success',
                          action: 'Añadir',
                          visible: !(data.length > 0),
                        })
                      } else {
                        for (let i = 0; i < data.length; i++) {
                          if (parseInt(datas[2]) == data[i].id) {
                            data[i]['select'] = true;
                            break;
                          }
                        }
                        res.render('members/create', {
                          user: req.session.user[0],
                          projects: data,
                          state: true,
                          err: true,
                          color: 'success'
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
            res.redirect('/member/list');
          }
        }
      });
    }
  }
});

module.exports = router;
