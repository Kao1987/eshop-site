module.exports = {
    root: true,
    env: {
    node: true,
    es6: true
    },
    parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // 這行很重要，告訴 eslint 不需要 babel config 文件
    ecmaVersion: 2018
    },
    extends: [
    'eslint:recommended'
    ],
    rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}