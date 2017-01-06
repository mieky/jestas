const nodeFetch = require("node-fetch");
const fuzzy = require("fuzzy");
const util = require("util");
const clc = require("cli-color");
const pad = require("pad");
const config = require("./config");

const filterStr = config.opts._.join("");
const fetch = require("./auth-wrapper").wrapFetch(nodeFetch, config.opts);

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
    }
    return clc.red("fail");
}

const filterByName = function filterArrByStr(str, arr) {
    // Fuzzy-filter to get the list of matching names
    let includedNames = fuzzy.filter(str, arr.map(i => i.name))
        .map(e => e.string);

    // If given name is an exact match, treat it as an
    // only result (otherwise you wouldn't be able to select
    // "node-v1-win" if there was also "node-julien-v1-win")
    if (includedNames.indexOf(str) >= 0) {
        includedNames = [str];
    }

    // Return matching objects from original list
    return arr.filter(i => includedNames.indexOf(i.name) >= 0);
}.bind(null, filterStr);

function mapColorsToStatuses(jobs) {
    return jobs.map(job => ({
        status: colorToStatus(job.color),
        name: job.name
    }));
}

function prettyPrint(job) {
    const jobStatus = util.format("%s %s",
        pad(job.status, 5, { colors: true }),
        job.name);
    console.log(jobStatus);
}

function printLog(job, options) {
    const url = `${config.opts.server}/job/${job.name}/lastBuild/logText/progressiveText?start=0`;
    return fetch(url, options)
        .then(r => r.text())
        .then(text => console.log(`\n${text}`))
        .catch(err => {
            console.log(`Couldn't fetch log for job from ${url}: ${err.message}`);
            process.exit(1);
        });
}

const url = `${config.opts.server}/api/json?pretty=true`;
fetch(url, config.opts)
    .then(res => {
        if (res.status === 403) {
            throw new Error(`Authentication error: did you specify 'user' and 'token' in jestas.json?`);
        }
        return res.json();
    })
    .then(json => json.jobs)
    .then(filterByName)
    .then(mapColorsToStatuses)
    .then(jobs => {
        jobs.forEach(prettyPrint);
        if (jobs.length === 1) {
            return printLog(jobs[0], config.opts);
        }
        return null;
    })
    .catch(err => {
        console.log(`Couldn't fetch build list from ${url}: ${err.message}`);
        process.exit(1);
    });
