let loggedInUsername = '';
let userimg = '';

function setLoggedInUsername(username) {
  loggedInUsername = username;
}

function getLoggedInUsername() {
  return loggedInUsername;
}

function setuserimg(img) {
  userimg = img;
}

function getuserimg() {
  return userimg;
}

module.exports = {
  setLoggedInUsername,
  getLoggedInUsername,
  setuserimg,
  getuserimg,
};
