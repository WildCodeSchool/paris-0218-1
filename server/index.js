const express = require('express')
const score_1 = require('../mocks/scoring_1.json')
const score_2 = require('../mocks/scoring_2.json')
const app = express()

app.get('/', (request, response) => {
  //setHeader = ('Content-Type', 'text/plain')
  response.send = ([score_1, score_2])
})
app.listen(3000)
