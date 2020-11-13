module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "https://bchnmonitor.azurewebsites.net/",
      }
    }
  }
};
