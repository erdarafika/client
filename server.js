const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(9187, () => {
  console.log('App listening on port 9187')
})