import { createScoreRow } from './components/scores.js'

const scoreListElement = document.getElementById('scoreList')

const onScoresFetched = scores => {
  //alert('fetched')

  scoreListElement.innerHTML = scores
    .sort((a, b) => b.bestScore - a.bestScore)
    .map(createScoreRow)
    .join('')
}

const main = () => {
  // alert(fetch)
  fetch('http://localhost:3000/scores')
    .then(res => res.json())
    .then(onScoresFetched)
    // .catch(err => alert(err))
}

main()
