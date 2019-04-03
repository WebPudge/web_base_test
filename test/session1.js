module.exports = function(req, res) {
  console.log(req.session)
  if(!req.session.isVisit){
    req.session.isVisit = true ;
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('session欢迎第一次来到动物园');
  }else{
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('session动物园再次欢迎你');
  }
}