import { createUserScoreRow } from './components/user-scores.js'
import { getProfile } from './api.js'

const myScoresElement = document.getElementById('my-scores')
const noScoreElement = document.getElementById('no-score')
const bestScoreElement = document.getElementById('my-best-score')
const scoreAverrageElement = document.getElementById('my-score-averrage')
const socksAverrageElement = document.getElementById('my-socks-averrage')
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
