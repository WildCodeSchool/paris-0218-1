const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const teleport = offset => canvas.width + Math.random() * offset

const state = {
  deer: {
    x: 50,
    y: 250,
    width: 40,
    height: 40,
    move: 0.3,
    isDead: false
  },
  sock: {
    x: teleport(2000),
    y: 150,
    width: 20,
    height: 30,
    move: -0.3,
  },
  bush: {
    x: teleport(1000),
    y: 250,
    width: 40,
    height: 40,
    move: -0.3,
  },
  score: 0,
  speed: 1,
  moduloSpeed: 100,
  frameId: -1
}

let sky = false // tmp

const drawScore = score => {
  ctx.beginPath()
  ctx.font = "20px Courier"
  ctx.fillStyle = 'White'
  ctx.fillText(`🏆 Score 🏆 : ${Math.round(score)}`, 145, 25)
  ctx.closePath()
}

const drawGameOver = () => {
  ctx.beginPath()
  ctx.font = "65px Courier"
  ctx.fillStyle = 'White'
  ctx.fillText(`Game Over`, 80, 160)
  ctx.closePath()
}

const drawRect = (x, y, w, h, color) => {
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

const drawBush = bush => {
  drawRect(bush.x, bush.y, bush.width, bush.height, 'green')
}

const drawSock = sock => {
  drawRect(sock.x, sock.y, sock.width, sock.height, 'brown')
}

const drawDeer = deer => {
  drawRect(deer.x, deer.y, deer.width, deer.height, 'orange')
}

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const draw = () => {
  const { deer, bush, sock, score } = state

  clear()

  drawBush(bush)
  drawSock(sock)
  drawDeer(deer)

  drawScore(score)

  if (deer.isDead) {
    drawGameOver()
  }
}

const updateSpeed = () => {
  if (Math.round(state.score) % state.moduloSpeed === 0) {
    state.speed *= 1.2
    state.moduloSpeed *= 2
  }
}

let prevTimestamp = 0

const updateScore = (deltaTime) => {
  state.score += 0.01 * deltaTime * state.speed
}

const moveBush = (deltaTime) => {
  state.bush.x += state.bush.move * deltaTime * state.speed
}

const moveSock = (deltaTime) => {
  state.sock.x += state.sock.move * deltaTime * state.speed
}

const update = (deltaTime) => {
  moveBush(deltaTime)
  moveSock(deltaTime)

  updateScore(deltaTime)

  updateSpeed()
}

const collides = (rect1, rect2) => {
  if (rect1.x < rect2.x + rect2.width
    && rect1.x + rect1.width > rect2.x
    && rect1.y < rect2.y + rect2.height
    && rect1.height + rect1.y > rect2.y) {
    return true
  }

  return false
}

const handleDeath = () => {
  state.deer.isDead = true
  cancelAnimationFrame(state.frameId)
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
  }
  // check collision with border
  if (sock.x < -sock.width) {
    sock.x = teleport(2000)
  }
}

const gameloop = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp
  state.frameId = requestAnimationFrame(gameloop)

  update(deltaTime)
  handleCollisions()
  draw()

  prevTimestamp = timestamp
}

// fonction provisoire pour teste ordonnée Y
const jump = () => {
  if (sky) {
    sky = false
    state.deer.y = 150
  } else {
    sky = true
    state.deer.y = 250
  }
}

document.addEventListener('keydown', jump)

requestAnimationFrame(gameloop)
