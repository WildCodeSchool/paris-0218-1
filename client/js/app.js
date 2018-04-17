/* global
  fetch
*/

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

const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  const body = {
    userName: document.getElementById('inputName').value,
    bestScore: Number(document.getElementById('inputScore').value)
  }
  console.log(body.userName)
  fetch('http://localhost:3000/addscore', {
    method: 'post',
    body: JSON.stringify(body) // on l'encode en string JSON
  }).then(/* ... */)
})
