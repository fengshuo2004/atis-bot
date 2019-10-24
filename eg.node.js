const request = require('request');
const fs = require("fs");
request('https://s1-sjc.liveatc.net/kjfk_atis').pipe(fs.createWriteStream('atis.mp3'));
