/* global requestAnimationFrame */
const requestAnimationFrame = window.requestAnimationFrame

let prevTimestamp = 0
let x = 470
let distOfMove = -1

// const moving = () => {
//   x += distOfMove * diff
// }

const gameloop = (timestamp) => {
  const diff = timestamp - prevTimestamp
  const frameId = requestAnimationFrame(gameloop)

  // What the game loop needs to do
  const update = () => {
    x += distOfMove * diff
  }
  const collision = () => {
    if () {
      cancelAnimationFrame(frameId)
    }
  }
  // draw()
  prevTimestamp = timestamp
}

requestAnimationFrame(gameloop)
