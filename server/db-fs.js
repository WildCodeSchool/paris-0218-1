const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const usersDir = path.join(__dirname, 'database/users')

const getUsers = () => {
  return readdir(usersDir, 'utf8')
    .then(users => Promise.all(users
      .map(user => path.join(usersDir, user))
      .map(userpath => readFile(userpath, 'utf8'))))
    .then(usersListValues => usersListValues.map(user => JSON.parse(user)))
}

const getUserById = id => {
  const filename = `${id}.json`
  const filepath = path.join(usersDir, filename)

  return readFile(filepath, 'utf8').then(JSON.parse)
}

const addUser = async user => {
  const users = await getUsers()

  user.id = users.length + 1

  const filename = `${user.id}.json`
  const filepath = path.join(usersDir, filename)

  return writeFile(filepath, JSON.stringify(user, null, 2), 'utf8')
}

const updateUser = user => {
  const filename = `${user.id}.json`
  const filepath = path.join(usersDir, filename)

  return writeFile(filepath, JSON.stringify(user, null, 2), 'utf8')
}

const addScore = async (userId, score) => {
  return getUserById(userId)
    .then(user => {
      if (score > user.bestScore) {
        user.bestScore = score
      }

      user.score.push({
        id: user.score.length + 1,
        score: score,
        date: Date.now()
      })

      return updateUser(user)
    })
}

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
  addPersonalInformations
}
