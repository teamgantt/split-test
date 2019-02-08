const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    library: 'tgSplitTest',
    path: path.resolve(__dirname, 'public')
  }
};
