var serialize = require('../lib/cookie');

module.exports = function(req,res){
  if(!req.cookies.isVisit){
    res.setHeader('Set-Cookie', [serialize('isVisit', '1'),serialize('s', '2')]);
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('欢迎第一次来到动物园');
  }else{
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('动物园再次欢迎你');
  }
}