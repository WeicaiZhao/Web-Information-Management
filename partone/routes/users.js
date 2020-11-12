var express = require('express');
var router = express.Router();
const db = require('../data/index.js')

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username text, password text, role text)");
  // const insert = 'INSERT INTO users (username, password, role) VALUES (?,?,?)'
  // db.run(insert, ['admin', '123456', '1'])
  // db.run(insert, ['user', '123456', '0'])
});

// change user info
router.patch('/', function (req, res) {
  if (!req.body.password) {
    res.json({
      status: 0,
      data: 'user error'
    })
  } else {
    const sql = "UPDATE users SET password = ? WHERE id = ?;"
    db.run(sql, [req.body.password, +req.headers.token.split('-')[0]], function (err, rows) {
      if (!err) {
        res.json({
          status: 1,
          data: rows
        });
      }
      else {
        res.json({
          status: 0,
          data: 'get user error'
        })
      }
    });
  }
})

// change user info admin
router.put('/:id', function (req, res) {
  if (req.headers.token && +req.headers.token.split('-')[2]) {
    if (req.body.username && req.body.password) {
      const sql = "UPDATE users SET username = ?, role = ?, password = ? WHERE id = ?;"
      db.run(sql, [req.body.username, req.body.role, req.body.password, +req.params.id], function (err, rows) {
        if (!err) {
          res.json({
            status: 1,
            data: rows
          });
        }
        else {
          res.json({
            status: 0,
            data: err
          })
        }
      });
    } else {
      res.json({
        status: 0,
        data: 'plase input all'
      })
    }
  } else {
    res.json({
      status: 0,
      data: 'no anthority'
    })
  }
})

// change user info
router.delete('/:id', function (req, res) {
  if (req.headers.token && +req.headers.token.split('-')[2]) {
    db.run("DELETE FROM users WHERE id = ?", [+req.params.id], function (err, rows) {
      if (!err) {
        res.json({
          status: 1,
          data: 'delete success'
        });
      }
      else {
        res.json({
          status: 0,
          data: err
        })
      }
    });
  } else {
    res.json({
      status: 0,
      data: 'no anthority'
    })
  }
})

// get user list admin
router.get('/', function (req, res) {
  if (req.headers.token && +req.headers.token.split('-')[2]) {
    try {
      db.all("SELECT rowid AS id, username, password, role FROM users", function (err, rows) {
        if (!err) {
          res.json({
            status: 1,
            data: rows
          });
        }
        else {
          res.json({
            status: 0,
            data: err
          })
        }
      });
    } catch (error) {
      res.json({
        status: 0,
        data: error
      })
    }
  } else {
    res.json({
      status: 0,
      data: 'no anthority'
    })
  }
});

// register
router.post('/add', function (req, res, next) {
  const params = req.body;
  if (!params.username || !params.password) {
    res.json({
      status: 0,
      data: 'register fail'
    })
  } else {
    const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const searchSql = 'SELECT rowid AS id, username, password, role FROM users where username = ?'
    try {
      db.get(searchSql, [params.username], function (err, result) {
        if (!err) {
          if (result) {
            res.json({
              status: 0,
              data: 'This username has been registered'
            });
          } else {
            db.run(sql, [params.username, params.password, params.role], function (err, result) {
              if (err) {
                res.json({
                  status: 0,
                  data: err
                })
                return;
              }
              res.json({
                status: 1,
                data: 'register success'
              })
            });
          }
        }
        else {
          res.json({
            status: 0,
            data: err
          })
        }
      })
    } catch (error) {
      res.json({
        status: 0,
        data: error
      })
    }
  }
});

// login
router.post('/login', function (req, res, next) {
  const params = req.body;
  if (!params.username || !params.password) {
    res.json({
      status: 0,
      data: 'login fail'
    })
  } else {
    const sql = 'SELECT rowid AS id, username, password, role FROM users where username = ?';
    try {
      db.get(sql, [params.username], function (err, rows) {
        if (!err) {
          if (rows) {
            if (params.password === rows.password) {
              res.json({
                status: 1,
                data: `${rows.id}-${rows.username}-${rows.role}`
              });
            } else {
              res.json({
                status: 0,
                data: 'login error'
              })
            }
          } else {
            res.json({
              status: 0,
              data: 'login error'
            })
          }
        }
        else {
          res.json({
            status: 0,
            data: err
          })
        }
      });
    } catch (error) {
      res.json({
        status: 0,
        data: error
      })
    }
  }
});

module.exports = router;
