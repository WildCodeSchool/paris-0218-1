/* global
  fetch
*/

import { sendScore } from './api.js'

const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  const playerId = document.getElementById('inputName').value
  const score = Number(document.getElementById('inputScore').value)

  sendScore(playerId, score)
})
