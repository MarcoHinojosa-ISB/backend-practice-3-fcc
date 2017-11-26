// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient();
var dbConnect = "mongodb://islaybears:4wZs*FCm@ds040877.mlab.com:40877/url_shortener"
var validURL = require('valid-url');
var short = require('shortid');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:url(*)", function(req, res){
  var url = req.params.url;
  
  // must be 'http(s)://www.website.com' format
  if(validURL.isUri(url)){
    mongo.connect(dbConnect, function(err, db){
      if(err){
        console.log("Something went wrong")
        res.send({
          error: "Connection Error", 
          data: null
        })
      }
      else{
        var urls = db.collection('urls');
        var newUrl = short.generate();
        
        urls.insert([{url: url, shortened: newUrl}], function(){
          db.close();
          
          var data = {
            error: null,
            data: {
              url: url,
              shortened: 'https://'+ req.headers["host"] +'/'+ newUrl
            }
          }
          res.send(data);
        })
      }
    });
    console.log("good url")
  }
  //if not a valid url, could be a shortened url
  else{
    mongo.connect(dbConnect, function(err, db){
      if(err)
        res.send({error: "Connection error"});
      else{
        var urls = db.collection("urls");

        urls.find({shortened: req.params.url}).toArray(function(err, data){
          //if shortened url is not found in database, conclude invalid url
          if(err || data.length <= 0){
            db.close();
            res.send({error: "invalid url"})
          }
          //redirect to original url otherwise
          else{
            db.close();
            res.redirect(data[0].url);  
          }
        })
      }
    })
  }
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
