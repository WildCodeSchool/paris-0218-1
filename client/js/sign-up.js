/* global fetch */

const authForm = document.getElementById('auth_form')
authForm.addEventListener('submit', event => {
  event.preventDefault()

  // const formData = new FormData(event.target)
  //
  // const credentials = {
  //   username: formData.get('username'),
  //   email: formData.get('email'),
  //   password: formData.get('password')
  // }

  const credentials = {
    username: document.getElementById('input_username').value,
    email: document.getElementById('input_email').value,
    password: document.getElementById('input_password').value,
  }

  const repeatPassword = document.getElementById('input_repeat_password').value

  if (credentials.password === repeatPassword) {
    fetch('http://localhost:3000/sign-up', {
      method: 'post',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => console.log(res))
  } else {
    console.log('Error with passwords')
  }
})
