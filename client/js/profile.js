import { createProfile, editProfile } from './components/profile-information.js'

const sectionInfoProfile = document.getElementById('info_profil')
const sectionEditProfile = document.getElementById('edit_profil')

const showProfile = user => sectionInfoProfile.innerHTML = createProfile(user)
const updateProfile = user => sectionEditProfile.innerHTML = editProfile(user)


getProfile()
  .then(user => {
  showProfile(user)
  updateProfile(user)
  })
