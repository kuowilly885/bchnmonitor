const axios = require('axios')

module.exports =  (context, req) => {
  axios.get('http://bchnmonitor.azurewebsites.net/api/AccessToken').then( res => {
    res.data
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res.data
    }
  })
}
