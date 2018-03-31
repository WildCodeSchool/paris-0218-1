const express = require('express')

const port = 3000

const score1 = require('../mocks/score1.json')
const score2 = require('../mocks/score2.json')
const score3 = require('../mocks/score3.json')
const score4 = require('../mocks/score4.json')
const score5 = require('../mocks/score5.json')
const score6 = require('../mocks/score6.json')
const score7 = require('../mocks/score7.json')

const scores = [
  score1,
  score2,
  score3,
  score4,
  score5,
  score6,
  score7
]

const app = express()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/scores', (request, response) => {
  response.send(scores)
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
