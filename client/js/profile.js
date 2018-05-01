import { getUser, sendNewProfile, getProfile } from './api.js'
import { createProfile, editProfile } from './components/profile-information.js'

const sectionInfoProfile = document.getElementById('info_profil')
const sectionEditProfile = document.getElementById('edit_profil')

const showProfile = user => sectionInfoProfile.innerHTML = createProfile(user)
const updateProfile = user => sectionEditProfile.innerHTML = editProfile(user)


getProfile()
  .then(user => {
  showProfile(user)
  updateProfile(user)

  const formProfile = document.getElementById('edit_form')
  formProfile.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(formProfile)

    // handle password update
    const credentials = {
      password: formData.get('password'),
      repeatPassword: formData.get('repeat_password')
    }
    sendNewProfile(formData)
      .then(() => {
        getProfile()
          .then(user => showProfile(user))
      .catch(err => console.log('error ' + err.message))
      })

    .catch(err => console.log('error ' + err.message))
    })
  })

// getProfile()
//   .then(user => showProfile(user))
//   .then(() => {
//     const editButton = document.getElementById('edit')
//     console.log(`yo`);
//     editButton.addEventListener('clic', event => {
//       event.preventDefault()
//       console.log('clic')
//     })
//   })
