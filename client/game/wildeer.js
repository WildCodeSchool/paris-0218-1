const requestAnimationFrame = window.requestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let x = 470
let y = 250
let xDeer = 50
let yDeer = 250
// variable provisoire pour le jump test
let sky = false
let dead = false


const drawScore = () => {
  ctx.beginPath()
  ctx.font = "20px Courier"
  ctx.fillStyle = 'White'
  ctx.fillText(`🏆 Score 🏆 : ${Math.round(points)}`,145,25)
  ctx.closePath()
}


const drawGameOver = () => {
  if (dead === true ){
    ctx.beginPath()
    ctx.font = "65px Courier"
    ctx.fillStyle = 'White'
    ctx.fillText(`Game Over`,80,160)
    ctx.closePath()
  }
}

const drawBuisson = () => {
  ctx.beginPath()
  ctx.rect(x, y, 40, 40)
  ctx.fillStyle = 'green'
  ctx.fill()
  ctx.closePath()
}

const drawDeer = () => {
  ctx.beginPath()
  ctx.rect(xDeer, yDeer, 40, 40)
  ctx.strokeStyle = 'orange'
  ctx.stroke()
  ctx.closePath()
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  document.addEventListener('keydown', jump)
  drawBuisson()
  drawDeer()
  drawScore()
  drawGameOver()
}

// layout of the score
let points = 1

// increase of the speed according to augmentation of the score
let speed = 1
let moduloSpeed = 100
const calculSpeed = () => {
  if (Math.round(points) % moduloSpeed === 0) {
    speed = speed * 1.2
    moduloSpeed = moduloSpeed * 2
  }
}

// update of positions and speed according to time
let prevTimestamp = 0
let distOfMove = -0.3
const update = (deltaTime) => {
  x += distOfMove * deltaTime * speed
  points += 0.01 * deltaTime * speed
  calculSpeed()
  if (x < -40) {
    x = canvas.width
  }
}

// Verifier les abcisses et les ordonnées + la width/height
const collision = (frameId) => {
  if ((x >= xDeer && x <= (xDeer + 40)) && (y >= yDeer && y <= (yDeer + 40))) {
    dead = true
    cancelAnimationFrame(frameId)
  }
}

const gameloop = (timestamp) => {
  // console.log(Math.round(timestamp / 1000))
  // console.log(`je suis dans la gameloop`)
  const deltaTime = timestamp - prevTimestamp
  // console.log(deltaTime)
  const frameId = requestAnimationFrame(gameloop)
  collision(frameId)

  // What the game loop needs to do
  update(deltaTime)
  // console.log(speed)
  draw()
  prevTimestamp = timestamp
}

// fonction provisoire pour teste ordonnée Y
const jump = () => {
  if (sky) {
    sky = false
    yDeer = 150
  } else {
    sky = true
    yDeer = 250
  }
}

requestAnimationFrame(gameloop)
