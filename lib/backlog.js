// Description:
//   Interact with your Backlog
//
// Dependencies:
//   None
//
// Configuration:
//   BACKLOG_SPACE_ID
//   BACKLOG_USERNAME
//   BACKLOG_PASSWORD
//
// Commands:
//   hubot backlog projects - list projects.
//   hubot backlog issues <projectId> [<username>] - list issues.
//
// Author:
//   bouzuya

var async = require('async');
var backlogApi = require('backlog-api');

var spaceId = process.env.BACKLOG_SPACE_ID;
var username = process.env.BACKLOG_USERNAME;
var password = process.env.BACKLOG_PASSWORD;

var listProjects = function(msg) {
  var backlog = backlogApi(spaceId, username, password);
  backlog.getProjects(function(err, projects) {
    if (err) return msg.send(err);
    var message = projects.map(function(i) {
      return i.id + ' [' + i.key + '] "' + i.name + '"';
    }).join('\n');
    msg.send(message);
  });
};

var listIssues = function(msg) {
  var projectId = parseInt(msg.match[1]);
  var targetUsername = msg.match[2];
  var backlog = backlogApi(spaceId, username, password);
  var user = null;
  var tasks = [];
  tasks.push(function(next) {
    if (targetUsername.length === 0) {
      next();
    } else {
      backlog.getUsers({
        projectId: projectId
      }, function(err, users) {
        if (err) return next(err);
        user = users.filter(function(i) {
          return i.name === targetUsername;
        })[0];
        next();
      });
    }
  });
  tasks.push(function(next) {
    var params = {
      projectId: projectId,
      statusId: [1, 2, 3]
    };
    if (user) {
      params.assignerId = user.id;
    }
    backlog.findIssue(params, function(err, issues) {
      if (err) return next(err);
      return next(null, issues);
    });
  });
  async.waterfall(tasks, function(err, issues) {
    if (err) return msg.send(err);
    var message = issues.map(function(i) {
      var items = user ? [] : [i.assigner.name];
      return items.concat([
        i.key,
        i.status.name,
        i.summary,
        i.url
        ]).join('\t');
    }).join('\n') + '\ncount=' + issues.length;
    msg.send(message);
  });
};

module.exports = function(robot) {

  robot.respond(/backlog projects/, function(msg) {
    listProjects(msg);
  });

  robot.respond(/backlog issues (\S+) (\S*)/, function(msg) {
    listIssues(msg);
  });

};

// listProjects({ match: ['backlog projects'], send: function(msg) { console.log(msg); } });
// listIssues({ match: ['backlog issues 1073783536 bouzuya', '1073783536', 'bouzuya'], send: function(msg) { console.log(msg); } });
// listIssues({ match: ['backlog issues 1073783536', '1073783536', ''], send: function(msg) { console.log(msg); } });

