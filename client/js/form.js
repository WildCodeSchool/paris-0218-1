import { sendScore } from './api.js'

const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  const playerId = document.getElementById('input_name').value
  const score = Number(document.getElementById('input_score').value)

  sendScore(playerId, score)
})
