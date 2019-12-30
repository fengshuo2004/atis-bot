# ATIS Bot for Discord

> This documentation is imcomplete and still a work-in-progress

![screenshot](/img/example.png)

A Discord bot that fetches aviation

- ATIS (https://www.liveatc.net/)
- METAR (https://www.checkwx.com/)
- NOTAM (https://notams.aim.faa.gov/)*

Information from various sources and allow them to be queried by users.

*= Not yet implemented

**Made by Davie Feng in 2019-2020**

## Legals

All rights reserved to the respective sources of information, of whom made these data public but not all gave us explicit permission to use them.

## Installation

### Dependencies

Git clone this repo into a folder, or download a [zipped version](https://github.com/fengshuo2004/atis-bot/archive/master.zip) and extract it.

```
mkdir atis-bot
cd atis-bot
git clone https://github.com/fengshuo2004/atis-bot.git
```

Download and install NodeJS from [this](https://nodejs.org/en/download/) page if you don't already have it.

Dependencies are all included in the *package.json* file.
They can be automatically installed with NPM in the command line like this:

Linux terminal:

```bash
cd /path/to/project/
sudo npm install
```

Windows cmd:

```batch
cd \path\to\project\
npm install
```

### Configuration

#### Server-side

If there's a bot in your Discord Server that uses the prefix `?`, you can edit the *.env* file under this directory to configure ATIS Bot to use another prefix.

For example if you want this bot to use exclaimation mark, then edit the file to say:

```
PREFIX=!
```

#### Client-side

1. In your discord server, create a role named <span style="color:#3498DB;background:#303339">ATIS</span>.

2. Create a new Text Channel named *atis* and a new Voice Channel *ATIS Frequency*