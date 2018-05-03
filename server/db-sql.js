const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dedjzk8376',
  database: 'wildeer'
})

const exec = async (query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)

  return result[0]
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

const getUsers = () => exec(`SELECT userId, username, firstName, lastName, avatar, wildSide, campus, email, bestScore FROM users;`)
const getUserById = (id) => exec(`SELECT username, firstName, lastName, avatar, wildSide, campus, email, password FROM users WHERE userId = ?;`, [ id ])
const getUserByUserName = (name) => exec(`SELECT userId, username, firstName, lastName, avatar, wildSide, campus, email, password FROM users WHERE username = ?;`, [ name ])

const addUser = user => {
  const keys = [ 'username', 'email', 'password', 'firstName', 'lastName', 'campus', 'avatar', 'bestScore' ]

  const query = `INSERT INTO users (${keys.join(', ')}) VALUES (${Array(keys.length).fill('?').join(', ')});`
  const params = keys.map(key => user[key])

  console.log({query, params})

  return exec(query, params)
}


const updateUser = (params) => exec(`UPDATE scores SET username = ?, firstName = ?, lastName = ?, avatar = ?, wildSide = ?, campus = ?, email = ?, password = ?,
      bestScore = (SELECT MAX(score) FROM scores WHERE userId = ? group by userId) WHERE userId = ?;`,
      [ params.username, params.firstName, params.lastName, params.avatar, params.wildSide, params.campus, params.email, params.password,
        params.userId, params.userId ])

const updateBestScore = id => exec(`UPDATE users SET bestScore = (SELECT MAX(score) FROM scores WHERE userId = ?) WHERE userId = ?;`, [ id, id ])

const addScore = async (userId, score) => {
  const result = await exec(`INSERT INTO scores (userId, score) VALUES (?, ?);`, [ userId, score ])

  return updateBestScore(userId)
}

const getBestScores = () => exec(`SELECT username, score FROM scores LEFT JOIN users on scores.userId = users.userId ORDER BY score DESC;`)
  
const getLastUserId = () => exec(`SELECT MAX(userId) as userId FROM users;`)

const addPersonalInformations = async (userId, personalInfo, newAvatar) => {
  return getUserById(userId)
    .then(user => {
      user.firstName = personalInfo.firstName ? personalInfo.firstName : user.firstName
      user.lastName = personalInfo.lastName ? personalInfo.lastName : user.lastName
      user.username = personalInfo.username ? personalInfo.username : user.username
      user.avatar = newAvatar ? newAvatar.filename : user.avatar || 'default.jpg'
      user.email = personalInfo.email ? personalInfo.email : user.email
      user.password = personalInfo.password ? personalInfo.password : user.password
      user.campus = personalInfo.campus ? personalInfo.campus : user.campus
      user.wildside = personalInfo.wildside ? personalInfo.wildside : user.wildside

      return updateUser(user)
    })
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  addScore,
  getBestScores,
  getLastUserId,
  updateUser,
  addPersonalInformations,
}

// console.log(getUsers())


// TESTS

// getUsers().then(console.log)
// getUserById(1).then(console.log)
// getUserByUserName('Filoo').then(console.log)

const testUser = {
  "username": "Test",
  "email": "test@wcs.com",
  "password": "t3st",
  "firstName": '',
  "lastName": '',
  "campus": '',
  "avatar": '',
  "bestScore": 0,
}

// addUser(testUser).then(console.log, console.error)
// addScore(9, 121).then(console.log, console.error)
// getBestScores().then(console.log, console.error)
// getLastUserId().then(JSON.stringify).then(JSON.parse).then(objet => console.log(objet[0], console.error))

// connection.then(co => co.close())
