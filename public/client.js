// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
$(document).ready(function(){
  
  
});


$("#url-form").on("submit", function(){
  var urlStr = $("#url").val();
  
  $.get("/"+urlStr, function(result){
    if(!result.error){
      $("#result").html("<strong>Original</strong>: <a href="+result.data.url+" target='_blank'>"+result.data.url+"</a><br />");
      $("#result").append("<strong>Shortened</strong>: <a href="+result.data.shortened+" target='_blank'>"+result.data.shortened+"</a>");
    }
    else{
      $("#result").html("ERROR: URL most likely invalid")
    }
  })
  return false;
})