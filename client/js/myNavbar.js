import { createNavbar } from './components/navbar.js'

const sectionNavbar = document.getElementById('menu')

const showNavbar = () => {
  sectionNavbar.innerHTML = createNavbar()
}

showNavbar()
