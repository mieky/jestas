# jestas

[![Build Status](https://travis-ci.org/mieky/jestas.svg?branch=master)](https://travis-ci.org/mieky/jestas)

Show Jenkins build statuses from the command line.

![jestas usage example](https://github.com/mieky/jestas/raw/master/screenshot.gif)

Installation:
`npm install -g jestas`

Requires node 0.10+.

## Usage

Put a configuration file in place, and run `jestas`.

You can provide fuzzy search terms to filter the results, for example:

`jestas node win`

This only would list builds whose name include the words "node" and "win", in that order. It might match *nodejs-v0.10-windows* and *nodejs-v0.12-windows*, but not *nodejs-v0.10-osx*.

If the search yields precisely one match, then the latest (possibly partial) build log will be displayed:

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

## Configuration

A configuration file `jestas.json` will be picked up at any of the parents of the current directory (or itself). It should look like this:

```
{
    "node": "http://jenkins.nodejs.org/"
}
```

Where `http://jenkins.nodejs.org/` is the root URL of the Jenkins installation you want to query. Currently, it only supports one entry, and the prefix — here "node" — is completely arbitrary.

## Acknowledgements

This project is a grateful recipient of the [Futurice Open Source sponsorship program](http://futurice.com/blog/sponsoring-free-time-open-source-activities).

## License

[MIT](https://github.com/mieky/jestas/blob/master/LICENSE)
