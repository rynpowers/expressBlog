var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/blog', (req, res) => {
  res.render('index')
});

app.get('/blog/:id', (req, res) => {
  res.render('show')
})

app.listen(3000, () => {
  console.log('Server running on Port '+port)
});
