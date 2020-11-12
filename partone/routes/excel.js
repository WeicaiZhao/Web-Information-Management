var express = require('express');
var router = express.Router();
const db = require('../data/index.js')

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS excels ( id INTEGER PRIMARY KEY AUTOINCREMENT, userid int, username text, title text, data text, isCopy int)");
  // const insert = 'INSERT INTO users (username, password, role) VALUES (?,?,?)'
  // db.run(insert, ['admin', '123456', '1'])
  // db.run(insert, ['user', '123456', '0'])
});

// change excels info
router.put('/', function (req, res) {
  console.log(req.body)
  if (!req.body.data || !req.body.title || !req.body.id) {
    res.json({
      status: 0,
      data: 'Please input all'
    })
  } else {
    if (req.headers.token && +req.headers.token.split('-')[0] === req.body.userid) {
      const sql = "UPDATE excels SET data = ?, isCopy = ?, title = ? WHERE id = ?;"
      db.run(sql, [req.body.data, +req.body.isCopy, req.body.title, +req.body.id], function (err, rows) {
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
        data: 'no anthority'
      })
    }
  }
})

// delete excels
router.delete('/:id', function (req, res) {
  const token = req.headers.token
  const role = +req.headers.token.split('-')[2]
  const userid = +req.headers.token.split('-')[0]
  if (token) {
    if (role) {
      db.run("DELETE FROM excels WHERE id = ?", [+req.params.id], function (err, rows) {
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
      const searchSql = 'SELECT rowid AS id, userid FROM excels where userid = ? AND id = ?'
      db.get(searchSql, [userid, +req.params.id], function (err, result) {
        if (!err) {
          if (result) {
            db.run("DELETE FROM excels where id = ?", [+req.params.id], function (err, rows) {
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
              data: 'delete error!'
            })
          }
        }
        else {
          res.json({
            status: 0,
            data: err
          })
        }
      })
    }
  } else {
    res.json({
      status: 0,
      data: 'no anthority'
    })
  }
})

// get excels list
router.get('/', function (req, res) {
  if (req.headers.token) {
    try {
      if (+req.headers.token.split('-')[2]) {
        // admin
        db.all("SELECT rowid AS id, username, userid, data, isCopy, title FROM excels", function (err, rows) {
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
        // normalSELECT rowid AS id, username, password, role FROM users where username = ?
        db.all("SELECT rowid AS id, userid, username, data, isCopy, title FROM excels where userid = ? OR isCopy = 1", [+req.headers.token.split('-')[0]], function (err, rows) {
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
      }
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

// add excel
router.post('/', function (req, res, next) {
  const params = req.body;
  const userid = +req.headers.token.split('-')[0]
  const username = req.headers.token.split('-')[1]
  console.log(params, userid)
  if (!params.data || !params.title) {
    res.json({
      status: 0,
      data: 'add error'
    })
  } else {
    const sql = "INSERT INTO excels (userid, username, data, isCopy, title) VALUES (?, ?, ?, ?, ?)";
    try {
      db.run(sql, [userid, username, params.data, +params.isCopy, params.title], function (err, result) {
        if (err) {
          res.json({
            status: 0,
            data: err
          })
          return;
        }
        res.json({
          status: 1,
          data: params
        })
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