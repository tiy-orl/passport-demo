const { Client } = require('pg');
const client = new Client({
  username: 'bgates',
  host: 'localhost',
  database: 'stackleDb',
  password: '',
  port: 5432
});
client.connect();

module.exports = client;
