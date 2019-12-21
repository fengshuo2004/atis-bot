require('dotenv').config();
const PF = process.env.PREFIX;
const https = require('https');
const Discord = require('discord.js');
const airports = require('./airports.json');
const client = new Discord.Client();
var player, voice;

function sendEmbed(ctx, color, title, description) {
    ctx.channel.send(new Discord.RichEmbed()
        .setColor(["#FC440F", "#B4E33D", "#1F01B9"][color])
        .setAuthor("ATIS Bot", "https://i.imgur.com/uyHC7bZ.png")
        .setTitle(title)
        .setDescription(description)
        .setFooter("Requested by user " + ctx.member.user.tag)
        .setTimestamp());
}

function getMetar(icao) { // THIS IS ASYNC!
    return new Promise((resolve, reject) => {
        var options = {
            headers: { 'X-API-Key': process.env.APIKEY }
        };
        var resData = "";
        https.get(`https://api.checkwx.com/metar/${icao.toLowerCase()}/decoded`, options, res => {
            if (res.statusCode != 200) { reject(Error(`Server rejected our request with status code ${res.statusCode}.`)) };
            res.on("data", d => resData += d);
            res.on("end", function () {
                resolve(JSON.parse(resData));
            });
        }).on("error", e => reject(e));
    })
}

// command functions definitions
function help(ctx) {
    sendEmbed(ctx, 2, ":bulb: **Help** for using this ATIS bot:",
        `• Type \`${PF}atis <ICAO code>\` to listen to the ATIS live frequency at your specified airport\n` +
        `• Type \`${PF}metar <ICAO code>\` to receive the lastest METAR weather report of that airport\n` +
        `• Type \`${PF}atis stop\` to stop the current ATIS frequency stream`);
}

function atis(ctx, args) {
    airport = args[0] ? args[0].toLowerCase() : undefined; // first argument, the airport ICAO code
    which = args[1] ? args[1].toLowerCase() : undefined; // optional second argument, departure or arrival
    switch (airport) { // what is the first argument
        case "stop": // stop the ATIS stream
            sendEmbed(ctx, 1, ":mute: The ATIS audio stream has been stopped", `Type \`${PF}atis\` to start another one`);
            player.end();
            break;
        case undefined: // nothing entered
            sendEmbed(ctx, 2, ":mag: Please provide an airport ICAO code", "Currently, only the following airports are available:\n" +
                `\`${Object.keys(airports).join(" ")}\`\nType \`${PF}help\` for more information`);
            break;
        default: // normally
            if (res = airports[airport]) { // ICAO exists
                if (res.length == 3) { // if airport has TWO atis frequencies
                    switch (which) { // what's the second argument?
                        case "arr": // arrival
                            sendEmbed(ctx, 1, `:loud_sound: :airplane_arriving: Now streaming the arrival ATIS frequency of **${airport.toUpperCase()} - ${res[0]}**`,
                                "You may now connect to the voice channel to listen to it\n" +
                                `Type \`${PF}atis stop\` to stop the audio stream`);
                            player = voice.playArbitraryInput(res[1]);
                            break;
                        case "dep": // departure
                            sendEmbed(ctx, 1, `:loud_sound: :airplane_departure: Now streaming the departure ATIS frequency of **${airport.toUpperCase()} - ${res[0]}**`,
                                "You may now connect to the voice channel to listen to it\n" +
                                `Type \`${PF}atis stop\` to stop the audio stream`);
                            player = voice.playArbitraryInput(res[2]);
                            break;
                        default: // didn't specify or some other bullshit user typed in
                            sendEmbed(ctx, 2, ":twisted_rightwards_arrows: The airport you chose has **two** ATIS frequencies", "one for arrival and one for departure\n" +
                                `• To listen to the **arrival** frequency, type \`${PF}atis ${airport} arr\`\n` +
                                `• To listen to the **departure** frequency, type \`${PF}atis ${airport} dep\``);
                    }
                } else {
                    sendEmbed(ctx, 1, `:loud_sound: :airplane: Now streaming the ATIS frequency of **${airport.toUpperCase()} - ${res[0]}**`,
                        "You may now connect to the voice channel to listen to it\n" +
                        `Type \`${PF}atis stop\` to stop the audio stream`);
                    player = voice.playArbitraryInput(res[1]);
                }
            } else {
                sendEmbed(ctx, 0, `:no_entry_sign: \`${args[0]}\` is not a valid airport ICAO code or this airport is currently unavailable`, `A list of available airports can be retrieved by typing \`${PF}atis\``);
            }
    }
}

function metar(ctx, args) {
    getMetar(args[0]).then(
        function (metar) { // handle a successful request
            if (metar.results == 0) { // no result :-(
                sendEmbed(ctx, 0, ":no_entry_sign: No result", "Make sure you are entering a valid ICAO code of an existing airport.");
            } else {
                let i = metar.data[0]; // Many fields are optional, so we must expect its non-existence
                let content = "";
                try { content += `\`${i.flight_category}\` Premitted\n\n` } catch{ };
                try {
                    content += `:dash: **Wind**: ${i.wind.speed_kts} Knots @ ${i.wind.degrees} Degrees${(i.wind.gust_kts) ? `, Gust ${i.wind.gust_kts} Knots` : ""}\n`;
                } catch{ };
                try { content += `:thermometer: **Temperature**: ${i.temperature.celsius}\u2103 / ${i.temperature.fahrenheit}\u2109\n` } catch{ };
                try { content += `:droplet: **Dewpoint**: ${i.dewpoint.celsius}\u2103 / ${i.dewpoint.fahrenheit}\u2109\n` } catch{ };
                try { content += `:umbrella: **Humidity**: ${i.humidity.percent}%\n` } catch{ };
                try { content += `:chart_with_upwards_trend: **Barometer**: ${i.barometer.hg}Hg\n` } catch{ };
                try { content += `:cloud_rain: Currently **raining** ${i.rain.inches} Inches\n` } catch{ };
                try { content += `:snowflake: Currently **snowing** ${i.snow.inches} Inches\n` } catch{ };
                if (i.clouds && i.clouds.length > 0) { // is array and not empty
                    content += "\n:cloud: **Clouds**\n";
                    i.clouds.forEach(
                        function (element, index) {
                            content += `Layer ${index + 1} - ${element.text}${(element.base_feet_agl) ? ` @ ${element.base_feet_agl}ft` : ""}\n`
                        }
                    );
                }
                if (i.conditions && i.conditions.length > 0) { // is array and not empty
                    content += "\n:warning: **Conditions**\n";
                    i.conditions.forEach(
                        function (element) {
                            content += `${element.text}\n`
                        }
                    );
                }
                content += `\n:scroll: **Raw entry**: \`${i.raw_text}\`\n*These data were observed at ${i.observed}*`;
                sendEmbed(ctx, 1, `Latest METAR report of **${i.icao} - ${i.station.name}**`, content);
            }
        }
    )
        .catch(
            function (error) {
                console.error("\u2717   Promise rejected, request failed due to: " + error);
                sendEmbed(ctx, 0, ":dizzy_face: Unable to fetch data", "The HTTP request to CheckWX's API has failed, this problem is logged." +
                    `\n**Internal Error: ${error.toString()}**`);
            }
        );
}

// Maps all command word to functions
var commands = {
    "help": help,
    "atis": atis,
    "metar": metar
}

function main(message) { // onMessage event handler
    if (message.content.indexOf(PF) !== 0) { // delete any non-command msgs
        if (!message.author.bot) { // ignore any bot msgs
            message.delete();
        }
        return;
    }
    const args = message.content.slice(PF.length).trim().split(/ +/g); // parse arguments into a list
    const command = args.shift().toLowerCase(); // parse out the command words
    if (commands[command]) {
        try {
            (commands[command])(message, args); // execute command
        } catch (e) {
            sendEmbed(message, 0, ":dizzy_face: Something bad happened deep inside of me!",
                "This problem is automatically logged and will be dealt with by the developers shortly" +
                `\n**Internal Error: ${e.toString()}**`);
            console.log("\u2717   Exception occured while executing command: " + e);
        }
    } else {
        sendEmbed(message, 0, `:no_entry_sign: There is no such command as \`${command}\`!`,
            `Type \`${PF}help\` to get a list of available commands for this bot`);
    }
}

client.on('ready', () => {
    console.log(`\u2713   Application started and logged in as ${client.user.tag}!`);
    client.user.setActivity("Type " + PF + "help for help"); // playing ... tip
    client.channels.get(process.env.CHANNELID).join() // join the voice channel
        .then((connection) => {
            console.log("\u2713   Voice channel successfully connected!");
            voice = connection;
        })
        .catch(e => { console.error("\u2717   Failed to join voice channel: " + e) });
});

client.on('message', main);

client.login();