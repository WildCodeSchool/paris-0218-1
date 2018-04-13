/* global
  fetch
*/

import { createScoreRow } from './components/scores.js'

const onScoresFetched = scores => {
  const scoreListElement = document.getElementById('scoreList')

  scoreListElement.innerHTML = scores
    .sort((a, b) => b.bestScore - a.bestScore)
    .map(createScoreRow)
    .join('')
}

const main = () => {
  fetch('http://localhost:3000/scores')
    .then(res => res.json())
    .then(onScoresFetched)
}

main()
