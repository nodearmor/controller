// Register path aliases
require('module-alias/register')

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const http = require('http')
const externalApi = require('./external-api')
const daemonApi = require('./daemon-api')
const config = require('config')
const helmet = require('helmet')
const db = require('@db')

// Connect to database
db.connect(config.get('mongodb'))

const app = express();
const server = http.createServer(app);
const expressWs = require('express-ws')(app, server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Secures some http headers

// Store sessions in mongo
app.use(session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: (process.env.NODE_ENV == "production" ? true : false)
  },
  store: db.sessionStore(session)
}));

// Init external API (web ui)
app.use('/api', externalApi)
// Init daemon API (websocket)
app.ws('/daemon', daemonApi)

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`API server running on port ${port}`)
})
