var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://research.upb.edu')
var username = process.argv[2].toString()

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
 
client.on('connect', function () {
  client.subscribe('chat', function (err) {
    if (!err) {
      client.publish('chat', username + ' has entered the chat')
    }
  })
})
 
client.on('message', function (topic, message) {
  var at_pos = message.indexOf("@");
  var sp_pos_1 = message.indexOf(" ")+1;
  var sp_pos_2 = message.indexOf(" ",sp_pos_1);
  var pr_msg_1 = message.slice(0, at_pos-1);
  var pr_msg_2 = message.slice(sp_pos_2, message.length);
  var cl_un = message.slice(at_pos+1, sp_pos_2);
  var pr_msg = pr_msg_1 + pr_msg_2;
  if (at_pos < 0) {
    console.log(message.toString())
  }
  else {
    if (cl_un == username){
      console.log(pr_msg.toString()); 
    }
  }
})

rl.on('line', function(line){
    //console.log(line);
    client.publish('chat', '[' + username + '] ' + line)
})

process.on('SIGINT', function(){
   client.publish('chat', username + ' has left the chat')
   setTimeout(function(){process.exit()},500)
})
