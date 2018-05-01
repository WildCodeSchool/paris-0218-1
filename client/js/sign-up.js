import { signUp } from './api.js'

const signUpForm = document.getElementById('sign-up-form')
const messageElement = document.getElementById('error_message')
const handleErrors = res => messageElement.innerHTML = res.error || ''

signUpForm.addEventListener('submit', event => {
  event.preventDefault()

  const formData = new FormData(event.target)

  const credentials = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password')
  }

  const repeatPassword = formData.get('repeat_password')

  if (credentials.password !== repeatPassword) {
    return messageElement.innerHTML = 'Error with passwords'
  }

  signUp(credentials)
    .then(handleErrors)
})
