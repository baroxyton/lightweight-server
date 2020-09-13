module.exports = function(req,res,next){
  let body = ""
  req.on("data", function(data){
    body += data
    console.log(data)
  })
  req.on("end", function(){
    req.body = {}
    params = new URLSearchParams(new URL("https://google.com/search?"+body).search);
    for(param of params){
      req.body[param[0]] = param[1]
    }
    next()
  })
}
