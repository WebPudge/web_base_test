var querystring = require('querystring');
var xml2js = require('xml2js');
var formidable = require('formidable');

var hasBody = function(req, res){
  return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
}

var mime = function(req){
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
}

var handle = function(req, res) {
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.end('解析成功！');
}

var parseForm = (req, done) => {
   console.log('parse form before:',req.rawBody)
   req.body = querystring.parse(req.rawBody);
   console.log('parse form after:',req.body)
   done();
}

var parseJSON = (req, done) => {
  try{
    console.log('parse JSON before:',req.rawBody)
    req.body = JSON.parse(req.rawBody);
    console.log('parse JSON after:',req.body)
    done();
  } catch (e){
    throw `Invalid JSON ${e}`
  }
}

var parseXML = (req, res, done) => {
    console.log('parse XML before:',req.rawBody)
    xml2js.parseString(req.rawBody, function(err,xml){
      if(err){
        res.writeHead(400);
        res.end(`Invalid XML ${err}`);
        return;
      }
      req.body = xml;
       console.log('parse JSON after:',req.body)
      done();
    });
}

var parseMultipart = (req,res, done) => {
    console.log('parse FILE before');
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
      if(err){
        res.writeHead(400);
        res.end(`Invalid FILE ${err}`);
        return;
      }
      req.body = fields;
      req.files = files;
      console.log('parse FILE body after:',req.body);
      console.log('parse FILE files after:',req.files);
      done();
    })
}

var parseData = function (req, res) {
  var done = function(){
    handle(req, res);
  }
  try {
    if(mime(req) === 'application/x-www-form-urlencoded'){
      parseForm(req,done)
    } else  if(mime(req) === 'application/json'){
      parseJSON(req, done)
    } else  if(mime(req) === 'application/xml'){
      parseXML(req, res, done)
    } 
  } catch (error) {
    res.writeHead(400);
    res.end(error);
    return;
  }
}

module.exports = function (req, res) {
  var done = function(){
    handle(req, res);
  }
  if(hasBody(req)){
    if(mime(req) === 'multipart/form-data'){
      parseMultipart(req, res, done)
    }else{
      var buffers= [];
      req.on('data', function(chunk){
        buffers.push(chunk)
      });
      req.on('end', function(){
        req.rawBody = Buffer.concat(buffers).toString();
        parseData(req,res);
      })
    }
  }else{
    handle(req,res);
  }
}