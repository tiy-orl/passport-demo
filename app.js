/* users should have pwd and username
* user can login/logout/signup
* user can ask a question
  * question has title and body
* users can answer questions
  * answers have body
* user who asked a question can mark an answer as accepted*/

const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const client = require('./client');
const passport = require('./authentication');

const app = express();

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));



app.use(session({
  secret: 'keyboard cat shirt',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (request, response) {
  request.session.last_visit = new Date();
  console.log('session is ', request.session);
  response.render('index');
});

app.get('/signup', function (request, response) {
  response.render('signup');
});

app.post('/signup', function (request, response, next) {
  const { username, password } = request.body;
  const insert = 'INSERT INTO users(username, password) VALUES($1, $2)';
  client.query(insert, [username, password], function (err, dbResponse) {
    passport.authenticate('local', function (error, user) {
      if (error) {
        next(error);
      } else if (!user) {
        response.redirect('/login');
      } else {
        request.login(user, function(err) {
          if (err) {
            next(err);
          } else {
            response.redirect('/');
          }
        })
      }
    })(request, response, next);
  });
});

app.get('/login', function (request, response) {
  response.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

// can't use DELETE in form https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
app.post('/logout', function (request, response) {
  request.session.destroy()
  response.redirect('/')
});

app.listen(3000, function () {
  console.log('server listening on port 3000');
});
