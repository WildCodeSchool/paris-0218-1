const express = require('express')
const fs = require('fs')
const port = 3000
const util = require('util')
const path = require('path')

// const users = []

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)


// Rechargement des infos users pour mettre à jour le tableau des scores

// const getUsers = () => {
//   const usersDir = path.join(__dirname, 'database/users')
//   return readdir(usersDir, 'utf8')
   
// }

// getUsers().then(users => console.log(users.length)) // TODO: rm

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

const keepBests = users => users
  .sort((user1, user2) => user2.bestScore - user1.bestScore)
  .slice(0, 5)

app.get('/scores', (request, response) => {
  const usersDir = path.join(__dirname, 'database/users')
  readdir(usersDir, 'utf8')
    .then(users => Promise.all(users
      .map(user => path.join(usersDir, user))
      .map(userpath => readFile(userpath, 'utf8'))))
    .then(usersListValues => usersListValues.map(user => JSON.parse(user)))
    .then(keepBests)
    .then(users => response.json(users))
    .catch(err => response.status(500).end(err.message))
})

app.post('/addscore', (request, response, next) => {

  const playerId = request.body.playerId
  const score = request.body.score

  const filename = `${playerId}.json`
  const filepath = path.join(__dirname, 'database/users', filename)

  readFile(filepath, 'utf8')
    .then(JSON.parse)
    .then(player => {
      if (score > player.bestScore) {
        console.log('NEW Best Score!')
        player.bestScore = score
      }
      player.score.push(
        {
          id: player.score.length + 1,
          score: score,
          date: Date.now()
        }
      )
      const newScore = JSON.stringify(player, null, 2)
      return writeFile(filepath, newScore, 'utf8')
    })
    .then(() => response.json('OK'))
    .catch(next)
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
