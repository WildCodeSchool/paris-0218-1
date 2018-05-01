import { createScoreRow } from './components/scores.js'
import { getScores, sendScore } from './api.js'
// import { start } from 'repl';

const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const scoreListElement = document.getElementById('score_list')
const images = {
  background: document.getElementById('img-background'),
  deer: document.getElementById('img-deer'),
  socks: document.getElementById('img-socks'),
  bush: [document.getElementById('img-bush0'),
  document.getElementById('img-bush1')],
  flyBush: document.getElementById('img-flyBush'),
}

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
    ctx.moveTo(100, 168 + (22 * i))
    ctx.lineTo(390, 168 + (22 * i))
    ctx.stroke()
    ctx.font = '12px Courier'

    if (findPlayerIndex + i === findPlayerIndex2) {
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

const basicState = () => ({
  playerId: 8,
  userBestScore: 0,
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
    move: -0.3,
    alt: 0
  },
  flyBush: {
    x: 4000 + teleport(2300),
    y: 230,
    width: 30,
    height: 30,
    move: -0.25,
  },
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
  ctx.drawImage(images.bush[state.bush.alt], bush.x, bush.y, bush.width, bush.height)
}

const drawFlyBush = flyBush => {
  ctx.drawImage(images.flyBush, flyBush.x, flyBush.y, flyBush.width, flyBush.height)
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
  const { background, deer, bush, flyBush, sock, score, nbSocks, userBestScore } = state

  clear()


  drawBackground(background)
  drawBush(bush)
  drawFlyBush(flyBush)

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

const moveFlyBush = (deltaTime) => {
  state.flyBush.x += state.flyBush.move * deltaTime * state.speed
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
  moveFlyBush(deltaTime)
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

const handleCollisions = (deltaTime) => {
  const { deer, sock, bush, flyBush } = state

  // bush
  if (collides(deer, bush) || collides(deer, flyBush)) {
    handleDeath(deltaTime)
  }
  // check collision with border
  if (bush.x < -bush.width) {
    bush.x = teleport(1000)
    state.bush.alt = Math.round(Math.random())
  }
  if (flyBush.x < -flyBush.width) {
    flyBush.x = 2000 + teleport(2300)
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
  eventStart(e)
})

canvas.addEventListener('click', e => {
  eventStart(e)
})


const eventStart = (e) => {

  e.preventDefault()

  if (state.deer.isDead === true && state.score) {
    state.score = 0
    console.log('chronos appel', state.deer.isDead)

    setTimeout(() => {
      console.log('jspr chronos vient', state.deer.isDead)
      state = basicState()
      state.deer.isDead = false
      state.score = 0
    }, 1700)
    // || ((e.code === 'Space') && (state.deer.isDead === true))) {
  }
  else {
    if (!state.deer.isDead && !state.score)
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

  state = basicState()
  state.deer.isDead = false
  state.userBestScore = bestScore
}

// START

getScores().then(users => {
  renderScores(users)
  const user = users.find(user => state.playerId === user.id)
  state.userBestScore = user.bestScore
})

drawStart()
