module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": false,
        "es6": true,
        "node": true
    },
    "rules": {
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "never"],
        "indent": ["error", 4],
        "no-console": 0,
        "no-process-exit": 0,
        "quotes": ["error", "double", { "allowTemplateLiterals": true }]
    }
};
