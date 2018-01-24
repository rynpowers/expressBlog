const jwt = require('jsonwebtoken');
const config = require('./../../config/config')

const {ObjectID} = require('mongodb');
const {Blog} = require('./../../models/blogs')
const {User} = require('./../../models/users')

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var blogs = [
  {
    _id: new ObjectID(),
    title: 'hello',
    image: "https://images.unsplash.com/photo-1467189386127-c4e5e31ee213?auto=format&fit=crop&w=1350&q=80",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum curabitur vitae nunc sed velit dignissim sodales. Nunc congue nisi vitae suscipit tellus mauris.",
    author: userOneId
  },
  {
    _id: new ObjectID(),
    title: 'hello again',
    image: "https://images.unsplash.com/photo-1467189386127-c4e5e31ee213?auto=format&fit=crop&w=1350&q=80",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum curabitur vitae nunc sed velit dignissim sodales. Nunc congue nisi vitae suscipit tellus mauris.",
    author: userTwoId
  }
]

var users = [
  {
    _id: userOneId,
    email: 'ryan@gmail.com',
    password: 'password',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
  },
  {
    _id: userTwoId,
    email: 'hillary@gmail.com',
    password: 'password',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
  }
]

const createBlogs = (done) => {
  Blog.remove({}).then(() => {
    return Blog.insertMany(blogs)
  }).then(() => done()).catch((e) => done(e));
}

const createUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done()).catch((e) => done(e));
}

module.exports = {
  createBlogs,
  createUsers,
  users,
  blogs
};
