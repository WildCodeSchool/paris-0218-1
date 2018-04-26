/* global fetch */

const signInForm = document.getElementById('sign_in_form')
const signOutForm = document.getElementById('sign_out_form')
const messageElement = document.getElementById('error_message')
const authElement = document.getElementById('auth')

const handleAuth = res => {
  const username = res.username

  authElement.innerHTML = username ? `Hi ${username}` : 'Not connected, please login'

  signInForm.style.display = username ? 'none' : 'block'
  signOutForm.style.display = username ? 'block' : 'none'

  // handle errors
  messageElement.innerHTML = res.error || ''

  return res
}

signInForm.addEventListener('submit', event => {
  event.preventDefault()

  const formData = new FormData(event.target)

  const credentials = {
    username: formData.get('username'),
    password: formData.get('password')
  }

  fetch('http://localhost:3000/sign-in', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    'credentials': 'include', // send user credentials (cookies, basic http auth...)
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(handleAuth)
  .then(res => {
    if (res.username) {
      window.location = '/'
    }
  })
})

signOutForm.addEventListener('submit', event => {
  event.preventDefault()

  fetch('http://localhost:3000/sign-out', { 'credentials': 'include' })
    .then(res => res.json())
    .then(handleAuth)
})


fetch('http://localhost:3000/', { 'credentials': 'include' })
  .then(res => res.json())
  .then(handleAuth)
