const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        fs: false, // Since 'fs' is not needed in the browser environment
        crypto: require.resolve('crypto-browserify'), // Adding the fallback for crypto
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify')
      }
    }
  }
});

