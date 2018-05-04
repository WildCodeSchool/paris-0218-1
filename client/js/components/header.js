import { getProfile, signOut } from '../api.js'

const headerElement = document.getElementById('menu')

const createHeader = user => `
  <div id="wildeerNavbar">
      <div id="wildeerLogo">
          <a href="index.html"><img src="http://localhost:3000/images/logo_wildeer_white.png"></a>
      </div>
      <div id="right_nav">
        <div id="general_ranking">
            <a href="/general-ranking.html"><img id="ranking-icon" src="http://localhost:3000/images/ranking.png" width="30px" heigth="30px">Ranking</a>
        </div>
        <div id="userBtn">
            <a href="#" title="User button" id="openNavBtn"><img src="http://localhost:3000/images/${user.avatar}" width="30px" heigth="30px">${user.username}</a>
        </div>
      </div>
      <div id="userNav" class="overlay">
          <a href="javascript:void(0)" id="closeNavBtn">&times;</a>
          <div class="overlay-content">
            <p id="Hello">Wesh ${user.username}</p>
            <a href="/profile.html">My profile</a>
            <a href="/my-scores.html">My scores</a>
            <p id="get-out">Logout</p>
          </div>
      </div>
  </div>
`

getProfile()
  .then(user => {
    headerElement.innerHTML = createHeader(user)
  })
  .then(() => {
    // Navigation
    const openNav = () => {
      document.getElementById('userNav').style.width = '250px'
    }
    const closeNav = () => {
      document.getElementById('userNav').style.width = '0%'
    }

    const openNavElement = document.getElementById('openNavBtn')
    openNavElement.addEventListener('click', openNav)

    const closeNavElement = document.getElementById('closeNavBtn')
    closeNavElement.addEventListener('click', closeNav)

    const signOutBtn = document.getElementById('get-out')
    signOutBtn.addEventListener('click', event => {
      event.preventDefault()

      signOut().then(() => {
        window.location = '/sign-in.html'
      })
    })
  })
