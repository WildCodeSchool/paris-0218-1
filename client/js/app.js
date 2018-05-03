import { createScoreRow } from './components/scores.js'
import { getScores, sendScore } from './api.js'
// import { start } from 'repl';

const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const scoreListElement = document.getElementById('score_list')

let images = {
  background: document.getElementById('img-background'),
  deer: document.getElementById('img-deer'),
  sock: document.getElementById('img-sock'),
  stars: document.getElementById('img-stars'),
  superSock1: document.getElementById('img-superSock1'),
  superSock2: document.getElementById('img-superSock2'),
  bush: [document.getElementById('img-bush0'),],
  sound: document.getElementById('img-sound0'),
  flyBush: document.getElementById('img-flyBush'),
}

const sockSound = new Audio('sound/sockSound.mp3')
const gameOverSound = new Audio('sound/gameOverSound.mp3')


const rdmNumber = (min, max) => {
  let i = 0
  let nb = Math.random() * (max - min) + min

  state.rdmNb = Math.floor(nb)

  //luck to draw First bush than other
  while (i++ < 2) {
    if (state.rdmNb !== 0) {
      nb = Math.random() * (max - min) + min
      state.rdmNb = Math.floor(nb)
    }
    else
      return
  }
}

const maxBushImg = () => {
  let i = 1
  while (i++ < 3) {
    images.bush.push(document.getElementById(`img-bush${i}`))
  }
}
maxBushImg()

const playerIdBestScore = users => {
  const user = users.find(user => state.playerId === user.id)

  state.userBestScore = user.bestScore
}

const playerIdRank = users => {
  let scoresEndGame
  let findPlayerIndex = users.findIndex(user => state.playerId === user.id)
  let findPlayerIndex2 = users.findIndex(user => state.playerId === user.id)

  if (findPlayerIndex === 0) {
    scoresEndGame = users.slice(findPlayerIndex, findPlayerIndex + 5)
  }
  else if (findPlayerIndex === 1) {
    scoresEndGame = users.slice(findPlayerIndex - 1, findPlayerIndex + 4)
    findPlayerIndex = findPlayerIndex - 1
  }
  else if (findPlayerIndex === users.length - 2) {
    scoresEndGame = users.slice(findPlayerIndex - 3, findPlayerIndex + 2)
    findPlayerIndex = findPlayerIndex - 3
  }
  else if (findPlayerIndex === users.length - 1) {
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
    ctx.moveTo(100, 148 + (22 * i))
    ctx.lineTo(390, 148 + (22 * i))
    ctx.stroke()
    ctx.font = '12px Courier'

    if (findPlayerIndex + i === findPlayerIndex2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      // ctx.fillRect(120, 160, 415,(22 * i));
      ctx.font = '17px Courier'
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'center'
    ctx.fillText(`${findPlayerIndex + i + 1}`, 120, 142 + (22 * i))
    ctx.textAlign = 'center'
    ctx.fillText(`${user1.userName}`, 240, 142 + (22 * i))
    ctx.textAlign = 'center'
    ctx.fillText(`${user1.bestScore}`, 360, 142 + (22 * i))
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

const getMousePos = (canvas, e) => {
  let canvasPos = canvas.getBoundingClientRect()

  return {
    x: e.clientX - canvasPos.left,
    y: e.clientY - canvasPos.top
  }
}

const teleport = offset => canvas.width + Math.random() * offset

const basicState = () => ({
  playerId: 8,
  userBestScore: 0,
  background: {
    x: 0,
    y: 0,
    width: 650,
    height: 320,
    move: -0.05,
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
    move: -0.3,
    catch: false,
    catchPositionX: 0
  },
  stars: {
    x: 0,
    y: 150,
    width: 85,
    height: 95,
  },
  superSock1: {
    x: teleport(15000),
    y: 150,
    width: 50,
    height: 55,
    move: -0.3,
    catch: false,
    catchPositionX: 0
  },
  superSock2: {
    x: teleport(15000),
    y: 150,
    width: 50,
    height: 55,
    move: -0.3,
    catch: false,
    catchPositionX: 0
  },
  bush: {
    // x: 600 + teleport(1000),
    x: 800,
    y: 250,
    width: 40,
    height: 40,
    move: -0.3,
  },
  flyBush: {
    x: 3000 + teleport(2300),
    y: 230,
    width: 30,
    height: 30,
    move: -0.25,
  },
  sound: {
    x: 5,
    y: 5,
    width: 35,
    height: 35,
    mode: false
  },
  restart: {
    x: 100,
    y: 245,
    width: 110,
    height: 32,
  },
  rank: {
    x: 280,
    y: 245,
    width: 110,
    height: 32,
  },
  rdmNb: 0,
  score: 1,
  speed: 1,
  moduloSpeed: 100,
  frameId: -1,
  nbSocks: 0
})

let state = basicState()

const drawStart = () => {

  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(0, 0, 480, 320)
  ctx.closePath()

  ctx.beginPath()
  drawSound(state.sound)
  ctx.font = '40px Serif'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Evites les obstacles, `, 90, 140)
  ctx.fillText(`Attrapes des chaussettes.`, 50, 180)
  ctx.font = '20px Serif'
  ctx.fillText(`[ESPACE] pour demarrer une partie`, 95, 300)


  ctx.closePath()

  setTimeout(() => {
    state = basicState()
    state.userBestScore = bestScore
    state.deer.isDead = false
    state.score = 0
  }, 2000)

}

const drawScore = (score, nbSocks, userBestScore) => {

  if (!state.deer.isDead) {
    ctx.beginPath()
    ctx.textAlign = 'right'
    ctx.font = '20px Courier'
    ctx.fillStyle = 'White'
    ctx.fillText(`Score : ${Math.round(score)}`, 465, 25)
    ctx.drawImage(images.sock, 395, 30, 20, 25)
    ctx.fillText(` x ${nbSocks}`, 465, 50)
    ctx.font = '13px Courier'
    ctx.fillText(`Meilleur score : ${userBestScore}`, 465, 70)
    ctx.closePath()
  }
}

const drawGameOver = () => {
  const { sock, score, nbSocks, sound } = state

  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.textAlign = 'center'
  ctx.font = '50px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`Game Over`, 240, 55)
  ctx.font = '17px Courier'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`🏆 Ton score : ${Math.round(score)}`, 240, 90)
  ctx.fillText(`Tu as attrapé ${nbSocks} chaussettes`, 260, 110)
  ctx.drawImage(images.sock, 90, 90, 20, 25)
  ctx.fillStyle = 'black'
  ctx.fillRect(100, 245, 110, 32)
  ctx.fillRect(280, 245, 110, 32)
  ctx.font = '17px Courier'
  ctx.fillStyle = 'white'
  ctx.fillText(`Restart`, 157, 265)
  ctx.fillText(`Classement`, 335, 265)
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillText(`[ESPACE] pour relancer une partie.`, 248, 300)
  ctx.closePath()

  sendScore(state.playerId, state.score, state.nbSocks)
    .then(() => {
      getScores()
        .then(scores => {
          renderScores(scores)
          playerIdRank(scores)
        })
    })

  setTimeout(() => {
    state = basicState()
    state.userBestScore = bestScore
    state.deer.isDead = false
    state.score = 0
  }, 2000)

  drawScore(score)
  drawSound(sound)

}

const drawBackground = background => {
  ctx.drawImage(images.background, background.x, background.y, background.width, background.height)
  ctx.closePath()
  ctx.drawImage(images.background, background.x + 650, background.y, background.width, background.height)
  if (background.x < -650)
    background.x = 0
}

const drawFlyBush = flyBush => {
  ctx.drawImage(images.flyBush, flyBush.x, flyBush.y, flyBush.width, flyBush.height)
}

const drawBush = bush => {
  ctx.drawImage(images.bush[state.rdmNb], bush.x, bush.y, bush.width, bush.height)
}

const drawSound = sound => {
  ctx.clearRect(0, 0, 45, 45)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(0, 0, 45, 45)
  ctx.drawImage(images.sound, sound.x, sound.y, sound.width, sound.height)
}

const drawSock = sock => {
  ctx.drawImage(images.sock, sock.x, sock.y, sock.width, sock.height)
}

const drawEffectSock = (deer, sock, stars) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(0, 0, 480, 320)
  ctx.drawImage(images.sock, sock.catchPositionX - (sock.width / 2), sock.y - (sock.height / 2), sock.width * 1.5, sock.height * 1.5)
  ctx.drawImage(images.stars, sock.catchPositionX - (stars.width / 2.3), stars.y - (stars.height / 2.1))
  setTimeout(() => sock.catch = false, 100)
}

const drawEffectSuperSock1 = (deer, superSock1, stars) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(0, 0, 480, 320)
  ctx.drawImage(images.superSock1, superSock1.catchPositionX - (superSock1.width / 2), superSock1.y - (superSock1.height / 2), superSock1.width * 1.1, superSock1.height * 1.1)
  ctx.drawImage(images.stars, superSock1.catchPositionX - (stars.width / 1.8), stars.y - (stars.height / 1.7), stars.width * 1.2, stars.height * 1.2)
  setTimeout(() => superSock1.catch = false, 50)
}

const drawEffectSuperSock2 = (deer, superSock2, stars) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(0, 0, 480, 320)
  ctx.drawImage(images.superSock2, superSock2.catchPositionX - (superSock2.width / 2), superSock2.y - (superSock2.height / 2), superSock2.width * 1.5, superSock2.height * 1.5)
  ctx.drawImage(images.stars, superSock2.catchPositionX - (stars.width / 1.8), stars.y - (stars.height / 1.7), stars.width * 1.2, stars.height * 1.2)
  setTimeout(() => superSock2.catch = false, 50)
}

const drawsuperSock1 = (sock, superSock1, score) => {
  const distanceSocks = superSock1.x - sock.x
  // console.log(distanceSocks)
  if (score > 500 && (distanceSocks < 5) && (distanceSocks > -5)) {
    // console.log("bah")
    superSock1.x = teleport(15000)
  }

  if (score > 500) {
    // console.log(superSock1.x)
    ctx.drawImage(images.superSock1, superSock1.x, superSock1.y, superSock1.width, superSock1.height)
  }

  if (superSock1.x < 0) {
    superSock1.x = teleport(15000)
  }
}

const drawsuperSock2 = (sock, superSock2, score) => {
  const distanceSocks = superSock2.x - sock.x

  if (score > 500 && (distanceSocks < 5) && (distanceSocks > -5)) {
    superSock2.x = teleport(15000)
  }

  if (score > 1500) {
    console.log("1500 !")
    ctx.drawImage(images.superSock2, superSock2.x, superSock2.y, superSock2.width, superSock2.height)
  }

  if (superSock2.x < 0) {
    superSock2.x = teleport(15000)
  }
}

const drawDeer = deer => {
  ctx.drawImage(images.deer, deer.x, deer.y, deer.width, deer.height)
}

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const draw = () => {
  const { flyBush, background, deer, bush, sock, stars, superSock1, sound, superSock2, score, nbSocks, userBestScore } = state
  clear()


  drawBackground(background)
  drawBush(bush)
  drawSock(sock)
  drawFlyBush(flyBush)

  drawsuperSock1(sock, superSock1, score)
  drawsuperSock2(sock, superSock2, score)

  drawDeer(deer)

  drawScore(score, nbSocks, userBestScore)

  if (sock.catch) {
    drawEffectSock(deer, sock, stars)
  }

  if (superSock1.catch) {
    console.log("blabla")
    drawEffectSuperSock1(deer, superSock1, stars)
  }

  if (superSock2.catch) {
    drawEffectSuperSock2(deer, superSock2, stars)
  }

  if ((deer.isDead) && (score !== 0)) {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillRect(0, 0, 480, 320);
    ctx.closePath()
    drawGameOver(score)
  }
}

const updateSpeed = () => {
  if (Math.round(state.score) % state.moduloSpeed === 0) {
    state.speed *= 1.1
    state.moduloSpeed *= 2
  }
}

const updateScore = (deltaTime) => {
  state.score += 0.01 * deltaTime * state.speed
}

const moveBush = (deltaTime) => {
  state.bush.x += state.bush.move * deltaTime * state.speed
}

const moveFlyBush = (deltaTime) => {
  state.flyBush.x += state.flyBush.move * deltaTime * state.speed
}

const moveBackGround = (deltaTime) => {
  state.background.x += state.background.move * deltaTime * state.speed
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

const movesuperSock1 = (deltaTime) => {
  state.superSock1.x += state.superSock1.move * deltaTime * state.speed
}

const movesuperSock2 = (deltaTime) => {
  state.superSock2.x += state.superSock2.move * deltaTime * state.speed
}

const update = (deltaTime) => {
  moveBush(deltaTime)
  moveSock(deltaTime)
  moveDeer(deltaTime)
  moveBackGround(deltaTime)
  moveFlyBush(deltaTime)

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

  if (state.sound.mode)
    gameOverSound.play()
}

const handlePickupSock = () => {
  state.score += 100
  state.sock.x = teleport(2000)
}

const handlePickupsuperSock1 = () => {
  state.score += 200
  state.superSock1.x = teleport(15000)
}

const handlePickupsuperSock2 = () => {
  state.speed = 1,
    state.moduloSpeed = 100,
    state.superSock2.x = teleport(15000)
}

const handleCollisions = (deltaTime) => {
  const { flyBush, deer, sock, superSock1, superSock2, bush } = state

  //bush
  if (collides(deer, bush)) {
    handleDeath()
  }

  if (collides(deer, flyBush)) {
    state.score = state.score - 200
    state.flyBush.x = 1000 + teleport(2500)

  }

  if (flyBush.x < -flyBush.width) {
    flyBush.x = 2000 + teleport(2300)
  }

  // check collision with border
  if (bush.x < -bush.width) {
    bush.x = teleport(1000)
    rdmNumber(0, 3)
  }

  // sock
  if (collides(deer, sock)) {
    sock.catchPositionX = sock.x
    handlePickupSock()
    sock.catch = true
    state.nbSocks++
    if (state.sound.mode)
      sockSound.play()
  }

  // super sock 1
  if (collides(deer, superSock1)) {
    superSock1.catchPositionX = superSock1.x
    console.log(superSock1.catchPositionX)
    handlePickupsuperSock1()
    superSock1.catch = true
    state.nbSocks++
  }

  // super sock 2
  if (collides(deer, superSock2)) {
    superSock2.catchPositionX = superSock2.x
    handlePickupsuperSock2()
    superSock2.catch = true
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
  eventStart(e)
})

canvas.addEventListener('click', e => {
  let leftToCanvas = canvas.offsetLeft
  let topToCanvas = canvas.offsetTop
  let mousePos = getMousePos(canvas, e)

  console.log('klick', state.sound.mode)
  if ((state.score <= 1) && (mousePos.x < 45 && mousePos.y < 45)) {
    state.sound.mode = !state.sound.mode
    if (state.sound.mode)
      images.sound = document.getElementById('img-sound1')
    else
      images.sound = document.getElementById('img-sound0')
    drawSound(state.sound)
    console.log('klickapresIF', state.sound.mode)
  }
  eventStart(e)
})


const eventStart = (e) => {
  const { sound, restart, rank, } = state
  let leftToCanvas = canvas.offsetLeft
  let topToCanvas = canvas.offsetTop
  let mousePos = getMousePos(canvas, e)
  const bestScore = state.userBestScore

  e.preventDefault()


  if (mousePos.x > restart.x && mousePos.y > restart.y
    && mousePos.y < restart.y + restart.height
    && mousePos.x < restart.x + restart.width && (state.deer.isDead || state.score < 2)) {

    startGame()
  }
  else if (mousePos.x > rank.x && mousePos.y > rank.y
    && mousePos.y < rank.y + rank.height
    && mousePos.x < rank.x + rank.width && state.score < 2) {

    window.location('/general-ranking.html')
  }


  if (state.deer.isDead && state.score) {
    state.score = 0
  }
  else {
    if (!state.deer.isDead && !state.score && !(mousePos.x < 45 && mousePos.y < 45))
      startGame()
    else
      jump()
  }
}


const startGame = () => {
  requestAnimationFrame(gameloop)
  getScores().then(users => {
    renderScores(users)
    const user = users.find(user => state.playerId === user.id)
    state.userBestScore = user.bestScore
  })
  const bestScore = state.userBestScore

  if (state.sound.mode) {
    state = basicState()
    state.sound.mode = true
  }
  else
    state = basicState()

  state.deer.isDead = false
  state.userBestScore = bestScore
}

// START

getScores().then(users => {
  renderScores(users)
  const user = users.find(user => state.playerId === user.id)
  state.userBestScore = user.bestScore
  console.log(bestScore)
})

const bestScore = state.userBestScore
drawStart()
