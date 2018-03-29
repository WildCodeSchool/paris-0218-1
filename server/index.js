const express = require('express')
const score_1 = require('../mocks/scoring_1.json')
const score_2 = require('../mocks/scoring_2.json')
const app = express()
const scores = [score_1, score_2]

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/scores', (request, response) => {
  //setHeader = ('Content-Type', 'text/plain')
  response.send(scores)
})
app.listen(3000)
