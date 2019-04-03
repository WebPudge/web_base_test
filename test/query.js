var url = require('url');
// var querystring = reuqire('querystring');
// var query = querystring.parse(url.parse(req.url).query);
function handle(req, res){
  var query = JSON.stringify(req.query)
  if(query !== '{}'){
    console.log(req.query)
    res.writeHead(200);
    res.end(query)
  }else{
    res.writeHead(400,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('无query参数 --！')
  }

}

module.exports = function(req,res){
  req.query = url.parse(req.url, true).query;
  handle(req,res)
}