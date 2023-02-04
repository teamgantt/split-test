const path = require('path');

module.exports = {
  entry: './src/index.cjs',
  output: {
    filename: 'index.js',
    library: 'tgSplitTest',
    path: path.resolve(__dirname, 'public')
  }
};
