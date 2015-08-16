# jestas

Show Jenkins build statuses from the command line.

![Screenshot](https://github.com/mieky/jestas/raw/master/screenshot.gif)

Installation:
`npm install -g jestas`

Requires node 0.10+.

## Usage

Put a configuration file in place, and run:

`jestas [fuzzy search terms]`

You can provide an optional fuzzy search term to filter the results.

## Configuration

A configuration file `jestas.json` will be picked up at any of the parents of the current directory (or itself). It should look like this:

```
{
    "node": "http://jenkins.nodejs.org/"
}
```

Where `http://jenkins.nodejs.org/` is the root URL of the Jenkins installation you want to query. Currently, it only supports one entry.

## Acknowledgements

This project is a grateful recipient of the [Futurice Open Source sponsorship program](http://futurice.com/blog/sponsoring-free-time-open-source-activities).

## License

[MIT](https://github.com/mieky/jestas/blob/master/LICENSE)
