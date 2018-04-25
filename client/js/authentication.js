/* global fetch */

const authForm = document.getElementById('auth_form')
authForm.addEventListener('submit', event => {
  event.preventDefault()

  const credentials = {
    username: document.getElementById('input_username').value,
    email: document.getElementById('input_email').value,
    password: document.getElementById('input_password').value,
  }

  // console.log(credentials)

  const repeatPassword = document.getElementById('input_repeat_password').value

  if (credentials.password === repeatPassword) {
    fetch('http://localhost:3000/authentication', {
      method: 'post',
      body: JSON.stringify(credentials)
    })
    .then(res => console.log(res))
  } else {
    console.log('Error with passwords')
  }
})
