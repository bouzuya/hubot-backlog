var async = require('async');
var backlogApi = require('backlog-api');

module.exports = function(msg) {
  var projectKey = msg.match[1];

  var backlog = backlogApi();
  var project = null;
  var users = null;
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
    backlog.getUsers({ projectId: project.id }, function(err, u) {
      if (err) return next(err);
      users = u;
      return next(null);
    });
  });
  tasks.push(function(next) {
    var messages = [];
    messages.push('count=' + users.length);
    messages = messages.concat(users.map(function(i) {
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

