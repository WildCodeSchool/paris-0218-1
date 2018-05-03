/* global FormData */

import { signUp } from './api.js'

const signUpForm = document.getElementById('sign-up-form')
const messageElement = document.getElementById('error_message')
const handleErrors = res => {
  messageElement.innerHTML = res.error || ''
}

signUpForm.addEventListener('submit', event => {
  event.preventDefault()

  const formData = new FormData(event.target)

  const credentials = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    campus: formData.get('campus')
  }

  const repeatPassword = formData.get('repeat_password')

  if (credentials.password !== repeatPassword) {
    messageElement.innerHTML = 'Error with passwords'
    return
  }

  signUp(credentials)
    .then(handleErrors)
})
