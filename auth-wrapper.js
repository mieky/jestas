const url = require("url");
const fetch = require("node-fetch");

// Authentication will be used if username and token are specified
// in the configuration file.
//
// Upon first call, this wrapper will fetch a crumb used by Jenkins
// to protect against Cross-Site Request Forgery. The crumb, together
// with username and API token, will be used for next requests.

function getCrumbAsync(config) {
    // 'http://suer:token@serverUrl/crumbIssuer/api/json'
    const urlObj = url.parse(`${config.server}/crumbIssuer/api/json`);
    urlObj.auth = `${config.user}:${config.token}`;
    const crumbUrl = url.format(urlObj);

    // Crumb object should contain fields such as:
    // {
    //     crumb: '30976241b3b761626599629f6a3b9a38',
    //     crumbRequestField: 'Jenkins-Crumb'
    // }
    return fetch(crumbUrl)
        .then(res => res.json())
        .catch(err => {
            console.log(`Error while fetching crumb: ${err.message}`);
            throw err;
        });
}

function wrapFetch(originalFetch, config) {
    // If configured for anonymous authentication, no need to wrap requests
    if (config.user === undefined) {
        return fetch;
    }

    // Fetch crumb once
    const crumbPromise = getCrumbAsync(config);

    // Return an alternative 'fetch' function which will augment all incoming requests
    // with credentials (also changing the request method to POST)
    return function wrappedFetch(requestUrl, options) {
        return crumbPromise.then(crumb => {
            // curl -X POST -H "Jenkins-Crumb:8eab98739f0e1d623999b659d94010a9" 'http://cakelover:c83d6c69f05ffab983ab0dc2d26656ed@localhost:8080/api/json?pretty=true'

            const urlObj = url.parse(requestUrl);
            urlObj.auth = `${config.user}:${config.token}`;
            const newRequestUrl = url.format(urlObj);

            // Changes required to the original request:
            // - Include username and token in the request URL
            // - Set API method to POST and include crumb in headers
            const newOptions = Object.assign({}, options, {
                method: "POST",
                headers: {
                     // e.g. "Jenkins-Crumb:30976241b3b761626599629f6a3b9a38"
                    [crumb.crumbRequestField]: crumb.crumb
                }
            });

            // Fetch the altered request using the original fetcher
            return originalFetch(newRequestUrl, newOptions);
        });
    };
}

module.exports = {
    wrapFetch
};
