import { createScoreRow } from './components/scores.js'
import { getScores, sendScore } from './api.js'

const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const scoreListElement = document.getElementById('score_list')
const images = {
  background: document.getElementById('img-background'),
  deer: document.getElementById('img-deer'),
  socks: document.getElementById('img-socks'),
  bush: document.getElementById('img-bush'),
}

const playerIdBestScore = users => {
  // console.log(users)
  const userIndex = users.findIndex(user => state.playerId === user.id)
  // console.log(state.userBestScore)
  state.userBestScore = users[userIndex].bestScore
  // console.log(state.userBestScore)
  // return users[userIndex].bestScore
  // ctx.fillText(`Best score : ${users[userIndex].bestScore}`, 300, 70)      
  // console.log(users)
}

const playerIdRank = users => {
  let scoresEndGame
  let findPlayerIndex = users.findIndex(user => state.playerId === user.id)
  let findPlayerIndex2 = users.findIndex(user => state.playerId === user.id)
    
  if (findPlayerIndex === 0) {
    scoresEndGame = users.slice(findPlayerIndex, findPlayerIndex + 5)
  }
  else if (findPlayerIndex === 1){
    scoresEndGame = users.slice(findPlayerIndex - 1, findPlayerIndex + 4)
    findPlayerIndex = findPlayerIndex  - 1
  }
  else if (findPlayerIndex === users.length - 2){
    scoresEndGame = users.slice(findPlayerIndex - 3, findPlayerIndex + 2)
    findPlayerIndex = findPlayerIndex - 3
  }
  else if (findPlayerIndex === users.length - 1){
    scoresEndGame = users.slice(findPlayerIndex - 4, findPlayerIndex + 1)
    findPlayerIndex = findPlayerIndex - 4
  }
  else {
    scoresEndGame = users.slice(findPlayerIndex - 2, findPlayerIndex + 3)
    findPlayerIndex = findPlayerIndex - 2
  }
  
  
  let i = 0
  scoresEndGame.map(user1 => {
    
    ctx.beginPath()
    ctx.moveTo(100, 168 + (22 * i))
    ctx.lineTo(390, 168 + (22 * i))
    ctx.stroke()
    ctx.font = '12px Courier'
    
    if (findPlayerIndex + i === findPlayerIndex2){
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      // ctx.fillRect(120, 160, 415,(22 * i));
      ctx.font = '17px Courier'
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'center'
    ctx.fillText(`${findPlayerIndex + i + 1}`, 120, 162 + (22 * i))
    ctx.textAlign = 'center'
    ctx.fillText(`${user1.userName}`, 240, 162 + (22 * i))
    ctx.textAlign = 'center'
    ctx.fillText(`${user1.bestScore}`, 360, 162 + (22 * i))
    ctx.closePath()
    i++
  })
}

const renderScores = users => {
  scoreListElement.innerHTML = users
    .sort((a, b) => b.bestScore - a.bestScore)
    .map(createScoreRow)
    .join('')
}


const teleport = offset => canvas.width + Math.random() * offset

const basicState = () => {
  const initState = {
    playerId: 8,
    userBestScore: 0,
    // userBestScore: getScores().then(scores => playerIdBestScore(scores)),
    background: {
      x: 0,
      y: 0,
      width: 650,
      height: 375,
    },
    deer: {
      x: 50,
      y: 250,
      width: 40,
      height: 40,
      move: 0.42732,
      isDead: true,
      jumpState: 0
    },
    sock: {
      x: teleport(2000),
      y: 150,
      width: 25,
      height: 30,
      move: -0.3
    },
    bush: {
      x: teleport(1000),
      y: 250,
      width: 40,
      height: 40,
      move: -0.3
    },
    score: 0,
    speed: 1,
    moduloSpeed: 100,
    frameId: -1,
    nbSocks: 0
  }
  return initState
}

let state = basicState()


const drawStart = () => {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(0, 0, 480, 320);
  ctx.closePath()

  ctx.beginPath()
  ctx.font = '25px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Pour lancer la partie,`, 80, 160)
  ctx.fillText(`appuie sur la barre espace.`, 40, 190)
  ctx.closePath()
}

const drawScore = (score, nbSocks, userBestScore) => {

  // console.log(userBestScore)

  if (!state.deer.isDead) {
    ctx.beginPath()
    ctx.textAlign = 'right'
    ctx.font = '20px Courier'
    ctx.fillStyle = 'White'
    ctx.fillText(`Score : ${Math.round(score)}`, 465, 25)
    ctx.drawImage(images.socks, 395, 30, 20, 25)
    ctx.fillText(` x ${nbSocks}`, 465, 50)
    ctx.font = '15px Courier'  
    ctx.fillText(`Best score : ${userBestScore}`, 465, 70)    
    ctx.closePath()
  }
}

const drawGameOver = () => {
  const { sock, score, nbSocks } = state
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(0, 0, 480, 320);
  ctx.closePath()

  ctx.beginPath()
  ctx.textAlign = 'center'
  ctx.font = '50px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Game Over`, 240, 55)
  ctx.font = '17px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`🏆 Ton score : ${Math.round(score)}`, 240, 90)
  ctx.fillText(`Tu as attrapé ${nbSocks} chaussettes`, 260, 110)
  ctx.drawImage(images.socks, 90, 90, 20, 25)
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`[ESPACE] pour relancer une partie.`, 240, 300)
  ctx.closePath()
}

const drawBackground = background => {
  ctx.drawImage(images.background, background.x, background.y, background.width, background.height)
}

const drawBush = bush => {
  ctx.drawImage(images.bush, bush.x, bush.y, bush.width, bush.height)
}

const drawSock = sock => {
  ctx.drawImage(images.socks, sock.x, sock.y, sock.width, sock.height)
}

const drawDeer = deer => {
  ctx.drawImage(images.deer, deer.x, deer.y, deer.width, deer.height)
}

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const draw = () => {
  getScores().then(scores => playerIdBestScore(scores))
  
  const { background, deer, bush, sock, score, nbSocks, userBestScore } = state

  clear()
  
  
  drawBackground(background)
  drawBush(bush)
  drawSock(sock)
  drawDeer(deer)
  
  
  drawScore(score, nbSocks, userBestScore)

  

  if ((deer.isDead) && (score !== 0)) {
    drawGameOver(score)
  }

  
}

const updateSpeed = () => {
  if (Math.round(state.score) % state.moduloSpeed === 0) {
    state.speed *= 1.2
    state.moduloSpeed *= 2
  }
}

const updateScore = (deltaTime) => {
  state.score += 0.01 * deltaTime * state.speed
}

const moveBush = (deltaTime) => {
  state.bush.x += state.bush.move * deltaTime * state.speed
}

const moveDeer = (deltaTime) => {
  const { deer } = state
  deer.y += deer.jumpState * deer.move * deltaTime

  if (deer.y < 100) {
    deer.jumpState = 1
  }
  if (deer.y > 250) {
    deer.jumpState = 0
    deer.y = 250
  }
}

const moveSock = (deltaTime) => {
  state.sock.x += state.sock.move * deltaTime * state.speed
}

const update = (deltaTime) => {
  moveBush(deltaTime)
  moveSock(deltaTime)
  moveDeer(deltaTime)

  updateScore(deltaTime)

  updateSpeed()
}

const collides = (rect1, rect2) => {
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    return true
  }

  return false
}

const handleDeath = () => {
  state.deer.isDead = true
  cancelAnimationFrame(state.frameId)

  sendScore(state.playerId, state.score, state.nbSocks)
    .then(() => {
      getScores()
        .then(scores => {
          renderScores(scores)
          playerIdRank(scores)
        })
    })
}

const handlePickupSock = () => {
  state.score += 100
  state.sock.x = teleport(2000)
}

const handleCollisions = () => {
  const { deer, sock, bush } = state

  // bush
  if (collides(deer, bush)) {
    handleDeath()
  }
  // check collision with border
  if (bush.x < -bush.width) {
    bush.x = teleport(1000)
  }

  // sock
  if (collides(deer, sock)) {
    handlePickupSock()
    state.nbSocks++
  }
  // check collision with border
  if (sock.x < -sock.width) {
    sock.x = teleport(2000)
  }
}

const jump = () => {
  const { deer } = state

  if (deer.y > 220) {
    deer.jumpState = -1
  }
}

let prevTimestamp = 0

const gameloop = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp
  state.frameId = requestAnimationFrame(gameloop)

  update(deltaTime)
  handleCollisions()
  draw()

  prevTimestamp = timestamp
}


document.addEventListener('keydown', e => {
  if ((e.code === 'Space') && (state.deer.isDead === false)) {
    e.preventDefault()
    jump()
  }
})

document.addEventListener('click', e => {
  if (state.deer.isDead === false) {
    e.preventDefault()
    jump()
  }
})


// START

// getScores().then(users => {
//   console.log(users)
// })

getScores().then(scores => {
  renderScores(scores)
  // playerIdBestScore(scores)
})

draw()
drawStart()



document.addEventListener('keydown', e => {
  if ((e.code === 'Space') && (state.deer.isDead === true)) {
    e.preventDefault()
    requestAnimationFrame(gameloop)
    state = basicState()
    state.deer.isDead = false  
  }
})

document.addEventListener('click', e => {
  if (state.deer.isDead === true) {
    e.preventDefault()
    requestAnimationFrame(gameloop)
    state = basicState()
    state.deer.isDead = false  
  }
})




