module.exports = {
    "extends": "standard",
    "plugins": [
        "standard"
    ],
    "env": {
        "browser": 1,
        "node": 1
    },
    "rules": {
    	"indent": [2, "tab"],
		"no-tabs": 0,
     	"semi": [1, "always"],
     	"space-before-function-paren": ["error", "never"],
     	"one-var": [0, "error"]
    }
};
