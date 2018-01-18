var mongoose = require('mongoose');

var Blog = mongoose.model('Blog', {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 1
    },
    image: {
      type: String,
      default: null
    },
    body: {
      type: String,
      trim: true,
      required: true,
      minlength: 1
    },
    created: {
      type: Date,
      default: Date.now()
    }
});

module.exports = {
  Blog
}
