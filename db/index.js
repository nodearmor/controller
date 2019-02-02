const mongoose = require('mongoose')
const loadModels = require('./models')

const options = {
  useCreateIndex: true,
  useNewUrlParser: true
}

function connect(db) {
  const connectEx = () => {
    mongoose.connect(db, options, (err) => {
      if (err) {
        console.log(`===>  Error connecting to ${db}`);
        console.log(`Reason: ${err}`);
      } else {
        console.log(`===>  Succeeded in connecting to ${db}`);
      }
    });
  }

  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connectEx);

  connectEx(db);
  loadModels();
}

const sessionStore = (session) => {
  const MongoStore = require('connect-mongo')(session);
  return new MongoStore({ mongooseConnection: mongoose.connection })
}

module.exports = {
  connect,
  sessionStore
}