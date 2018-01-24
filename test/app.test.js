const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {Blog} = require('./../models/blogs');
const {User} = require('./../models/users');
const {createBlogs, createUsers, users, blogs} = require('./seeds/seeds.js')

const {app} = require('./../app');

beforeEach(createUsers);
beforeEach(createBlogs);

describe('GET /blog', () => {
  it('should get all blogs', (done) => {
    request(app)
    .get('/blog')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.blogs.length).toBe(1);
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
    .set('x-auth', users[0].tokens[0].token)
    .send(blog)
    .expect(200)
    .expect((res) => {
      expect(res.body.author).toEqual(users[0]._id.toHexString());
    })
    .end(done);
  });
});

describe('GET /blog/:id', () => {
  it('should get the blog object from the database', (done) => {
    var id = blogs[0]._id.toHexString()

    request(app)
    .get(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(id);
      expect(res.body.author).toEqual(users[0]._id.toHexString());
    })
    .end(done)
  })

  it('should not get blog from other user', (done) => {
    var id = blogs[1]._id.toHexString()

    request(app)
    .get(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should respond with 404 not found', (done) => {
    var id = '6a6220f0642cf6699cb4e1fc'

    request(app)
    .get(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('should respond with 404 not found', (done) => {
    var id = '6a6220f0642cf66'

    request(app)
    .get(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('should respond with 401 not authorized', (done) => {
    var id = blogs[0]._id.toHexString()

    request(app)
    .get(`/blog/${id}`)
    .expect(401)
    .end(done);
  });
});

describe('DELETE /blog/:id', () => {
  it('should delete a blog from the database', (done) => {

    var id = blogs[0]._id.toHexString()

    request(app)
    .delete(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(id);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Blog.find().then((blogs) => {
        expect(blogs.length).toBe(1);
        done()
      }).catch((e) => done(e))
    });
  });

  it('should not delete a blog from other user', (done) => {

    var id = blogs[1]._id.toHexString()

    request(app)
    .delete(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })

  it('should respond with 404 status', (done) => {
    var id = '123'

    request(app)
    .delete(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should respond with 404 status', (done) => {
    var id = '5a6134fd82b2996163926aa5'

    request(app)
    .delete(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /blog/:id', () => {
  it('should update blog title, body, image', (done) => {

    var id = blogs[0]._id.toHexString()

    request(app)
    .patch(`/blog/${id}`)
    .send({
      title: "UPDATED",
      image: "UPDATED",
      body: "UPDATED"
    })
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.title).toBe("UPDATED");
      expect(res.body.image).toBe("UPDATED");
      expect(res.body.body).toBe("UPDATED");
    })
    .end(done)
  })

  it('should not update blog of other user', (done) => {

    var id = blogs[1]._id.toHexString()

    request(app)
    .patch(`/blog/${id}`)
    .send({
      title: "UPDATED",
      image: "UPDATED",
      body: "UPDATED"
    })
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should respond with 404 status', (done) => {

    var id = "5a63555466783573eeed79b1"

    request(app)
    .patch(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should respond with 404 status', (done) => {

    var id = "5a63555466783573eeed79b1111"

    request(app)
    .patch(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should respond with 404 status', (done) => {

    var id = "5a635554"

    request(app)
    .patch(`/blog/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
});

describe('POST /users', () => {
  it('should create a user and add a token to the tokens array', (done) => {

    request(app)
      .post('/users')
      .send({
        email: "daisy@gmail.com",
        password: 'password'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }else {
          User.findOne({email: "daisy@gmail.com"}).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe('password');
            expect(user.tokens[0].token).toBeTruthy();
            done()
          }).catch((e) => done(e));
        }
      })
  })

  it('should respond with status 400 if password not provided', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'daisy@gmail.com'
      })
      .expect(400)
      .end(done);
  })

  it('should respond with status 400 if email not provided', (done) => {
    request(app)
      .post('/users')
      .send({
        password: 'password'
      })
      .expect(400)
      .end(done);
  })
})

describe('GET /users/me', () => {
  it('should fecth user if logged in', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(users[0]._id.toHexString());
        expect(res.body.email).toEqual(users[0].email);
      })
      .end(done)
  })

  it('should respond with 401 if invalid token', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', '123')
      .expect(401)
      .end(done);
  })

  it('should respond with 401 if no token', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  })
})

describe('POST /users/me/login', () => {
  it('should login a user and create token', (done) => {

    request(app)
      .post('/users/me/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(users[0]._id.toHexString());
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }else {
          User.findById(res.body._id).then((user) => {
            expect(user.tokens[1].token).toBeTruthy();
            done()
          }).catch((e) => done(e));
        }
      });
  })

  it('should respond with 400 if no password', (done) => {
    request(app)
      .post('/users/me/login')
      .send({
        email: users[0].email
      })
      .expect(400)
      .end(done);
  })

  it('should respond with 400 if no email', (done) => {
    request(app)
      .post('/users/me/login')
      .send({
        password: 'password'
      })
      .expect(400)
      .end(done);
  })

  it('should respond with 400 if invalid password', (done) => {
    request(app)
      .post('/users/me/login')
      .send({
        email: users[0].email,
        password: 'wrongpassword'
      })
      .expect(400)
      .end(done);
  })
})

describe('DELETE /users/me', () => {
  it('should logout a user and remove token', (done) => {
    request(app)
      .delete('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }else{
          User.findById(users[0]._id).then((user) => {
            expect(user.tokens[0]).toBeFalsy();
            done()
          }).catch((e) => done(e));
        }
      });
  })

  it('should respond 401 if not logged in', (done) => {
    request(app)
      .delete('/users/me')
      .expect(401)
      .end(done)
  })
})
