toMime = require("./formats.js")
fs = require("fs")
additional = require("./additionalFunctions.js")
function generateRegex(url){
  url = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  url = url.replace(`*`,`(.*?)`);
  url = `^${url}$`
  return new RegExp(url)
}
server = require("http").createServer(function(req,res){
  route(req,res)
})
let listeners = []
function route(req,res){
  additional.addRes(res,req)
  additional.addReq(req,res)
  let index = -1;
  function next(){
    index++;
    if(listeners[index]&&!req.done){
      processRoute()
    }
  }
  function processRoute(){
    let listener = listeners[index]
    if(!processURL(req.url).pathname.match(listener.regex)&&(req.method==listener.method||listener.method=="ALL")){
      return
    }
    listener.route(req,res,next)
  }
  next()
}
function processURL(url){
  return new URL(url,"https://google.com")
}
let functions = {
  get:function(url,handler){
    listeners.push({
      method:"GET",
      regex:generateRegex(url),
      route:function(req,res,next){
        handler(req,res)
        next()
      }
    })
  },
  post:function(url,handler){
    listeners.push({
      method:"POST",
      regex:generateRegex(url),
      route:function(req,res,next){
        handler(req,res)
        next()
      }
    })
  },
  all:function(url,handler){
    listeners.push({
      method:"ALL",
      regex:generateRegex(url),
      route:function(req,res,next){
        handler(req,res)
        next()
      }
    })
  },
  delete:function(url,handler){
    listeners.push({
      method:"DELETE",
      regex:generateRegex(url),
      route:function(req,res,next){
        handler(req,res)
        next()
      }
    })
  },
  put:function(url,handler){
    listeners.push({
      method:"PUT",
      regex:generateRegex(url),
      route:function(req,res,next){
        handler(req,res)
        next()
      }
    })
  },
  listen:function(...args){server.listen(...args)},
  use:function(url,handler){
    let regex = /(.*)/g;
    if(url&&handler){
      regex = generateRegex(url)
    }
    else{
      handler=url
    }
    let obj = {
      method:"ALL",
      regex:regex,
      route:handler
    }
    listeners.push(obj)
  }
}
functions.use(require("./urlencoded.js"))
module.exports = function(){
  return functions
}
module.exports.static = function(dir){
  if(!fs.existsSync(dir)){
    throw new Error("File does not exist!");
    return
  }
  let isDir = fs.lstatSync(dir).isDirectory()
return function(req,res,next){
if(!isDir){
  let mime = toMime(dir)
  fs.readFile(dir, function(err,data){
if(err){
  throw new Error(err)
}
let content = data;
res.set("Content-Type",mime);
res.send(content)
next()
  })
  return
}

}
}
