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
//   hubot backlog projects - list backlog projects.
//   hubot backlog issues <projectKey> [<username>] - list backlog issues.
//   hubot backlog users <projectKey> - list backlog users.
//   hubot backlog components <projectKey> - list backlog components.
//
// Author:
//   bouzuya

var async = require('async');
var backlogApi = require('backlog-api');

var listProjects = function(msg) {
  var backlog = backlogApi();
  backlog.getProjects(function(err, projects) {
    if (err) return msg.send(err);
    var message =  'count=' + projects.length + '\n' +
    projects.map(function(i) {
      return '[' + i.key + ']\t' + i.name;
    }).join('\n');
    msg.send(message);
  });
};

var listIssues = function(msg) {
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

var listUsers = function(msg) {
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

var listComponents = function(msg) {
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


module.exports = function(robot) {

  robot.respond(/backlog projects\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    listProjects(msg);
  });

  robot.respond(/backlog issues (\S+)\s*(\S*)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    listIssues(msg);
  });

  robot.respond(/backlog users (\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    listUsers(msg);
  });

  robot.respond(/backlog components (\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    listComponents(msg);
  });

};
