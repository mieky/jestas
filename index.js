var findConfig = require("find-config");
var fetch = require("node-fetch");
var util = require("util");
var clc = require("cli-color");
var pad = require("pad");
var _ = require("lodash");

var configFile = findConfig("jenkinson.json");

if (!configFile) {
    console.log("Configuration file jenkinson.json not found.");
    process.exit(1); // eslint-disable-line
}

var config = require(configFile);
console.log("Using configuration", config);

function colorToStatus(color) {
    if (color === "blue") {
        return clc.green("ok");
    }
    return clc.red("fail");
}

function filterByName(jobs) {
    // return jobs.filter(j => { true });
    return jobs;
}

function mapColorsToStatuses(jobs) {
    return jobs.map(job => {
        return {
            "status": colorToStatus(job.color),
            "name": job.name
        };
    });
}

function prettyPrint(job) {
    var jobStatus = util.format("%s %s", pad(job.status, 5, { colors: true }), job.name);
    console.log(jobStatus);
}

var prefix = _.first(_.keys(config));
var url = config[prefix] + "/api/json?pretty=true";
fetch(url)
    .then(r => r.json())
    .then(json => { return json.jobs; })
    .then(filterByName)
    .then(mapColorsToStatuses)
    .then(jobs => {
        jobs.forEach(prettyPrint);
    });
