var findConfig = require("find-config");
var fetch = require("node-fetch");
var fuzzy = require("fuzzy");
var util = require("util");
var clc = require("cli-color");
var pad = require("pad");
var _ = require("lodash");

var configFile = findConfig("jestas.json");
if (!configFile) {
    console.log(`Configuration file not found. Create a 'jestas.json' that looks like this:
{
    \"node\": \"http://jenkins.nodejs.org/\"
}
`);
    process.exit(1);
}

var config = require(configFile);
var filterStr = process.argv.splice(2).join("");

function colorToStatus(color) {
    // blue -> "ok"
    // aborted* -> "fail"
    // *anime -> "busy"
    // notbuilt -> "new"
    // disabled -> "off"
    // others -> "fail"
    if (color === "blue") {
        return clc.green("ok");
    } else if (color.substring(0, 7) === "aborted") {
        return clc.red("fail");
    } else if (color.substring(color.length - 6) === "_anime") {
        return clc.white("busy");
    } else if (color === "notbuilt") {
        return clc.black("new");
    } else if (color === "disabled") {
        return clc.black("off");
    } else {
        return clc.red("fail");
    }
}

var filterByName = function(str, arr) {
    var includedNames = fuzzy.filter(str, arr.map(i => i.name))
        .map(e => e.string);
    return arr.filter(i => includedNames.indexOf(i.name) >= 0);
}.bind(null, filterStr);

function mapColorsToStatuses(jobs) {
    return jobs.map(job => ({
        "status": colorToStatus(job.color),
        "name": job.name
    }));
}

function prettyPrint(job) {
    var jobStatus = util.format("%s %s",
        pad(job.status, 5, { colors: true }),
        job.name);
    console.log(jobStatus);
}

var prefix = _.first(_.keys(config));
var url = config[prefix] + "/api/json?pretty=true";
fetch(url)
    .then(r => r.json())
    .then(json => json.jobs)
    .then(filterByName)
    .then(mapColorsToStatuses)
    .then(jobs => {
        jobs.forEach(prettyPrint);
    })
    .catch(err => {
        console.log(`Couldn't fetch build list from ${url}: ${err.message}`);
        process.exit(1);
    });
