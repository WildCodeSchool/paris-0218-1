/* global fetch */

import { api } from './config.js'

export const getScores = () => {
  return fetch(`${api.host}:${api.port}/scores`)
    .then(res => res.json())
}

export const sendScore = (playerId, score, nbSocks) => {
  const body = {
    playerId: playerId,
    score: Math.round(score),
    nbSocks: nbSocks
  }

  return fetch(`${api.host}:${api.port}/addscore`, {
    method: 'post',
    body: JSON.stringify(body) // on l'encode en string JSON
  })
}
