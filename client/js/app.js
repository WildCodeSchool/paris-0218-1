import { showScoreElements } from './components/scores.js'

const main = () => {
  fetch('http://localhost:3000/scores')
  .then(res => res.json())
  .then(scoresReceived)
}

const scoresReceived = scores => {

  const scoreTable = document.getElementById('scoreList')
  scoreTable.innerHTML = scores.sort((a, b) => b.bestScore - a.bestScore).map(showScoreElements).join('')
  
}

main()
