// // export const createNavbar = () => `
// // // <div class='container'>
// // //       <div class='navbar'>
// // //           <ul>
// // //             <div>
// // //               <li><a class="logo"><img src="img/logo_wildeer.png" width="15%"></a></li>
// // //             </div>
// // //         <div>
// // //               <li><a class="active" href="#home">Home</a></li>
// // //               <li><a href="#About">About</a></li>
// // //               <li><a href="#contact">Contact</a></li>
// // //           </ul>
// // //         </div>
// // //       </div>
// // // </div>
// `

export const createNavbar = () => `<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand"><img src="img/logo_wildeer_white.png" width="20%"></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="index.html">General ranking<span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Username
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="profile.html">My profile</a>
          <a class="dropdown-item" href="sign-in.html">My scores</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Log out</a>
        </div>
      </li>
    </ul>
  </div>
</nav>`
