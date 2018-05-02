import { signUp } from './api.js'

const signUpForm = document.getElementById('sign-up-form')

// Print error customer side
const messageElement = document.getElementById('errorMessage')

const messageFail = () =>

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
      messageElement.innerHTML = 'Salut'
    }

  signUp(credentials)
  .then(res => console.log(res))
})
