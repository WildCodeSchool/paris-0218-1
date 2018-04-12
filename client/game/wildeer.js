const requestAnimationFrame = window.requestAnimationFrame

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let x = 470
let y = 250

const drawBuisson = () => {
	ctx.beginPath()
	ctx.rect(x, y , 40, 40)
	ctx.fillStyle = "green"
	ctx.fill()
	ctx.closePath()
}

const drawDeer = () => {
  ctx.beginPath()
  ctx.rect(50, y , 40, 40)
  ctx.strokeStyle = "orange"
  ctx.stroke()
  ctx.closePath()
}

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawBuisson()
	drawDeer()
}


// layout of the score
let points = 1
const showPoints = () => {
  const pointsElement = document.getElementById('showPoints')
  pointsElement.innerHTML = `🏆 Score 🏆 : ${Math.round(points)}`
}

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
	if (x < -40 ) {
		x = canvas.width
	}
}

// const collision = () => {
//   if () {
//     cancelAnimationFrame(frameId)
//   }
// }

const gameloop = (timestamp) => {
	// console.log(Math.round(timestamp / 1000))
	// console.log(`je suis dans la gameloop`)
  const deltaTime = timestamp - prevTimestamp
	// console.log(deltaTime)
  const frameId = requestAnimationFrame(gameloop)

  // What the game loop needs to do
	update(deltaTime)
	// console.log(speed)
  draw()
	showPoints()
  prevTimestamp = timestamp
}

requestAnimationFrame(gameloop)
