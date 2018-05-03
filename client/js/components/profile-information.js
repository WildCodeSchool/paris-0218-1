export const createProfile = user => `
  <h1 id="myProfile">My profile</h1>
    <table id="tableau">
        <tr>
      <td class="info" id="firstName">First name:</td>
      <td class="infoUser" id="firstName">${user.firstName}</td>
        </tr>
        <tr>
      <td class="info" id="lastName">Last name:</td>
      <td class="infoUser" id="lastName">${user.lastName}</td>
        </tr>
        <tr>
      <td class="info" id="username">Username:</td>
      <td class="infoUser" id="username">${user.username}</td>
        </tr>
        <tr>
      <td class="info" id="email">Email:</td>
      <td class="infoUser" id="email">${user.email}</td>
        </tr>
        <tr>
      <td class="info" id="campus">Campus:</td>
      <td class="infoUser" id="email">${user.campus}</td>
        </tr>
        <tr>
      <td class="info" id="wild_side">Wild side:</td>
      <td class="infoUser" id="email">${user.wildside}</td>
        </tr>
        <tr>
      <td class="info" id="avatar">Avatar:</td>
      <td class="infoUser" id="avatar"><img id="imgAvatar" src="http://localhost:3000/images/${user.avatar}"></td>
      </tr>
    </table>

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
        <option value="Bordeaux">Bordeaux</option>
        <option value="Orléans">Orléans</option>
        <option value="Toulouse">Toulouse</option>
        <option value="Lille">Lille</option>
        <option value="Strasbourg">Strasbourg</option>
        <option value="Marseille">Marseille</option>
        <option value="Tours">Tours</option>
        <option value="Bruxelles">Bruxelles</option>
        <option value="Nantes">Nantes</option>
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
