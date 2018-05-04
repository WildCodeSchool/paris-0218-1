const createHeader = () => `
  <div id="wildeerNavbar">
      <div id="wildeerLogo">
          <a href="index.html"><img src="http://localhost:3000/images/logo_wildeer_white.png"></a>
      </div>
  </div>
`

const headerElement = document.getElementById('menu')
headerElement.innerHTML = createHeader()
