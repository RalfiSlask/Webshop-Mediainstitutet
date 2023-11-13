module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
    ],
    "parserOptions": {
        "ecmaVersion": "latest", 
        "sourceType": "module", 
        "project": "./tsconfig.json" 
    },
    "overrides": [
        {
            "files": [".eslintrc.{js,cjs}", "tailwind.config.js", "postcss.config.js"],
            "parser": "espree",
            "parserOptions": {
                "project": null,
                "sourceType": "module", 
                "ecmaVersion": 2021 
            },
            "rules": {
               
            }
        }
    ],
    "rules": {
        "semi": "off",
        "@typescript-eslint/semi": "off",
        "no-multiple-empty-lines": ["warn", { "max": 0 }]
    }
};
