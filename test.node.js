require('dotenv').config();
const https = require('https');

function metar(icao) {
    return new Promise((resolve,reject) => {
        var options = {
            headers: { 'X-API-Key': process.env.APIKEY }
        };
        var resData = "";
        https.get(`https://api.checkwx.com/metar/${icao.toLowerCase()}/decoded`, options, res => {
            if (res.statusCode != 200) { reject(Error(`Server rejected our request with status code ${res.statusCode}.`)) };
            res.on("data", d => resData += d);
            res.on("end", function(){
                resolve(JSON.parse(resData));
            });
        }).on("error", e => reject(e));
    })
}

function parseMetar(metar){
    if (metar.results == 0) { // no result
        return "No result";
    }
    return `:dash: **Wind**: ${metar.data[0].wind.speed_kts} Knots @ ${metar.data[0].wind.degrees} Degrees
:thermometer: **Temperature**: ${metar.data[0].temperature.celsius}\u2103 / ${metar.data[0].temperature.fahrenheit}\u2109
:droplet: **Dewpoint**: ${metar.data[0].dewpoint.celsius}\u2103 / ${metar.data[0].dewpoint.fahrenheit}\u2109
:cloud_rain: **Humidity**: ${metar.data[0].humidity.percent}%
:chart_with_upwards_trend: **Barometer**: ${metar.data[0].barometer.hg}Hg
:eye: **Visibility**: ${metar.data[0].visibility.miles} Miles
`
}

metar("egbb").then((r) => console.log(parseMetar(r))).catch(console.error);

