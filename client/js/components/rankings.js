export const createBestPlayerInsert = user => `
  <h2>Best player</h2>
  <div class="row">
    <div class="col-12 col-md-4 insert-avatar">
      <img class="insert-img" src="http://localhost:3000/images/${user.avatar}">
    </div>
    <div class="col-12 col-md-8 insert-info">
      <h3>${user.username}</h3>
      <p>From ${user.campus}</p>
      <p>Best score ever : ${user.bestScore}</p>
      <p>Wild side : ${user.wildside}</p>
    </div>
  </div>
`

export const createCampusInsert = campus => `
  <div class="row">
    <div class="col-12 col-md-4 insert-avatar">
      <img class="insert-img" src="http://localhost:3000/images/campus/${campus.name.replace(/ /, '-').replace(/é/, 'e')}.jpg">
    </div>
    <div class="col-12 col-md-8 insert-info">
      <h3>${campus.name}</h3>
      <p>Score : ${campus.score}</p>
      <p>Students : ${campus.nbStudents}</p>
    </div>
  </div>
`

export const createAllScoreRow = user => `
  <tr>
    <td>${user.position}</td>
    <td><img src="http://localhost:3000/images/${user.avatar}" width="30px" heigth="30px"></td>
    <td>${user.username}</td>
    <td>${user.bestScore}</td>
    <td>${user.campus}</td>
  </tr>
`

export const createCampusRaw = campus => `
  <tr>
    <td>${campus.position}</td>
    <td><img src="http://localhost:3000/images/campus/${campus.name.replace(/ /, '-').replace(/é/, 'e')}.jpg" width="30px" heigth="30px"></td>
    <td>${campus.name}</td>
    <td>${campus.score}</td>
    <td>${campus.nbStudents}</td>
  </tr>
`
