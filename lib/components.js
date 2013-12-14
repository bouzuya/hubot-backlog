var async = require('async');
var backlogApi = require('backlog-api');

module.exports = function(msg) {
  var projectKey = msg.match[1];

  var backlog = backlogApi();
  var project = null;
  var components = null;
  var tasks = [];
  tasks.push(function(next) {
    backlog.getProject({
      projectKey: projectKey
    }, function(err, p) {
      if (err) return next(err);
      project = p;
      next();
    });
  });
  tasks.push(function(next) {
    backlog.getComponents({ projectId: project.id }, function(err, c) {
      if (err) return next(err);
      components = c;
      return next(null);
    });
  });
  tasks.push(function(next) {
    var messages = [];
    messages.push('count=' + components.length);
    messages = messages.concat(components.map(function(i) {
      return i.name;
    }));
    var message = messages.join('\n');
    next(null, message);
  });
  async.waterfall(tasks, function(err, message) {
    if (err) return msg.send(err);
    msg.send(message);
  });
};

