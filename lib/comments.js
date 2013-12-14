var async = require('async');
var backlogApi = require('backlog-api');

module.exports = function(msg) {
  var issueKey = msg.match[1];

  var backlog = backlogApi();
  var issue = null;
  var items = null;
  var tasks = [];
  tasks.push(function(next) {
    backlog.getIssue({ issueKey: issueKey }, function(err, i) {
      if (err) return next(err);
      issue = i;
      return next();
    });
  });
  tasks.push(function(next) {
    backlog.getComments({ issueId: issue.id }, function(err, i) {
      if (err) return next(err);
      items = i;
      return next();
    });
  });
  tasks.push(function(next) {
    var messages = [];
    messages.push('count=' + items.length);
    messages = messages.concat(items.map(function(i) {
      return i.created_user.name + '\t' + i.content;
    }));
    var message = messages.join('\n');
    next(null, message);
  });
  async.waterfall(tasks, function(err, message) {
    if (err) return msg.send(err);
    msg.send(message);
  });
};

