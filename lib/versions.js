var async = require('async');
var backlogApi = require('backlog-api');

module.exports = function(msg) {
  var projectKey = msg.match[1];

  var backlog = backlogApi();
  var project = null;
  var items = null;
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
    backlog.getVersions({ projectId: project.id }, function(err, i) {
      if (err) return next(err);
      items = i;
      return next();
    });
  });
  tasks.push(function(next) {
    var messages = [];
    messages.push('count=' + items.length);
    messages = messages.concat(items.map(function(i) {
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

