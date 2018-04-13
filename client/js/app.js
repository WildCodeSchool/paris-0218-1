import { createScoreRow } from './components/scores.js'
import { api } from './config.js'

const scoreListElement = document.getElementById('scoreList')

const onScoresFetched = scores => {
  scoreListElement.innerHTML = scores
    .sort((a, b) => b.bestScore - a.bestScore)
    .map(createScoreRow)
    .join('')
}

const main = () => {
  fetch(`${api.host}:${api.port}/scores`)
    .then(res => res.json())
    .then(onScoresFetched)
}

main()
