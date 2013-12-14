var async = require('async');
var backlogApi = require('backlog-api');

module.exports = function(msg) {
  var projectKey = msg.match[1];
  var username = msg.match[2];

  var backlog = backlogApi();
  var project = null;
  var user = null;
  var issues = null;
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
    if (username.length === 0) return next();
    backlog.getUser({
      id: username
    }, function(err, u) {
      if (err) return next(err);
      user = u;
      next();
    });
  });
  tasks.push(function(next) {
    var params = {};
    params.projectId = project.id;
    params.statusId = [1, 2, 3];
    if (user) params.assignerId = user.id;
    backlog.findIssue(params, function(err, i) {
      if (err) return next(err);
      issues = i;
      return next();
    });
  });
  tasks.push(function(next) {
    var messages = [];
    messages.push('count=' + issues.length);
    messages = messages.concat(issues.map(function(i) {
      var items = ['[' + i.key + ']'];
      if (!user) items.push(i.assigner.name);
      items.push(i.status.name);
      items.push(i.summary);
      items.push(i.url);
      return items.join('\t');
    }));
    var message = messages.join('\n');
    return next(null, message);
  });
  async.waterfall(tasks, function(err, message) {
    if (err) return msg.send(err);
    msg.send(message);
  });
};

