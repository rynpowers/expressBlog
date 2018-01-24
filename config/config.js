const config = require('./config.json')

var env = process.env.NODE_ENV || 'development';

Object.keys(config[env]).forEach((key) => {
  process.env[key] = config[env][key]
})
