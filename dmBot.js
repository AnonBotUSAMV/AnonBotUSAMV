const express = require("express");
const app = express();

app.get("/", (request, response) => {
  console.log("Ping received!");
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const Discord = require("discord.js");
const dmBot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');

const fileName = './confession_count.json';

dmBot.on("ready", async () => {

    console.log(config.READY_MESSAGE);
    dmBot.user.setActivity(config.ACTIVITY_STATUS, {
        type: "PLAYING"
    });

});

dmBot.on("message", (message) => {
  
    if (message.channel.type === "dm") { 
      
        var args = message.content.split(" ").slice(0)
        var args = args.slice(0).join(" ")
        var BOT_ID = dmBot.user.id
        var userID = message.author.id
        if (message.author.bot) return;
        if (message.content.startsWith(config.PREFIX)) return
        if (args.length > 2000) return message.reply("Your message content too many characters (2000 Limit) :/") 
         
          /////////////////////////
       let content = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        
        var current_confession_count = content.current_confession_count
        //console.log("[+] current_confession_count => " + current_confession_count)

        var new_confession_count = current_confession_count + 1
        console.log("[+] new_confession_count => " + new_confession_count)

        fs.writeFile(fileName, JSON.stringify({"current_confession_count": new_confession_count}), function writeJSON(err) {
          if (err) return console.log(err);
          console.log('writing to ' + fileName);
        });      
        /////////////////////////
          
          
          
        message.channel.send("This confession has been sent! :incoming_envelope:").then(message => message.delete(3000));
        var embed = new Discord.MessageEmbed()
            .setColor("#4bcdf7")
            .setAuthor("Confession #" + new_confession_count, "https://i.ibb.co/dD3F4j2/avatars-000414568512-35e3bu-t500x500.jpg")  
            .setDescription(args)
            .setFooter("DM me to send a 100% anonymous message.")
            .setTimestamp()
        dmBot.guilds.cache.get(config.SERVER_ID).channels.cache.get(config.CHANNEL_ID).send(embed).catch(console.log(`Message recieved from ${userID}!(${message.author.username})`))
        dmBot.guilds.cache.get(config.SERVERLOG_ID).channels.cache.get(config.LOG_ID).send("**This Message Was Sent By: " + message.author.username + "**" + "\n" + args)
    }
   
    
       }

);


dmBot.login(config.TOKEN);
