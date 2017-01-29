# jestas

[![npm version](https://badge.fury.io/js/jestas.svg)](http://badge.fury.io/js/jestas) [![Build Status](https://travis-ci.org/mieky/jestas.svg?branch=master)](https://travis-ci.org/mieky/jestas)

Show Jenkins build statuses from the command line.

- Requires **Node 4.0** or newer, with npm 3.
- Supports Jenkins 1.4 & 2.0.

Installation:
`npm install -g jestas`

![jestas usage example](https://github.com/mieky/jestas/raw/master/screenshot.gif)


## Usage

Run `jestas`, either with a configuration file (see [Configuration](#configuration)) or by passing the options manually.

See `jestas --help` for options.

**Examples:**

- Run with a jestas.json present in one of the parent directories:

    `jestas`

- Specify a configuration file:

    `jestas --config myConfig.json`

- Pass Jenkins server URL manually (if everyone has read access):

    `jestas --server https://jenkins.qa.ubuntu.com`

- Pass server URL, username and API token (for authenticated use):

    `jestas --server http://my.jenkins.url --user clarence-oveur --token foo123xyz`

- Allow Jenkins server with a self-signed certificate:

    `jestas --server https://my.jenkins.url --trust`


### Output

By default, the status of all build jobs is listed.

Giving a *job name* as a parameter will display the latest (possibly partial) build log:

```
$ jestas nodejs-v0.10-windows
busy  nodejs-v0.10-windows

Started by timer
[EnvInject] - Loading node environment variables.
Building remotely on centos-5.7 (linux) in workspace /var/lib/jenkins/workspace/nodejs-v0.10-windows
 > git rev-parse --is-inside-work-tree # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/joyent/node.git # timeout=10
Fetching upstream changes from https://github.com/joyent/node.git
 > git --version # timeout=10
 > git fetch --tags --progress https://github.com/joyent/node.git +refs/heads/*:refs/remotes/origin/*
 > git rev-parse refs/remotes/origin/v0.10^{commit} # timeout=10
 > git rev-parse refs/remotes/origin/origin/v0.10^{commit} # timeout=10
Checking out Revision a7fee30da123953e68bafc835fe6ce1818a5dc44 (refs/remotes/origin/v0.10)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f a7fee30da123953e68bafc835fe6ce1818a5dc44
 > git rev-list a7fee30da123953e68bafc835fe6ce1818a5dc44 # timeout=10
Cleaning workspace
 > git rev-parse --verify HEAD # timeout=10
Resetting working tree
 > git reset --hard # timeout=10
 > git clean -fdx # timeout=10
Triggering nodejs-v0.10-windows » x64,windows
Triggering nodejs-v0.10-windows » ia32,windows
Configuration nodejs-v0.10-windows » x64,windows is still in the queue: All nodes of label ‘windows’ are offline
```

**Fuzzy filtering**

You can provide fuzzy search terms to filter the results, for example `jestas node win` would list builds whose name include the words "node" and "win", in that order. It might match *nodejs-v0.10-windows* and *nodejs-v0.12-windows*, but not *nodejs-v0.10-osx*.


## Configuration

A configuration file `jestas.json` will be picked up at any of the parents of the current directory (or itself). There is a sample [jestas.json.example](https://github.com/mieky/jestas/blob/master/jestas.json.example) provided for convenience.

**Tip:** You can set any of the parameters as command-line arguments, including the config file location.

A simple, **unauthenticated** (where everyone has read access on the Jenkins host) configuration looks like this:

```
{
    "server": "https://jenkins.qa.ubuntu.com"
}
```

Where `server` specifies the root URL of the Jenkins installation you want to query.

For **authenticated** requests, you must supply the `user` and `token` parameters:

- `user` is your Jenkins username,
- `token` is your personal API token. Get it by visiting `http://<server_url>/me/configure` on your Jenkins host

```
{
    "server": "http://my-private-jenkins-instance.org",
    "user": "clarence-oveur",
    "token": "c83d6c69f05ffab983ab0dc2d26656ed"
}
```

### Self-signed certificates

Jenkins installations running over HTTPS with self-signed certificates are distrusted by default. To allow communicating with these hosts, you can add the `trust` option.

```
{
    "trust": true
}
```

## Changelog

- **1.3.0** Add `trust` option for allowing self-signed certificates
- **1.2.0** Add support for Node 4 (still requires npm3, though)
- **1.1.0** Add support for command-line arguments.
- **1.0.0** Add support for authenticated requests, require Node 6.0.
  - **Breaking changes:** updated configuration syntax to have *server*, *user* and *token*
- **0.2.0** Fetch most recent build log when search yields exactly one match.
- **0.1.1** Fix installation to work without a global Babel (duh!)
- **0.1.0** Support for the rest of Jenkins build statuses.
- **0.0.1** First release with only pass/fail statuses.

## Acknowledgements

[![chilicorn](chilicorn.png)](http://futurice.com/blog/sponsoring-free-time-open-source-activities)

## License

[MIT](https://github.com/mieky/jestas/blob/master/LICENSE)
