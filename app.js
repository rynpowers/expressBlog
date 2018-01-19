var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var {Blog} = require('./models/blogs')
var {ObjectID} = require('mongodb');
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

app.listen(port, () => {
  console.log('Server running on Port '+ port)
});

module.exports = {app};
