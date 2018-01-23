const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate')
const {Blog} = require('./models/blogs');
const {User} = require('./models/users');



var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/expressBlog')

var port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('landing')
});

app.post('/blog', (req, res) =>{
  var content = req.body
  var blog = new Blog(content);

  blog.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get('/blog', (req, res) => {
  Blog.find().then((blogs) => {
    res.send({blogs});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/blog/:id', (req, res) => {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send()
  }
  Blog.findById(req.params.id).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog);
  }).catch((e) => res.status(400).send())
});

app.delete('/blog/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send()
  }
  Blog.findByIdAndRemove(req.params.id).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog)
  }).catch((e) => res.status(400).send(e));
});

app.patch('/blog/:id', (req, res) => {

  var body = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.image
  }

  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send()
  }
  Blog.findByIdAndUpdate(req.params.id, {$set:body}, {new:true}).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog);
  }).catch((e) => res.status(400).send(e));
})

app.post('/user', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  var user = new User(body)

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user)
});

app.post('/users/me/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => res.status(400).send());
});

app.delete('/users/me', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log('Server running on Port '+ port)
});

module.exports = {app};
