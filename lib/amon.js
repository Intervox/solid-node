var request = require('request');
var path = require('path');
var url = require('url');

var Amon = exports.Amon = {
  VERSION: '0.5.2',
  host: "127.0.0.1",
  port: 2464,
  secret_key: false,
  protocol: 'http',

  handle: function(error, next) {
    var error_data = Amon.exception_data(error);
    Amon.post_http('exception', error_data, next);
  },
  exception_data: function(error) {
    return {
      "additional_data": {
        "application_directory": process.cwd(),
        "node": process.version,
        "env": {
          "args": process.argv,
          "execPath": process.execPath,
          "cwd": process.cwd(),
          "env": process.env,
          "installPrefix": process.installPrefix,
          "pid": process.pid,
          "platform": process.platform,
          "memory": process.memoryUsage()
        }
      },
      "backtrace": error.stack.split("\n"),
      "message": error.message,
      "exception_class": error.stack.split("\n")[0]
    };
  },
  log: function(message, tags, next){
    Amon.post_http('log', {
      "message": message,
      "tags": tags || 'notset'
    }, next);
  },
  post_http: function(type, json, next) {
    request.post({
      url: url.format({
        protocol: Amon.protocol,
        hostname: Amon.host,
        port: Amon.port,
        pathname: path.join('api', type, Amon.secret_key || ''),
      }),
      json: json
    }, function (err, res) {
      if (err) {
        next(err);
      } else {
        next(null, res.statusCode, res)
      }
    });
  }
};
