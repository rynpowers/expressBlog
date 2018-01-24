const config = require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose')
const {authenticate} = require('./middleware/authenticate')
const {Blog} = require('./models/blogs');
const {User} = require('./models/users');

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('landing')
});

app.post('/blog', authenticate, (req, res) =>{
  var content = _.pick(req.body, ['title', 'image', 'body'])
  content.author = req.user._id;
  var blog = new Blog(content);

  blog.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get('/blog', authenticate, (req, res) => {
  Blog.find({
    author: req.user._id
  }).then((blogs) => {
    res.send({blogs});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/blog/:id', authenticate, (req, res) => {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send()
  }
  Blog.findOne({
    _id: req.params.id,
    author: req.user._id
  }).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog);
  }).catch((e) => res.status(400).send())
});

app.delete('/blog/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send()
  }
  Blog.findOneAndRemove({
    _id: req.params.id,
    author: req.user._id
  }).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog)
  }).catch((e) => res.status(400).send(e));
});

app.patch('/blog/:id', authenticate, (req, res) => {

  var content = _.pick(req.body, ['title', 'image', 'body'])

  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send()
  }
  Blog.findOneAndUpdate({
    _id: req.params.id,
    author: req.user._id
  }, {$set:content}, {new:true}).then((blog) => {
    if (!blog) {
      return res.status(404).send()
    }
    res.send(blog);
  }).catch((e) => res.status(400).send(e));
})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  var user = new User(body)

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log('Server running on Port '+ process.env.PORT)
});

module.exports = {app};
