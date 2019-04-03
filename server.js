var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var generate  = require('./lib/session')
var serialize = require('./lib/cookie');

var queryTest  = require('./test/query')
var cookieTest = require('./test/cookie')
var session1Test = require('./test/session1')
var session2Test = require('./test/session2')
var basicTest = require('./test/basic')
var uploadTest = require('./test/upload')

var ROOT = path.join(__dirname,'public/');

global.key = 'session_id';

var controller = [{
  router: '/query',
  handler: queryTest
},{
  router: '/cookie',
  handler: cookieTest
},{
  router: '/session1',
  handler: session1Test
},{
  router: '/session2',
  handler: session2Test
},{
  router: '/auth',
  handler: basicTest
},{
  router: '/upload',
  handler: uploadTest
}]
var controllerCache = {};
controller.forEach(control => {
  controllerCache[control.router] = control.handler;
})

var parseCookie = function (cookie) {
  var cookies = {};
  if(!cookie){
    return cookies
  }
  var list = cookie.split(';');
  for(var i = 0; i < list.length; i++){
    var pair = list[i].split('=');
    cookies[pair[0].trim()] = pair[1];
  }
  return cookies
}

var sessionValidate = function (req, res , handler) {
  var id = req.cookies[global.key];
  if(!id){
    req.session = generate();
  } else {
    var session = global.sessions[id];
    if(session){
      if(session.cookie.expire > (new Date()).getTime()) {
        session.cookie.expire = (new Date()).getTime() + global.EXPIRES;
        req.session = session
      } else {
        delete global.sessions[id];
        req.session = generate();
      }
    }else{
      req.session = generate();
    }
  }
  handler(req, res);
}

var wrapWriteHead = function (req, res) {
  var writeHead = res.writeHead;
  res.writeHead = function(){
    var cookies = res.getHeader('Set-Cookie');
    var session = serialize(global.key,req.session.id);
    cookies = Array.isArray(cookies)? cookies.concat(session):[cookies, session];
    res.setHeader('Set-Cookie',cookies);
    writeHead.apply(this, arguments)
  }
}

http.createServer(function(req, res){
  var pathname = url.parse(req.url).pathname;
  req.cookies = parseCookie(req.headers.cookie);

  var handler = controllerCache[pathname];
  if(controllerCache[pathname]){
    wrapWriteHead(req,res)
    sessionValidate(req,res,handler);
  }else{
    const filename = pathname.split('/')[1]||'index.html';
    fs.readFile(path.join(ROOT,filename), {encoding:'utf8'}, function(err,file){
      if(err){
        res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
        res.end('找不到相关文件。--！');
        return
      }
      res.writeHead(200);
      res.end(file);
    })
  }
}).listen(1337,'127.0.0.1');
console.log('Server running at http://127.0.0.1:1337')