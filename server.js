var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://research.upb.edu')
var username = process.argv[2].toString()
var beep = require('beepbeep')
const replaceString = require('replace-string');

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

client.on('connect', function () {
  client.subscribe('chat', function (err) {
    if (!err) {
      client.publish('chat', username + ' has joined the chat')
    }
  })
})

client.on('message', function (topic, message) {
  var br_1 = message.indexOf('[')+1;
  var br_2 = message.indexOf(']');
  var user = message.slice(br_1, br_2);

  if (user == username){
    message = '> ' + message;
  }
  else {
    replaceString(message.toString(), '>', '<');
    message = '< ' + message;
  }

  var at_pos = message.indexOf("@");
  var sp_pos = message.indexOf(" ",at_pos+1);
  var pr_msg_1 = message.slice(0, at_pos-1);
  var pr_msg_2 = message.slice(sp_pos, message.length);
  var cl_un = message.slice(at_pos+1, sp_pos);
  var pr_msg = pr_msg_1 + pr_msg_2;

  if (at_pos < 0) {
    /*var br_1 = message.indexOf('[')+1;
    var br_2 = message.indexOf(']');
    var user = message.slice(br_1, br_2);

    if (user == username){
      message = '> ' + message;
    }
    else {
      replaceString(message.toString(), '>', '<');
      message = '< ' + message;
    }*/
    console.log(message.toString())
    beep()
  }
  else {
    if (cl_un == username){
      console.log('\x1b[36m%s\x1b[0m', pr_msg.toString());
      beep()
    }
  }
})

rl.on('line', function(line){
    //console.log(line);
    //client.publish('chat', '[' + username + '] ' + line)
    if (line == 'quit'){
      client.publish('chat', username + ' has left the chat')
      client.end()
      setTimeout(function(){process.exit()},100)
    }
    else {
    client.publish('chat', '[' + username + '] ' + line)
    }
})

process.on('SIGINT', function(){
   client.publish('chat', username + ' has left the chat')
   setTimeout(function(){process.exit()},100)
})
