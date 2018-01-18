var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var {Blog} = require('./models/blogs')
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
    console.log(doc);
  }, (e) => {
    console.log(e);
  })
})

app.get('/blog', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.render('index', {blogs});
  }, (e) => {
    console.log(e);
  })
});

app.listen(port, () => {
  console.log('Server running on Port '+port)
});
