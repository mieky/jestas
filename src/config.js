/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const findConfig = require("find-config");
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const https = require("https");

// Configuration can be specified by either:
// - with option --config myCustomConfig.json
// - with separate options --server myServerURL --user <user> --token <token>
// - or by automatically locating a jestas.json file from one of the parent dirs

function getOptions() {
    return yargs
        .usage("Usage: jestas [options]")
        .example("jestas")
        .example("jestas --config /path/to/myConfig.json")
        .example("jestas --server http://my.jenkins.url")
        .option("config", {
            describe: "Configuration file location (.json)",
            type: "string"
        })
        .option("server", {
            describe: "Jenkins server URL",
            type: "string"
        })
        .option("user", {
            describe: "Username for authentication (optional)",
            type: "string"
        })
        .option("token", {
            describe: "API token for authentication (optional)",
            type: "string"
        })
        .option("trust", {
            describe: "Allow self-signed certificates",
            type: "boolean"
        })
        .help("h")
        .alias("s", "server")
        .alias("u", "user")
        .alias("t", "token")
        .alias("T", "trust")
        .alias("c", "config")
        .alias("h", "help")
        .alias("v", "version")
        .version(require("../package.json").version)
        .argv;
}

function checkConfigExists(location) {
    let stats;
    try {
        stats = fs.statSync(location);
    } catch (e) {
        return false;
    }
    return stats && stats.isFile();
}

function normalizeConfigPath(location) {
    if (!location) {
        return null;
    }
    return path.resolve(process.cwd(), location);
}

// Require either configuration file or command-line parameters
let opts = Object.assign({}, getOptions());
const configLocation = normalizeConfigPath(opts.config) || findConfig("jestas.json");

if (!opts.server && !configLocation) {
    console.log("Configuration file 'jestas.json' not found.");
    console.log("Run 'jestas --help' for more options.");
    process.exit(1);
}

if (configLocation) {
    if (!checkConfigExists(configLocation)) {
        console.log(`Configuration file (${configLocation}) not found.`);
        process.exit(1);
    } else if (!configLocation.match(/\.json$/)) {
        console.log("Configuration file name must end with .json for now, sorry.");
        process.exit(1);
    }

    // Merge command-line and configuration file options
    opts = Object.assign(opts, require(configLocation));
    if (!opts.server) {
        console.log(`Configuration file at ${configLocation} is missing 'server' attribute.`);
        process.exit(1);
    }
}

// Self-signed certificates are rejected by default. Allow them if explicitly specified.
if (opts.trust) {
    opts.rejectUnauthorized = false;
    opts.agent = new https.Agent(opts);
}

module.exports = {
    opts
};
