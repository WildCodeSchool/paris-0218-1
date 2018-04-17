const express = require('express')
const fs = require('fs')
const port = 3000
const util = require('util')
const path = require('path')

const writeFile = util.promisify(fs.writeFile)

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

app.use((request, response, next) => {
  if (request.method === 'GET') return next()
  let accumulator = ''

  request.on('data', data => {
    accumulator += data
  })

  request.on('end', () => {
    try {
      request.body = JSON.parse(accumulator)
      next()
    } catch (err) {
      next(err)
    }
  })
})

app.get('/scores', (request, response) => {
  response.send(scores)
})

app.post('/addscore', (request, response, next) => {
  const id = Math.random().toString(36).slice(2).padEnd(11, '0')
  const filename = `${id}.json`
  const filepath = path.join(__dirname, '../mocks/', filename)

  const content = {
    id: id,
    userName: request.body.userName,
    bestScore: request.body.bestScore,
    date: Date.now()
  }

  writeFile(filepath, JSON.stringify(content, null, 2), 'utf8')
    .then(() => response.json('OK'))
    .catch(next)
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
