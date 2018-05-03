import { createScoreRow } from './components/scores.js'
import { getUser, getScores, getAllScores, sendScore } from './api.js'

const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const scoreListElement = document.getElementById('score_list')

let _user

let images = {
  background: document.getElementById('img_background'),
  deer: document.getElementById('img_deer'),
  sock: document.getElementById('img_sock'),
  stars: document.getElementById('img_stars'),
  superSock1: document.getElementById('img_superSock1'),
  superSock2: document.getElementById('img_superSock2'),
  bush: [document.getElementById('img_bush0'),],
  sound: document.getElementById('img_sound0'),
  flyBush: document.getElementById('img_flyBush'),
}

const sockSound = new Audio('sound/sockSound.mp3')
const gameOverSound = new Audio('sound/gameOverSound.mp3')
const flyBushSound0 = new Audio('sound/flyBushSound0.mp3')
const flyBushSound1 = new Audio('sound/flyBushSound1.mp3')


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
    images.bush.push(document.getElementById(`img_bush${i}`))
  }
}
maxBushImg()

const userIdBestScore = users => {
  const user = users.find(user => state.userId === user.id)

  stateBis.userBestScore = user.bestScore
}

const userIdRank = users => {
  let scoresEndGame
  let findUserIndex = users.findIndex(user => state.userId === user.id)
  let findUserIndex2 = users.findIndex(user => state.userId === user.id)

  if (findUserIndex === 0) {
    scoresEndGame = users.slice(findUserIndex, findUserIndex + 5)
  }
  else if (findUserIndex === 1) {
    scoresEndGame = users.slice(findUserIndex - 1, findUserIndex + 4)
    findUserIndex = findUserIndex - 1
  }
  else if (findUserIndex === users.length - 2) {
    scoresEndGame = users.slice(findUserIndex - 3, findUserIndex + 2)
    findUserIndex = findUserIndex - 3
  }
  else if (findUserIndex === users.length - 1) {
    scoresEndGame = users.slice(findUserIndex - 4, findUserIndex + 1)
    findUserIndex = findUserIndex - 4
  }
  else {
    scoresEndGame = users.slice(findUserIndex - 2, findUserIndex + 3)
    findUserIndex = findUserIndex - 2
  }


  let i = 0
  scoresEndGame.map(user1 => {

    ctx.beginPath()
    ctx.moveTo(100, 148 + (22 * i))
    ctx.lineTo(390, 148 + (22 * i))
    ctx.stroke()
    ctx.font = '12px Courier'

    if (findUserIndex + i === findUserIndex2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      // ctx.fillRect(120, 160, 415,(22 * i));
      ctx.font = '17px Courier'
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'center'
    ctx.fillText(`${findUserIndex + i + 1}`, 120, 142 + (22 * i))
    ctx.textAlign = 'center'
    ctx.fillText(`${user1.username}`, 240, 142 + (22 * i))
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

const stateBis = {
  restart: false,
  userId: 0,
  userBestScore: 0,
  sound: {
    x: 5,
    y: 5,
    width: 35,
    height: 35,
    mode: false
  },
}

const basicState = () => ({
  userId: 0,
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
    catch: false,
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

const updateBestScore = () => {
  getAllScores().then(users => {
    const user = users.find(user => state.userId === user.id)

    console.log('updateBestScore', {user})

    stateBis.userBestScore = user ? user.bestScore : 0
  })
}

const drawStart = () => {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(0, 0, 480, 320)
  ctx.closePath()

  ctx.beginPath()
  drawSound(stateBis.sound)
  ctx.font = '40px Serif'
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.textAlign = 'center'
  ctx.fillText(`Avoid Socks & `, 240, 140)
  ctx.fillText(`Catch bees `, 240, 180)
  ctx.font = '20px Serif'
  ctx.fillText(`[SPACE] to start the game`, 240, 300)


  ctx.closePath()

  setTimeout(() => {
    state = basicState()
    updateBestScore()
    state.deer.isDead = false
    state.score = 0
  }, 1000)
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
    if (score > stateBis.userBestScore)
      ctx.fillText(`Meilleur score : New Best Score!!!`, 465, 70)
    else
      ctx.fillText(`Meilleur score : ${userBestScore}`, 465, 70)
    ctx.closePath()
  }
}

const drawGameOver = () => {
  const { sock, score, nbSocks } = state

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
  ctx.fillRect(100, 245, 125, 48)
  ctx.fillRect(280, 245, 125, 48)
  ctx.font = '19px Courier'
  ctx.fillStyle = 'white'
  ctx.fillText(`Restart`, 165, 275)
  ctx.fillText(`Classement`, 345, 275)
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.closePath()

  sendScore(state.userId, state.score, state.nbSocks)
    .then(() => {
      getScores()
        .then(scores => {
          renderScores(scores)
          userIdRank(scores)
        })
    })

  if (stateBis.restart) {
    setTimeout(() => {
      state = basicState()
      stateBis.userBestScore = bestScore
      state.deer.isDead = false
      state.score = 0
      stateBis.restart = false
    }, 2000)
  }

  drawScore(score)
  drawSound(stateBis.sound)
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
  ctx.drawImage(images.sound, stateBis.sound.x, stateBis.sound.y, stateBis.sound.width, stateBis.sound.height)
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

const drawEffectFlyBush = (flyBush) => {
  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
  ctx.fillRect(0, 0, 480, 320)
  setTimeout(() => flyBush.catch = false, 100)
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
  if (score > 500 && (distanceSocks < 5) && (distanceSocks > -5)) {
    superSock1.x = teleport(15000)
  }

  if (score > 500) {
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
  const { flyBush, background, deer, bush, sock, stars, superSock1, superSock2, score, nbSocks } = state
  clear()

  drawBackground(background)
  drawBush(bush)
  drawSock(sock)
  drawFlyBush(flyBush)

  drawsuperSock1(sock, superSock1, score)
  drawsuperSock2(sock, superSock2, score)

  drawDeer(deer)

  drawScore(score, nbSocks, stateBis.userBestScore)

  if (sock.catch) {
    drawEffectSock(deer, sock, stars)
  }

  if (flyBush.catch)
    drawEffectFlyBush(flyBush)

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

  if (stateBis.sound.mode)
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
    flyBush.catch = true
    state.score = state.score - 200
    state.flyBush.x = 1000 + teleport(2500)
    if (stateBis.sound.mode) {
      let what = Math.round(Math.random())
      console.log(what)
      if (what)
        flyBushSound0.play()
      else
        flyBushSound1.play()
    }
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
    if (stateBis.sound.mode)
      sockSound.play()
  }

  // super sock 1
  if (collides(deer, superSock1)) {
    superSock1.catchPositionX = superSock1.x
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
  if (e.code === 'Space') {
    eventStart(e)
  }
})

canvas.addEventListener('click', e => {
  let leftToCanvas = canvas.offsetLeft
  let topToCanvas = canvas.offsetTop
  let mousePos = getMousePos(canvas, e)

  console.log('Sound Mode', stateBis.sound.mode)
  if ((state.score <= 1) && (mousePos.x < 45 && mousePos.y < 45)) {
    stateBis.sound.mode = !stateBis.sound.mode
    if (stateBis.sound.mode)
      images.sound = document.getElementById('img_sound1')
    else
      images.sound = document.getElementById('img_sound0')
    drawSound(stateBis.sound)
    console.log('Sound Mode', stateBis.sound.mode)
  }
  eventStart(e)
})


const eventStart = (e) => {
  const { restart, rank, } = state
  let leftToCanvas = canvas.offsetLeft
  let topToCanvas = canvas.offsetTop
  let mousePos = getMousePos(canvas, e)
  const bestScore = stateBis.userBestScore

  e.preventDefault()

  if (mousePos.x > restart.x && mousePos.y > restart.y
    && mousePos.y < restart.y + restart.height
    && mousePos.x < restart.x + restart.width && (state.deer.isDead)) {
    state = basicState()
    stateBis.userBestScore = bestScore
    state.deer.isDead = false
    state.score = 0
    stateBis.restart = false
  }
  else if (mousePos.x > rank.x && mousePos.y > rank.y
    && mousePos.y < rank.y + rank.height
    && mousePos.x < rank.x + rank.width && state.score < 2) {

    window.location = '/general-ranking.html'
  }


  if (state.deer.isDead && state.score) {
    state.score = 0
  }
  else {
    if (!state.deer.isDead && !state.score && !(mousePos.x < 45 && mousePos.y < 45) && !(stateBis.restart))
      startGame()
    else
      jump()
  }
}


const startGame = () => {
  requestAnimationFrame(gameloop)
  updateBestScore()
  const bestScore = stateBis.userBestScore

  if (stateBis.sound.mode) {
    state = basicState()
    stateBis.sound.mode = true
  }
  else
    state = basicState()
  console.log('avant', stateBis.restart)
  stateBis.restart = false
  state.deer.y = 250
  state.userId = _user.id

  state.deer.isDead = false
  updateBestScore()
  stateBis.userBestScore = bestScore
}

// START
getUser().then(user => {

  if (!user.username) {
    window.location = '/sign-in.html'
    return
  }
  _user = user

  getScores().then(renderScores)
  updateBestScore()
  drawStart()
})
