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
//   hubot backlog components <projectKey> - list backlog components.
//   hubot backlog versions <projectKey> - list backlog versions.
//   hubot backlog users <projectKey> - list backlog users.
//   hubot backlog issues <projectKey> [<username>] - list backlog issues.
//   hubot backlog issuetypes <projectKey> - list backlog issuetypes.
//   hubot backlog comments <issueKey> - list backlog comments.
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

  robot.respond(/backlog\s+components\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.components(msg);
  });

  robot.respond(/backlog\s+versions\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.versions(msg);
  });

  robot.respond(/backlog\s+users\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.users(msg);
  });

  robot.respond(/backlog\s+issues\s+(\S+)\s*(\S*)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.issues(msg);
  });

  robot.respond(/backlog\s+issuetypes\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.issuetypes(msg);
  });

  robot.respond(/backlog\s+comments\s+(\S+)\s*$/i, function(msg) {
    msg.send(msg.match[0] + '...');
    backlog.comments(msg);
  });
};

