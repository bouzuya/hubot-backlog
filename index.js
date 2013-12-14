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
//   hubot backlog versions <projectKey> - list backlog versions.
//
// Author:
//   bouzuya

var methods = require('./lib/');

module.exports = function(robot) {
  var backlog = methods();

  robot.respond(/backlog\s+projects\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.projects(msg);
  });

  robot.respond(/backlog\s+issues\s+(\S+)\s*(\S*)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.issues(msg);
  });

  robot.respond(/backlog\s+users\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.users(msg);
  });

  robot.respond(/backlog\s+components\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.components(msg);
  });

  robot.respond(/backlog\s+versions\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.versions(msg);
  });
};

