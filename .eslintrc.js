module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/prettier"
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': [2, {"vars": "all", "args": "none"}]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
