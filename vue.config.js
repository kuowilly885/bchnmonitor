module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://bchnmonitor.azurewebsites.net/",
      }
    }
  },
  chainWebpack: config => {
     config
     .plugin('html')
     .tap(args => {
       args[0].title = 'BCH Hard Fork Monitor'
       return args
     })
   }
}
