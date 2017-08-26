var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
    //how do we create a crypto
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input', function (req, res) {
    var hashedString = hash(req.params.input, 'this is some random string');
    res.send(hashedString);
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.post('/create-user', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.getRandomBytes(128).toStrings('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" username = $1', [username], function(err, result) {
          if (err) {
            res.status(500).send(err.toString());
          } else {
            if (result.rows.length === 0) {
                res.status(400).send('username / password is invalid');
            } else {
                var dbString = result.row[0].password;
                dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword == dbString) {
                    res.send('Credential Correct');
                } else {
                    res.send(403).send('username/password is invalid');
                }
            }
        }
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" username = $1, password) VALUES($1,$2)', [username, password], function(err, result) {
          if (err) {
            res.status(500).send(err.toString());
          } else {
              if (result.rows.length === 0) {
                  res.send(403).send('username/password is invalid');
              } else {
                  var dbString = result.rows[0].password;
                  var salt = dbString.split('$')[2];
                  var hashedpassword = hash(password, salt);
                  if(hashedpassword == dbString) {
                     res.send('user crenditial success', +username);
                  } else {
                     res.send('invalid login crenditials', +username)
                  }
              }
          }
            
    });
});

var pool = new pool(config);
app.get('/test-db', function (req, res) {
    pool.query('SELECT * from test', function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
 
            res.send(JSON.stringfy(result.rows));
        }
        
    });
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
