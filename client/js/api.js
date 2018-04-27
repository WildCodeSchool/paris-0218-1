/* global fetch */

import { api } from './config.js'

export const getScores = () => {
  return fetch(`${api.host}:${api.port}/scores`)
    .then(res => res.json())
}

export const sendScore = (playerId, score) => {
  const body = {
    playerId: playerId,
    score: Math.round(score)
  }
  return fetch(`${api.host}:${api.port}/addScore`, {
    method: 'post',
    body: JSON.stringify(body) // on l'encode en string JSON
  })
}
