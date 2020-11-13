module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/bchnmonitor/'
    : '/',
  devServer: {
    proxy: {
      "/api/": {
        target: "https://bchnmonitor.azurewebsites.net/",
      }
    }
  }
};
