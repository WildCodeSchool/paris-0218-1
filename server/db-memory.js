const path = require('path')

const usersDir = path.join(__dirname, 'database/users')

const users = [
  require(path.join(usersDir, '1.json')),
  require(path.join(usersDir, '2.json')),
  require(path.join(usersDir, '3.json')),
  require(path.join(usersDir, '4.json')),
  require(path.join(usersDir, '5.json')),
  require(path.join(usersDir, '6.json')),
]

const getUsers = () => Promise.resolve(users)

const getUserById = id => {
  const user = users.find(user => user.id === id)

  return Promise.resolve(user)
}

const addUser = user => {
  user.id = users.length + 1

  users.push(user)

  return Promise.resolve()
}

const addScore = async (playerId, score) => {
  const player = await getUserById(playerId)

  if (!player) {
    return Promise.reject()
  }

  if (score > player.bestScore) {
    player.bestScore = score
  }

  player.score.push({
    id: player.score.length + 1,
    score: score,
    date: Date.now()
  })

  return Promise.resolve()
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  addScore,
}
