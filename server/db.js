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
  password: 'dedjzk8376',
  database: 'wildeer'
});
//.then(connection => {
//   return connection.query('select * from users')
// });
const exec = async(query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)
  return result
}

const sqlCurrentDate = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear().toString()
  let currentMonthNum = currentDate.getMonth() + 1
  let currentMonth = currentMonthNum.toString()
  currentMonth = (currentMonth.length < 2 ? '0' : '').concat(currentMonth)
  let currentDay = currentDate.getDate().toString()
  currentDay = (currentDay.length < 2 ? '0' : '').concat(currentDay)
  return currentYear.concat(currentMonth.concat(currentDay))
}

const getUserById = (id) => exec(`select userName, firstName, lastName, profilePicture, wildSide, campus, email, password from users where userId = ?;`, [ id ])
const getUserByUserName = (name) => (`select userId, firstName, lastName, profilePicture, wildSide, campus, email, password from users where userName = ?;`, [ name ])
const addUser  = (params) => exec(`insert into users (userName, email, createdAt) values(?, ?, ?);`, [ params.name, params.email, params.createdAt ])
const updateUser = (params) => exec(`update scores set userName = ?, firstName = ?, lastName = ?, profilePicture = ?, wildSide = ?, campus = ?, email = ?, password = ?,
      bestScore = (select max(score) from scores where userId = ? group by userId) where userId = ?;`,
      [ params.userName, params.firstName, params.lastName, params.profilePicture, params.wildSide, params.campus, params.email, params.password,
        params.userId, params.userId ])
const addScore = (params) => exec(`insert into scores (userId, score, createdAt) values (?, ?, ?);`, [ params.userId, params.score, params.createdAt ])
const getBestScores = () => exec(`select username, score from scores left join users on scores.userId = users.userId
                                  order by score desc limit 5;`)
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

//const keepBests = users => users
//  .sort((user1, user2) => user2.bestScore - user1.bestScore)
//  .slice(0, 5)

app.get('/scores', (request, response) => {
  return getBestScores()
  //.then(users => users.json())
  .then(users => JSON.stringify(users))
  .catch(err => response.status(500).end(err.message))
})

app.post('/addscore', (request, response, next) => {
  const params = {
    userId: request.body.playerId,
    score: request.body.score,
    createdAt: sqlCurrentDate()
  }
  console.log(request.params.userId)
  return addScore(params)
  .then(() => updateBestScore(request.params.playerId))
  .then(() => response.json('OK'))
  .catch(next)
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
    email: request.body.email,
    createdAt: sqlCurrentDate()
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
