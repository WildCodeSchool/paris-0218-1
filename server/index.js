const express = require('express')
const fs = require('fs')
const port = 3000
const util = require('util')
const path = require('path')
const scores = []

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

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

  const playerId = request.body.playerId
  const score = request.body.score

  const filename = `${playerId}.json`
  const filepath = path.join(__dirname, 'database/users', filename)

  readFile(filepath, 'utf8')
    .then(data => {
      const player = JSON.parse(data)

      if (score > player.bestScore) {
        console.log('NEW Best Score!')
        player.bestScore = score
        return writeFile(filepath, JSON.stringify(player, null, 2), 'utf8')
          .then(() => response.json('OK'))
          .catch(next)
      }

      response.json('OK')
    })
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
