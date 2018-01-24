const {ObjectID} = require('mongodb');
const {Blog} = require('./../../models/blogs')
const jwt = require('jsonwebtoken');
const config = require('./../../config/config')

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var blogs = [
  {
    _id: new ObjectID(),
    title: 'hello',
    image: "https://images.unsplash.com/photo-1467189386127-c4e5e31ee213?auto=format&fit=crop&w=1350&q=80",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum curabitur vitae nunc sed velit dignissim sodales. Nunc congue nisi vitae suscipit tellus mauris."
  },
  {
    _id: new ObjectID(),
    title: 'hello again',
    image: "https://images.unsplash.com/photo-1467189386127-c4e5e31ee213?auto=format&fit=crop&w=1350&q=80",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum curabitur vitae nunc sed velit dignissim sodales. Nunc congue nisi vitae suscipit tellus mauris."
  }
]

var users = [
  {
    _id: userOneId,
    email: 'ryan@gmail.com',
    password: 'password',
    tokens: {
      access: 'auth',
      token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }
  }
]

const createBlogs = (done) => {
  Blog.remove({}).then(() => {
    return Blog.insertMany(blogs)
  }).then(() => done());
}

module.exports = {createBlogs, blogs};
