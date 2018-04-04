let points = 0

// function called by the setInteval - add 1 point at every interval
const addPoints = () => {
  points += 1
  const pointsElement = document.getElementById('showPoints')
  pointsElement.innerHTML = `${points}`
}

// function called when the user clicks on play
const myFunction = () => {
  window.setInterval(addPoints, 300)
}

// play button
const playElement = document.getElementById('play')
playElement.addEventListener('click', myFunction)


// window.clearInterval(timerPoints);
