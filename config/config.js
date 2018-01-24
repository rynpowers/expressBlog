const config = require('./config.json')

var env = process.env.NODE_ENV || 'development';

Object.keys(config[env]).forEach((key) => {
  process.env[key] = config[env][key]
})

var configs = {
  Environment: env,
  Database: process.env.MONGODB_URI,
  Port: process.env.PORT,
  Jwt: process.env.JWT_SECRET
}

console.log(configs)
