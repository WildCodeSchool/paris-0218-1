/* global FormData */

import { sendNewProfile, getProfile } from './api.js'
import { createProfile, editProfile } from './components/profile-information.js'

const sectionInfoProfile = document.getElementById('info_profil')
const sectionEditProfile = document.getElementById('edit_profil')

const showProfile = user => {
  sectionInfoProfile.innerHTML = createProfile(user)
}

const updateProfile = user => {
  sectionEditProfile.innerHTML = editProfile(user)
}

sectionEditProfile.style.display = 'none'
sectionInfoProfile.style.display = 'block'

const start = async () => {
  // get profile
  await getProfile()
    .then(user => {
      showProfile(user)
      updateProfile(user)
    })

  // read profile
  const editButton = document.getElementById('edit_button')
  editButton.addEventListener('click', event => {
    event.preventDefault()
    console.log('clic')
    sectionInfoProfile.style.display = 'none'
    sectionEditProfile.style.display = 'block'
  })

  const cancelButton = document.getElementById('cancel_button')
  cancelButton.addEventListener('click', event => {
    getProfile()
      .then(user => {
        showProfile(user)
        sectionInfoProfile.style.display = 'block'
        sectionEditProfile.style.display = 'none'
        start()
      })
  })

  const formProfile = document.getElementById('edit_form')
  const messageElement = document.getElementById('error_message')
  const handleErrors = res => {
    messageElement.innerHTML = res.error || ''
  }

  // edit profile
  formProfile.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(formProfile)

    // handle password update
    const credentials = {
      password: formData.get('password'),
      repeatPassword: formData.get('repeat_password')
    }

    if (credentials.password !== credentials.repeatPassword) {
      messageElement.innerHTML = 'Error with passwords'
      return
    }

    sendNewProfile(formData)
      .then(res => {
        console.log(res)
        if (res.error) {
          return handleErrors(res)
        }
        getProfile()
          .then(user => {
            showProfile(user)
            sectionInfoProfile.style.display = 'block'
            sectionEditProfile.style.display = 'none'
            start()
          })
          .catch(err => console.log('error ' + err.message))
      })
  })
}

start()
