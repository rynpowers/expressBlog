const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {Blog} = require('./../models/blogs');

const {app} = require('./../app');

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

beforeEach((done) => {
  Blog.remove({}).then(() => Blog.insertMany(blogs)).then(() => done()).catch((e) => done(e));
});

describe('GET /blog', () => {
  it('should get all blogs', (done) => {
    request(app)
    .get('/blog')
    .expect(200)
    .expect((res) => {
      expect(res.body.blogs.length).toBe(2);
    })
    .end(done);
  });
});

describe('POST /blog', () => {
  it('should post blog', (done) => {
    var blog = {
      _id: new ObjectID(),
      title: 'posted this blog',
      image: "https://images.unsplash.com/photo-1467189386127-c4e5e31ee213?auto=format&fit=crop&w=1350&q=80",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum curabitur vitae nunc sed velit dignissim sodales. Nunc congue nisi vitae suscipit tellus mauris."
    }
    request(app)
    .post('/blog')
    .send(blog)
    .expect(200)
    .expect((res) => {
      expect(res.body.title).toEqual(blog.title);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      done()
    });
  });
});

describe('GET /blog/:id', () => {
  it('should get the blog object from the database', (done) => {
    var id = blogs[0]._id.toHexString()

    request(app)
    .get(`/blog/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(id);
    }, (err) => {
      return done(err);
    })
    .end(done)
  })
  it('should respond with 404 not found', (done) => {
    var id = '6a6220f0642cf6699cb4e1fc'

    request(app)
    .get(`/blog/${id}`)
    .expect(404)
    .end(done);
  });
  it('should respond with 404 not found', (done) => {
    var id = '6a6220f0642cf66'

    request(app)
    .get(`/blog/${id}`)
    .expect(404)
    .end(done);
  });
});
