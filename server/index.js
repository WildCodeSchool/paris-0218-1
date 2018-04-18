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

app.get('/scores', (request, response) => {
  const getUsers = () => {
    const usersDir = path.join(__dirname, 'database/users')
    readdir(usersDir, 'utf8')
      .then(users => Promise.all(users
        .map(user => path.join(usersDir, user))
        .map(userpath => readFile(userpath, 'utf8'))))
      .then(usersListValues => response.json(usersListValues
        .map(user => JSON.parse(user))))
      .catch(err => response.status(500).end(err.message))
  }

  getUsers()
    
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
