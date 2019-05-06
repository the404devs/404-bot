var Discord = require('discord.js');
var logger = require('winston');
// var auth = require('./auth.json');
var fs = require('fs');
var ytdl = require('ytdl-core');
// require('dotenv').config();
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();
var notBusy = true;
const streamOptions = { seek: 0, volume: 1 };

bot.on('message', message =>{
    console.log("message sent: "+message.content);
if (notBusy && message.content.startsWith('!play')){
        if (message.channel == message.guild.channels.find(ch => ch.name === 'jukebox')) {
            async function play(message){
                var link = message.content.substring(6);
                // if(!message.member.voiceChannel)
                //     return message.channel.send("***You must be in a voice channel for me to start playing music!***");
                if(message.guild.me.voiceChannel)
                    return message.channel.send("***Something is already playing! Wait your turn!***");

                if(!link)
                    return message.channel.send("***If you send me a youtube link, I'll play it in*** __#earrape__");

                let validate = await ytdl.validateURL(link);
                if(!validate)
                    return message.channel.send("***Hold on a sec. That URL ain't right. Try again.***");

                let info = await ytdl.getInfo(link);
                // let voiceChannel = await message.member.voiceChannel;
                let voiceChannel = message.guild.channels.find(ch => ch.name === 'earrape');
                voiceChannel.join().then(async connection => {
                    message.channel.send(`🎵 Now Playing: *${info.title}* 🎵`);
                    message.delete();
                    const stream = await ytdl(link, { filter : 'audioonly' }).on("end", end => {
                        setTimeout(function(){
                            message.channel.send(`Finished Playing: *${info.title}*`);
                            message.delete();
                            voiceChannel.leave();
                        }, 10000);
                        
                    })
                    .on("error", error => {
                        console.error(error);
                        voiceChannel.leave();
                        message.channel.send("***I couldn't play that. Sorry...***");
                        message.delete();
                    });
                    const dispatcher = connection.playStream(stream, streamOptions);
                })
                .catch(console.error);
            }
            play(message);
        }
        else{
            message.channel.send(`${message.member} **Please use the #jukebox channel to request songs.**`);
            message.delete();
        }

        
    }
});
// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'fuck-land');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`You're a fucking weeb, ${member}`);
});

// bot.login(process.env.BOT_TOKEN);
bot.login("NTczNzE5NTgwNzgzMDE4MDEz.XM9q7w.-kv7n3b2mBD_HAIIAmqAEehnvnQ");

