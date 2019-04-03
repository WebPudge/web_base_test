var url = require('url');

var generate = require('../lib/session')

var getURL =function(_url, key, value){
  var obj = url.parse(_url, true);
  obj.query[key] = value;
  return url.format(obj)
}

var handler = function(req, res) {
  console.log(req.session)
  if(!req.session.isVisit){
    req.session.isVisit = true ;
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('sessionURL欢迎第一次来到动物园');
  }else{
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('sessionURL动物园再次欢迎你');
  }
}
module.exports = function (req, res) {
  var redirect = function(url){
    res.setHeader('Location', url);
    res.writeHead(302);
    res.end();
  }
  req.query = url.parse(req.url, true).query;
  var id = req.query[global.key];
  if(!id){
    var session = generate();
    redirect(getURL(req.url, global.key, session.id));
  } else {
    var session = global.sessions[id];
    if(session){
      if(session.cookie.expire > (new Date()).getTime()) {
        session.cookie.expire = (new Date()).getTime() + global.EXPIRES;
        req.session = session;
        handler(req, res);
      } else {
        delete global.sessions[id];
        req.session = generate();
        redirect(getURL(req.url, global.key, session.id));
      }
    }else{
      var session = generate();
      redirect(getURL(req.url, global.key, session.id));
    }
  }
}