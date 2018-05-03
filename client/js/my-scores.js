import { createUserScoreRow } from './components/user-scores.js'
import { getProfile, getUser } from './api.js'

const myScoresElement = document.getElementById('my_scores')
const noScoreElement = document.getElementById('no_score')
const bestScoreElement = document.getElementById('my_best_score')
const scoreAverrageElement = document.getElementById('my_score_averrage')
const socksAverrageElement = document.getElementById('my_socks_averrage')
const historyElement = document.getElementById('score_history_list')
const bestScoresElement = document.getElementById('best_scores_list')

const scoresAverrage = user => {
  scoreAverrageElement.innerHTML = Math.round(user.score
    .map(s => s.score)
    .reduce((a, b) => a + b) / user.score.length)
}

const socksAverrage = user => {
  socksAverrageElement.innerHTML = Math.round(user.score
    .map(s => s.nbSocks)
    .reduce((a, b) => a + b) / user.score.length)
}

const renderScoresByHistory = user => {
  historyElement.innerHTML = user.score
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)
    .map(createUserScoreRow)
    .join('')
}

const renderByBestScores = user => {
  bestScoresElement.innerHTML = user.score
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(createUserScoreRow)
    .join('')
}

getProfile()
  .then(user => {
    if (user.score.length === 0) {
      myScoresElement.style.display = 'none'
      noScoreElement.innerHTML = `You have no scores yet`
      return
    }
    renderScoresByHistory(user)
    renderByBestScores(user)
    bestScoreElement.innerHTML = `${user.bestScore}`
    scoresAverrage(user)
    socksAverrage(user)
  })

// START
getUser().then(user => {
  console.log(user)

  if (!user.username) {
    window.location = '/sign-in.html'
  }
})
