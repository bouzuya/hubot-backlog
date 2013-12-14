var fs = require('fs');
var path = require('path');

var toLowerCamelCase = function(s) {
  return s.replace(/_(.)/, function(m0, m1) {
    return m1.toUpperCase();
  });
};

module.exports = function() {
  return fs.readdirSync(__dirname).reduce(function(m, file) {
    m[toLowerCamelCase(path.basename(file, path.extname(file)))] = require('./' + file);
    return m;
  }, {});
};

