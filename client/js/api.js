/* global fetch */

import { api } from './config.js'

const postJson = (url, body) => fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  })

export const getScores = () => {
  return fetch(`${api.host}:${api.port}/scores`, { 'credentials': 'include' })
    .then(res => res.json())
}

export const sendScore = (userId, score) => {
  const body = {
    userId: userId,
    score: Math.round(score)
  }

  return postJson(`${api.host}:${api.port}/addscore`, body)
}

export const getUser = () => fetch('http://localhost:3000/', { 'credentials': 'include' })
  .then(res => res.json())


// Authentication

export const signUp = credentials => {
  return fetch('http://localhost:3000/sign-up', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
}

export const signIn = credentials => {
  return fetch('http://localhost:3000/sign-in', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    'credentials': 'include',
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
}

export const signOut = () => {
  return fetch('http://localhost:3000/sign-out', { 'credentials': 'include' })
    .then(res => res.json())
}
