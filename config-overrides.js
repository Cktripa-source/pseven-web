// config-overrides.js

const { override, addBabelPlugins } = require('customize-cra');

module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }]
    ]
  };
  
