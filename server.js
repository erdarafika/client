const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(9187, () => {
  console.log('App listening on port 9187')
})