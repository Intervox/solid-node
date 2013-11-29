var assert = require('assert');
var Amon = require('../lib/amon').Amon;


exports.testAmonPort = function(test){
  test.equal(Amon.port, 2464);
  test.done();
};

exports.testAmonHost = function(test){
  test.equal(Amon.host, '127.0.0.1');
  test.done();
};

exports.testExceptionHandler = function(test){
  var exception_label = "Exception here";
  try {
    throw new Error(exception_label);
  }
  catch(error) {
    var json = Amon.exception_data(error);

    test.equal(json.message, exception_label);
    test.equal(json.exception_class, "Error: " + exception_label);
    test.done();
  }
};

exports.testExceptionHandlerWithoutLabel = function(test){
  try {
    throw new Error;
  }
  catch(error) {
    var json = Amon.exception_data(error);

    test.equal(json.message, "");
    test.equal(json.exception_class, "Error");
    test.done();
  }
};
