const _ = require('lodash');
const config = require('./config/config');

module.exports = {
  isValidDomain: (req, res, next) => {
    console.log(123);
    if (_.indexOf(config.DOMAINS_WHITE_LIST, req.headers.origin || req.headers.host) > -1) {
      return next();
    }
    return res.send(404, {
      error: 'err-invalid-origin-domain',
      origin: req.headers.origin || req.headers.host
    });
  }
};