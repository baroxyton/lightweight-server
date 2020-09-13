toMime = require("./formats.js")
function addReq(req,res){
  req.query = {}
  let params = new URLSearchParams(new URL(req.url,"https://google.com").search);
  for(key of params){
    req.query[key[0]] = key[1]
  }
}
function addRes(res,req){
  res.sendFile = function(file){
fs.readFile(file,function(err,content){
if(err){
  throw new Error(err)
}
res.set("content-type",toMime(file))
res.send(content)
})
  } 
  res.oldEnd = res.end
  res.send = res.end = function(...args){
    res.oldEnd(...args)
    req.done = true
  }
  res.redirect = function(url){
    res.writeHead(302, {'Location': url});
    req.done = true
res.end();
  }
  res.set = function(...args){
    res.setHeader(...args)
  }
}
module.exports = {
  addRes:addRes,
  addReq:addReq
}
