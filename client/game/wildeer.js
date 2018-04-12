const requestAnimationFrame = window.requestAnimationFrame

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let x = 470
let y = 250

const drawBuisson = () =>{
	ctx.beginPath()
	ctx.rect(x, y , 40, 40)
	ctx.fillStyle = "green"
	ctx.fill()
	ctx.closePath()
}

const drawDeer = () =>{
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

let prevTimestamp = 0
let distOfMove = -0.3
let speed = 1

const update = (deltaTime) => {
	x += distOfMove * deltaTime * speed
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
	console.log(timestamp)

	console.log(`je suis dans la gameloop`)
  const deltaTime = timestamp - prevTimestamp
	console.log(deltaTime)
  const frameId = requestAnimationFrame(gameloop)

  // What the game loop needs to do
	update(deltaTime)
  draw()
  prevTimestamp = timestamp
}

requestAnimationFrame(gameloop)
