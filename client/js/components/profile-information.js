export const createProfile = user => `
  <h1>My profile</h1>
  <p class="info" id="lastName">First name: ${user.firstName}</p>
  <p class="info" id="firstName">Last name: ${user.lastName}</p>
  <p class="info" id="email">Username: ${user.username}</p>
  <p class="info" id="email">Email: ${user.email}</p>
  <p class="info" id="campus">Campus: ${user.campus}</p>
  <p class="info" id="wild_side">Wild side: ${user.wildside}</p>
  <img src="http://localhost:3000/images/${user.avatar}">
  <button id="edit_button">Edit</button>
`

export const editProfile = user => `
  <h1>Edit my profile</h1>
  <form id="edit_form">
    <label for="edit_firstname">First name:
      <input id="edit_firstname" type="text" placeholder="${user.firstName}" name="firstName">
    </label><br/>
    <label for="edit_lastname">Last name:
      <input id="edit_lastname" type="text" placeholder="${user.lastName}" name="lastName">
    </label><br/>
    <label for="edit_username">Username:
      <input id="edit_username" type="text" placeholder="${user.username}" name="username">
    </label><br/>
    <label for="edit_campus">Campus:
      <select id="campus" name="campus">
        <option value="${user.campus}" selected>${user.campus}</option>
        <option value="Paris">Paris</option>
        <option value="Lyon">Lyon</option>
        <option value="La Loupe">La Loupe</option>
        <option value="Biarritz">Biarritz</option>
        <option value="Reims">Reims</option>
      </select>
    </label><br/>
    <label for="edit_email">Email:
      <input id="edit_email" type="email" placeholder="${user.email}" name="email">
    </label><br/>
    <label for="edit_password">Password:
      <input id="edit_password" type="password" placeholder="New password..." name="password">
    </label><br/>
    <label for="edit_repeat_password">Repeat password:
      <input id="edit_repeat_password" type="password" placeholder="Repeat new password..." name="repeat_password">
    </label><br/>
    <label for="edit_wild_side">Wild side:
      <input id="edit_wild_side" type="text" placeholder="${user.wildside}" name="wildside">
    </label><br/>
    <label for="edit_profile_picture">Profile picture:
      <img src="http://localhost:3000/images/${user.avatar}">
      <input type="file" name="avatar">
    </label><br/>
    <button id="cancel_button">Annuler</button>
    <input type="submit" value="Save update">
  </form>
  <div id="error_message" style="color: red"></div>
`
