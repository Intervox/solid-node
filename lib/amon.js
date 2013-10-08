var http = require('http');

var Amon = {
  VERSION: '0.5.1',
  host: "127.0.0.1",
  port: 2464,
  secret_key: false,
  protocol: 'http',

  handle: function(error, next) {
    var error_data = JSON.stringify(Amon.exception_data(error));
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
    tags = tags || "notset";

    var log_data = JSON.stringify({
        "message": message,
        "tags": tags
    });

    Amon.post_http('log', log_data, next);
  },
  post_http: function(type, data, next) {
    var finished = false;

    var success = function(res) {
      if (finished || 'function' !== typeof next) return;
      finished = true;
      next(null, res.statusCode, res);
    };

    var error = function(err) {
      if (finished || 'function' !== typeof next) return;
      finished = true;
      next(err);
    };

    var path, headers = {
        'Content-Length' : Buffer.byteLength(data),
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    if(type == 'exception'){
      path = '/api/exception';
    }
    else {
      path = '/api/log';
    }

    if(Amon.secret_key){
      path = path+'/'+Amon.secret_key;
    }

    var options = {
      host: Amon.host,
      port: Amon.port,
      path: path,
      method: 'POST',
      headers: headers
    };

    var request = http.request(options, success);

    request.on('error', error);
    request.write(data);
    request.end();
  }
};

exports.Amon = Amon;
