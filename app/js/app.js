'use strict'

var userData;
var database = firebase.database();
var usersDb = database.ref('users');
var storageRef = firebase.storage().ref();
// Init Auth check
function initApp() {
  var location = window.location.pathname;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // si el usuario esta logeado
      if (location == '/login.html') {
        window.location.pathname = '/'
      } else if (location == '/logout.html') {
        logOut();
      }
      usersDb.once('value', function(data) {
        var users = data.val();
        if (!users[user.uid]) {
          usersDb.update({
            [user.uid]: {
              userName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            }
          });
        }
        if (!users[user.uid].userName) {
          document.getElementById('userName').innerText = userData.displayName;
          $('#modal-username').modal('open');
        } else {
          user.userName = users[user.uid].userName;
          document.getElementById('userName').innerText = userData.userName;
        }
      });
      userData = user;
      document.getElementById('userAvatar').src = userData.photoURL;
    } else {
      // si el usuario no esta logeado
      if (location != '/login.html') {
        window.location.pathname = '/login.html'
      }
    }
  });
}

// logOut system
function logOut() {
  firebase.auth().signOut().then(function() {
    window.location.pathname = '/login.html'
  }).catch(function(error) {
    // An error happened.
  });
}

function userName() {
  var newUserName = document.getElementById('newUserName').value;

  checkUserName(newUserName).then(function (result) {
    if (result) {
      $('#modal-username').modal('close');
      initApp();
    }
  }, function (err) {
    Materialize.toast(err, 4000)
  });
}

function checkUserName(newUserName) {
  var userNameFree = true;
  return new Promise(function(resolve, reject) {
    usersDb.once('value', function (data) {
      var users = data.val();
      for (var id in users) {
        if (users[id].userName == newUserName) {
          userNameFree = false;
          reject('Nombre de usuario ya existe');
          break;
        }
      }
      if (userNameFree) {
        database.ref('users/'+userData.uid).update({userName: newUserName}).then(function (response) {
          resolve(true);
        }).catch(function (err) {
          resolve();
        });
      }
    });
  });
}


window.onload = function() {
  initApp();
}
