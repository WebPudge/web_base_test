global.sessions = {};
var sessions = global.sessions;
global.EXPIRES = 20*60*1000;

module.exports = function () {
  var session = {};
  session.id = (new Date()).getTime() + Math.random();
  session.cookie = {
    expire: (new Date().getTime()) + global.EXPIRES
  }
  sessions[session.id] = session;
  return session;
}