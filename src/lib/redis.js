const redis = require('@dwing/redis');

const client = redis({
  host: '127.0.0.1',
  port: 6379,
  db: 0,
  ttl: 3600,
  prefix: 'daemon:'
});

module.exports = client;
