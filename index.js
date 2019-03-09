const config = require('./config/config');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const render = require('restify-render-middleware');
const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const async = require('async');
const bunyan = require('bunyan');
const db = require('./integrations/mongodb');
const cors = corsMiddleware({
  origins: ['*']
});
db.connect();

const server = restify.createServer({ log: bunyan.createLogger({ name: 'nl-restify-api' }) });
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser({
  mapParams: false
}));
// server.use(restify.plugins.multipartBodyParser());
// server.use(restify.plugins.requestExpiry());
// server.use(restify.plugins.throttle({
//   burst: 100,
//   rate: 50,
//   ip: true,
//   overrides: {
//     '192.168.1.1': {
//       rate: 0,
//       burst: 0
//     }
//   }
// }));
server.use(restify.plugins.conditionalRequest());

server.pre(cors.preflight);
server.use(cors.actual);

server.use(render({
  engine: 'pug',
  dir: __dirname
}));

//CUSTOM LOG
server.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

server.get('/', (req, res, next) => {
  res.redirect(301, '/docs', next);
});

glob('./modules/**/*.routes.js', {}, (err, files) => {
  async.each(files, (file, cb) => {
    require(path.resolve(file))(server);
    cb(null);
  }, err => {
    let routes = [];
    _.mapValues(server.router._registry._routes, (value, key) => {
      routes.push({
        path: value.path,
        method: value.method
      });
    });

    server.get('/docs', (req, res, next) => {
      res.render('./public/docs/docs.pug', {
        app: {
          title: 'Probando render de restify',
          description: 'Endpoints:'
        },
        endpoints: routes
      });
    });

    server.get('/statics', restify.plugins.serveStatic({
      directory: './public',
      default: 'index.html'
    }));

    server.listen(config.PORT, () => {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
});