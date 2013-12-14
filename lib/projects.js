var backlogApi = require('backlog-api');

module.exports = function(msg) {
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

