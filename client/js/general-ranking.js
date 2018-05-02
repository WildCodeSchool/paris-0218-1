import { createBestPlayerInsert, createAllScoreRow } from './components/rankings.js'
import { getAllScores } from './api.js'


const bestPlayerElement = document.getElementById('best-player')
const allScoresElement = document.getElementById('all_scores_list')

const getBestPlayer = users => users
  .slice(0, 1)
  .map(user => bestPlayerElement.innerHTML = createBestPlayerInsert(user))

const getGeneralRanking = users => {
  const bestToWorst = users.sort((a, b) => b.bestScore - a.bestScore)
  const allScoresArr = []
  for (let i = 0 ; i < bestToWorst.length ; i++) {
    const user = bestToWorst[i]
    user.position = i + 1
    allScoresArr.push(createAllScoreRow(user))
  }
  allScoresElement.innerHTML = allScoresArr.join('')
}

getAllScores()
  .then(users => {
    getGeneralRanking(users)
    getBestPlayer(users)
  })
