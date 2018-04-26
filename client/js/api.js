/* global fetch */

import { api } from './config.js'

const postJson = (url, body) => fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export const getScores = () => {
  return fetch(`${api.host}:${api.port}/scores`)
    .then(res => res.json())
}

export const sendScore = (playerId, score) => {
  const body = {
    playerId: playerId,
    score: Math.round(score)
  }

  return postJson(`${api.host}:${api.port}/addscore`, body)
}

export const getUser = () => fetch('http://localhost:3000/', { 'credentials': 'include' })
  .then(res => res.json())
