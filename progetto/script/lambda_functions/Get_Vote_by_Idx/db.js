const mongoose = require('mongoose');
require('dotenv').config({ path: './variables.env' });

mongoose.Promise = global.Promise;
let isConnected;

const connectToDB = () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return Promise.resolve();
  }

  console.log('=> Creating new database connection');
  return mongoose.connect(process.env.DB, {
    dbName: 'unibg_tedx_2023',
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((db) => {
    isConnected = db.connections[0].readyState;
  });
};

module.exports = connectToDB;
