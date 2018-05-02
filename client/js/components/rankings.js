export const createBestPlayerInsert = user => `
  <h2>Best player</h2>
  <img src="http://localhost:3000/images/${user.avatar}">
  <p>${user.username}</p>
  <p>${user.campus}</p>
  <p>${user.bestScore}</p>
  <p>${user.wildside}</p>
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

// a faire
// export const createCampusInsert = user => `
//   <img src="http://localhost:3000/images/${user.avatar}">
//   <p>${user.campus}</p>
// `
