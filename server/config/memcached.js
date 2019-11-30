const Memcached = require('memcached');

const memcached = new Memcached('130.245.168.36:11211');

module.exports = memcached;