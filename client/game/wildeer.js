const requestAnimationFrame = window.requestAnimationFrame

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let x = 470
let y = 250
let xDeer = 50
let yDeer = 250
//variable provisoire pour le jump test
let sky = false

const drawBuisson = () =>{
  ctx.beginPath()
  ctx.rect(x, y , 40, 40)
  ctx.fillStyle = "green"
  ctx.fill()
  ctx.closePath()
}

const drawDeer = () =>{
  ctx.beginPath()
  ctx.rect(xDeer, yDeer , 40, 40)
  ctx.strokeStyle = "orange"
  ctx.stroke()
  ctx.closePath()
} 

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  document.addEventListener('keydown' , jump)
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

//Verifier les abcisses et les ordonnées + la width/height 
const collision = (frameId) => {
  if ( (x >= xDeer && x <= (xDeer + 40)) && (y >= yDeer && y <= (yDeer + 40)) ){
     cancelAnimationFrame(frameId)
   }
}

const gameloop = (timestamp) => {
  //console.log(timestamp)

  // console.log(`je suis dans la gameloop`)
  const deltaTime = timestamp - prevTimestamp
   console.log(deltaTime)
  const frameId = requestAnimationFrame(gameloop)
  collision(frameId)

  // What the game loop needs to do
  update(deltaTime)
  draw()
  prevTimestamp = timestamp
}

//fonction provisoire pour teste ordonnée Y
const jump = () => {
  if (sky){
    sky = false
    yDeer = 150
  }
  else{
    sky = true
    yDeer = 250
  }
}

requestAnimationFrame(gameloop)
