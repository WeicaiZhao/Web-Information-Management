const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser')
const configRoutes = require('./routes');

const port = process.env.PORT || 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + "/client"));

// a middleware function with no mount path. This code is executed for every request to the router
app.use(function (req, res, next) {
  if (req.path !== '/user/add' && req.path !== '/user/login') {
    if (req.headers.token) {
      console.log(req.headers.token)
    } else {
      res.status(401).json({
        status: 0,
        data: 'please login'
      })
    }
  }
  next();
});

configRoutes(app);

app.get('/', function (req, res) {
  console.log("User intered in a root page");
  res.sendFile(path.join(__dirname + '../parttwo/dist/index.html'));
})

app.listen(port, function () {
  console.log('server run Url : http://localhost:' + port);
})