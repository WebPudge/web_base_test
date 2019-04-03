var handle = (req, res) => {
  res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
  res.end('认证成功！');
}

var checkUser = (user, pass) => {
  if(user&&pass){
    if(user === 'admin'&& pass === 'admin@123'){
      return true
    }else{
      return false
    }
  }else{
    return false
  }
}

module.exports = function (req, res) {
  var auth = req.headers['authorization'] || '';
  var parts = auth.split(' ');
  var method = parts[0] || '';
  var encoded = parts[1] || '';
  var decoded = Buffer.from(encoded,'base64').toString('utf-8').split(':');
  var user = decoded[0];
  var pass = decoded[1];
  if(!checkUser(user,pass)){
    res.setHeader('WWW-Authenticate','Basic realm="Secure Area"');
    res.writeHead(401);
    res.end();
  } else {
    handle(req, res);
  }
}