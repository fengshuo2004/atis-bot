require('dotenv').config();
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();

// command functions definitions
function help(ctx) {
    ctx.reply("\n:bulb: **Help** for using this ATIS bot\n" +
        "Type `?atis <ICAO code>` to listen to the ATIS frequency at your specified airport\n" +
        "Type `?metar <ICAO code>` to receive METAR weather report of that airport\n" +
        "Type `?stop` to stop the current ATIS frequency stream")
}
function atis() { } // TODO
function metar() { } // TODO

// Maps all command word to functions
var commands = {
    "help": help,
    "atis": atis,
    "metar": metar
}

function main(message) { // onMessage event handler
    if (message.content.indexOf(process.env.PREFIX) !== 0) { // delete any non-command msgs
        if (!message.author.bot) { // ignore any bot msgs
            message.delete()
        }
        return;
    }
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g); // parse arguments into a list
    const command = args.shift().toLowerCase(); // parse out the command words
    try {
        (commands[command])(message, args);
    } catch (error) {
        if (error instanceof TypeError) { // command not found
            message.reply("\n:no_entry_sign: There is no such command as `" + command +
                "`!\nInternal Error: **" + error.toString() + "**");
        }
    }
}

client.on('ready', () => {
    console.log(`\u2713   Logged in as ${client.user.tag}!`);
    client.user.setActivity("type ?help for help"); // playing ...
    const channel = client.channels.get("636912507369422848"); // ATIS voice channel
    channel.join()
        .then(() => { console.log("\u2713   Voice channel successfully connected!") })
        .catch(e => { console.error("\u2717   Failed to join voice channel: " + e) });
});

client.on('message', main);

client.login();