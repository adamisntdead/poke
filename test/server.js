const express = require('express')
const cors = require('cors')
const path = require('path')

const port = process.env.PORT || 8080

function newServer (callback) {
  const app = express()

  app.use(cors)
  app.use(express.static(path.join(__dirname, 'public')))

  return app.listen(port, () => {
    callback(port, app)
  })
}

module.exports = newServer
