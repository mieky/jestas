# jestas

[![npm version](https://badge.fury.io/js/jestas.svg)](http://badge.fury.io/js/jestas) [![Build Status](https://travis-ci.org/mieky/jestas.svg?branch=master)](https://travis-ci.org/mieky/jestas)

Show Jenkins build statuses from the command line.

- Requires Node v6.0 or newer.
- Supports Jenkins 1.4 & 2.0.

![jestas usage example](https://github.com/mieky/jestas/raw/master/screenshot.gif)

Installation:
`npm install -g jestas`

## Usage

Create a configuration file (instructions below) and run `jestas`.

- By default, the status of all build jobs is listed.
- Giving a *job name* as a parameter will display the latest (possibly partial) build log:

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

A configuration file `jestas.json` will be picked up at any of the parents of the current directory (or itself).

A simple, **unauthenticated** (where everyone has read access on the Jenkins host) configuration looks like this:

```
{
    "url": "https://jenkins.qa.ubuntu.com"
}
```

Where `url` specifies the root URL of the Jenkins installation you want to query.

For **authenticated** requests, you must supply the `user` and `token` parameters:

- `user` is your Jenkins username,
- `token` is your personal API token. Get it by visiting `http://<server_url>/me/configure` on your Jenkins host

```
{
    "url": "http://my-private-jenkins-instance.org",
    "user": "clarence-oveur",
    "token": "c83d6c69f05ffab983ab0dc2d26656ed"
}
```

## Changelog

- **1.0.0** Add support for authenticated requests, require Node 6.0.
  - **Breaking changes:** updated configuration syntax to have *server*, *user* and *token*
- **0.2.0** Fetch most recent build log when search yields exactly one match.
- **0.1.1** Fix installation to work without a global Babel (duh!)
- **0.1.0** Support for the rest of Jenkins build statuses.
- **0.0.1** First release with only pass/fail statuses.

## Acknowledgements

This project is a grateful recipient of the [Futurice Open Source sponsorship program](http://futurice.com/blog/sponsoring-free-time-open-source-activities).

## License

[MIT](https://github.com/mieky/jestas/blob/master/LICENSE)
