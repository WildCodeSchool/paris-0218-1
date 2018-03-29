const express = require('express')
const score_1 = require('../mocks/scoring_1.json')
const score_2 = require('../mocks/scoring_2.json')
const score_3 = require('../mocks/scoring_3.json')
const score_4 = require('../mocks/scoring_4.json')
const score_5 = require('../mocks/scoring_5.json')
const score_6 = require('../mocks/scoring_6.json')
const score_7 = require('../mocks/scoring_7.json')

const app = express()
const scores = [score_1, score_2, score_3, score_4, score_5, score_6, score_7]

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
