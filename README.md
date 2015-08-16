# jestas

Show Jenkins build statuses from the command line.

![Screenshot](https://github.com/mieky/jestas/raw/master/screenshot.png)

Requires node 0.10+.

Installation:
`npm install -g jestas`

## Usage:

`jestas [search]`

You can provide an optional fuzzy search term to filter the results.

Uses the NodeJS QA repository configured in `./jestas.json` by default.

## Configuration

Put configuration file `jestas.json` to either the current directory or one of its parents, where findConfig will pick it up. It should look like this:

```
{
    "node": "http://jenkins.nodejs.org/"
}
```

Where `http://jenkins.nodejs.org/` is the root URL of the Jenkins installation you want to query.
