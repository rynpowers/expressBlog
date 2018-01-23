const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  var userObject = this.toObject();

  return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function () {
  var access = 'auth'
  var token = jwt.sign({_id: this._id.toHexString(), access}, '123abc');
  this.tokens.push({access, token})

  return this.save().then(() => {
    return token
  });
}

userSchema.methods.removeToken = function (token) {
  return this.update({
    $pull: {
      tokens: {token}
    }
  });
}

userSchema.statics.findByToken = function (token) {
  var decoded;

  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

userSchema.statics.findByCredentials = function (email, password) {
  return new Promise((resolve, reject) => {
    return this.findOne({email}).then((user) => {
      if (!user) {
        return reject();
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return resolve(user);
        }
        return reject();
      });
    });
  });
}

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next()
      });
    });
  } else {
    next()
  }
});

var User = mongoose.model('User', userSchema)

module.exports = {User}
