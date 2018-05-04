export const createProfile = user => `
  <h1>My profile</h1>
  <br>
  <br>
  <div class="bloc1">
  <center><img class="img_profile" src="http://localhost:3000/images/${user.avatar}"></center>
  </div>
  <div class="bloc2">
  <span class="info" id="lastName">First name: <span class="info_user">${user.firstName}</span></span>
  <br>
  <span class="info" id="firstName">Last name: <span class="info_user">${user.lastName}</span></span>
  <br>  
  <span class="info" id="email">Username: <span class="info_user">${user.username}</span></span>
  <br>    
  <span class="info" id="email">Email: <span class="info_user">${user.email}</span></span>
  <br>    
  <span class="info" id="campus">Campus: <span class="info_user">${user.campus}</span></span>
  <br>    
  <span class="info" id="wild_side">Wild side: <span class="info_user">${user.wildside}</span></span>
  <br>
  <br>
  <button id="edit_button" class="btn_edit">Edit</button>
  </div>
  <br>
  <br>

`

export const editProfile = user => `
  <h1>Edit my profile</h1>
  <br>
  <br>
  <form id="edit_form">
  <div class="bloc1">
  <center><label for="edit_profile_picture">Profile picture:</label></center>
  <center><img class="img_profile" src="http://localhost:3000/images/${user.avatar}"></center>
  <br>
    <center><input class="uploadfile" type="file" name="avatar"></center>
  <br/>
  </div>
  <div class="bloc2">
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
    </label>
    </div>
    <div class="btns">
    <br>
    <br>
    <button id="cancel_button" class="btn_editcancel">Annuler</button>
    <input type="submit" value="Save update" class="btn_edit">
    </div>
  </form>
  <div id="error_message" style="color: red"></div>
`
