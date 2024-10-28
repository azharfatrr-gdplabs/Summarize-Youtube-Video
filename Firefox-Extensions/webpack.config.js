// webpack.config.js

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = (env, argv) => {
  // Determine the current environment
  const currentPath = path.join(__dirname);
  const basePath = currentPath + '/.env';
  const envPath = basePath + '.' + argv.mode; // e.g., .env.development
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  // Load environment variables
  const fileEnv = dotenv.config({ path: finalPath }).parsed || {};

  // Convert environment variables to Webpack's DefinePlugin format
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return {
    mode: argv.mode || 'development',
    entry: './src/content.js',
    output: {
      filename: 'content.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        // Babel Loader
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        // Add other loaders (e.g., CSS) as needed
      ],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      // Add other plugins as needed
    ],
    resolve: {
      modules: ['node_modules'],
    },
    devtool: 'source-map', // Optional: Useful for debugging
  };
};
