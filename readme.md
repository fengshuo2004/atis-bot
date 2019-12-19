# ATIS Bot for Discord

A Discord bot that fetches aviation

- ATIS (https://www.liveatc.net/)
- METAR (https://www.checkwx.com/)
- TAF (https://www.checkwx.com/)
- NOTAM (https://notams.aim.faa.gov/)

Information from various sources and allow them to be queried by users.

**Made by Davie Feng in 2019**

## Legals

All rights reserved to the respective sources of information, of whom not all gave us explicit permission to use them.

## Installation

### Dependencies

Dependencies are all included in the *package.json* file.
They can be automatically installed with NPM in the command line like this:

```bash
cd \path\to\project\
sudo npm install
```

```batch
cd \path\to\project\
npm install
```

### Configuration

#### Server-side

If there's a bot in your Discord Server that uses the prefix `?`, you can edit the *.env* file under this directory to configure ATIS Bot to use another prefix.

```
PREFIX=!
```

