const app = require('./app') // la aplicación Express real
const config = require('./utils/config')
const {infoMessage, errorMessage} = require('./controllers/logger')

app.listen(config.PORT, () => {
  infoMessage(`Server running on port ${config.PORT}`)
})