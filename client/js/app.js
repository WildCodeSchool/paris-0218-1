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

const renderScores = users => {
  scoreListElement.innerHTML = users
    .sort((a, b) => b.bestScore - a.bestScore)
    .map(createScoreRow)
    .join('')
}

const teleport = offset => canvas.width + Math.random() * offset

const basicState = () => {
 const initState = { playerId: 8,
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
    width: 20,
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
  nbSocks : 0
}
return initState
}

const state = basicState() 


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

const drawScore = (score, nbSocks) => {
  if (!state.deer.isDead) {
    ctx.beginPath()
    ctx.textAlign = 'center'
    ctx.font = '20px Courier'
    ctx.fillStyle = 'White'
    ctx.fillText(`🏆 Score 🏆 : ${Math.round(score)}`, 240, 25)
    ctx.fillText(`Chausette : ${Math.round(nbSocks)}`, 240, 40)     
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
  ctx.font = '65px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Game Over`, 240, 70)
  ctx.font = '25px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Tu as enfilé : ${nbSocks} Chaussettes ! `, 240, 170)  
  ctx.fillText(`Ton score : ${Math.round(score)} points ! `, 240, 200)
  ctx.fillText(`Ton best score : ${score.bestScore}`, 240, 230)
  ctx.font = '15px Courier'
  ctx.drawImage(images.socks, 20, 40, sock.width, sock.height)
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`[ESPACE] pour relancer une partie.`, 240, 290)
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
  const { background, deer, bush, sock, score, nbSocks } = state

  clear()

  drawBackground(background)
  drawBush(bush)
  drawSock(sock)
  drawDeer(deer)

  drawScore(score, nbSocks)

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
      getScores().then(scores => renderScores(scores))
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

// START

getScores().then(scores => renderScores(scores))

draw()
drawStart()

document.addEventListener('keydown', e => {
  if ((e.code === 'Space') && (state.deer.isDead === true)) {
    e.preventDefault()
    requestAnimationFrame(gameloop)
    state.deer.isDead = false
    state = basicState()
  }
}) 


