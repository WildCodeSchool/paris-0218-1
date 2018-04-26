//const exec = require('exec')
const DBPath = '~/wildeer/paris-0218-w1lDe3r-keurkeur/server/database/'
const DBName = 'wildeer.sql'
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const util = require('util')
const cors = require('cors')
const port = 3000
app.use(cors())

const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wildeer'
});
//.then(connection => {
//   return connection.query('select * from users')
// });
const exec = async(query, params) => {
  const connect = await(connection)
  const result = await(connection.execute(query, params))
  return result
}

const getUserById = (id) => exec(`select * from users where userId = ?;`, [ id ])
const getUserByUserName = (name) => (`select * from users where userName = ?;`, [ name ])
const addUser  = (params) => exec(`insert into users (userName, email) values(?, ?);`, [params.name, params.email])
const updateUser = (params) => exec(`update scores set userName = ?, firstName = ?, lastName = ?, profilePicture = ?, wildSide = ?, campus = ?, email = ?, password = ?,
      bestScore = (select max(score) from scores where userId = ? group by userId) where userId = ?;`,
      [ params.userName, params.firstName, params.lastName, params.profilePicture, params.wildSide, params.campus, params.email, params.password,
        params.userId, params.userId ])
const addScore = (params) => exec(`insert into score (userId, score) values (?, ?);`, [params.userId, params.score])
const getBestScores = () => exec(`select username, firstName, lastName, score, scores.createdAt from scores left join users on scores.userId = users.userId order by score desc limit 5;`)
const updateBestScore = (id) => exec(`update users set bestScore = (select max(score) from scores where userId = ? group by userId) where userId = ?;`, [ id, id ])

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
  // const usersDir = path.join(__dirname, 'database/users')
  // readdir(usersDir, 'utf8')
  //   .then(users => Promise.all(users
  //     .map(user => path.join(usersDir, user))
  //     .map(userpath => readFile(userpath, 'utf8'))))
  //   .then(usersListValues => usersListValues.map(user => JSON.parse(user)))
  //   .then(keepBests)
  //   .then(users => response.json(users))
  //   .catch(err => response.status(500).end(err.message))
    return getBestScores()
    .then(users =>responsejson(users))
    .catch(err => response.status(500).end(err.message))
})

app.post('/addscore', (request, response, next) => {
  const params = {
    userId: request.body.playerId,
    score: request.body.score
  }
  return addScore(params)
  .then(() => updateBestScore(request.params.playerId))
  .then(() => response.json('OK'))
  .catch(next)
  // const playerId = request.body.playerId
  // const score = request.body.score
  //
  // const filename = `${playerId}.json`
  // const filepath = path.join(__dirname, 'database/users', filename)
  //
  // readFile(filepath, 'utf8')
  //   .then(JSON.parse)
  //   .then(player => {
  //     if (score > player.bestScore) {
  //       console.log('NEW Best Score!')
  //       player.bestScore = score
  //     }
  //     player.score.push({
  //       id: player.score.length + 1,
  //       score: score,
  //       date: Date.now()
  //     })
  //     const newScore = JSON.stringify(player, null, 2)
  //     return writeFile(filepath, newScore, 'utf8')
  //   })
  //   .then(() => response.json('OK'))
  //   .catch(next)
})

app.post('/userProfile', (request, response, next) => {
  const params = {
    userId: request.body.playerId,
    userName: request.body.userName,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    profilePicture: request.body.profilePicture,
    wildSide: request.body.wildSide,
    campus: request.body.campus,
    email: request.body.email,
    password: request.body.email,
    score: request.body.score
  }
  return updateUser(params)
  .then(() => response.json('OK'))
  .catch(next)
})

app.post('/user', (request, response, next) => {
  const params = {
    userName: request.body.userName,
    email: request.body.email
  }
  return addUser(params)
  .then(() => response.json('OK'))
  .catch(next)
})

app.get('/userName', (request, response, next) => {
  const params = {userName: request.body.userName}
  return getUserByName(params.userName)
  .then(() => response.json('OK'))
  .catch(next)
})

app.get('/userId', (request, response, next) => {
  const params = {userName: request.body.userId}
  return getUserById(params.userId)
  .then(() => response.json('OK'))
  .catch(next)
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
