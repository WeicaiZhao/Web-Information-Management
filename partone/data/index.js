var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite3"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQlite database.')
  }
})


module.exports = db