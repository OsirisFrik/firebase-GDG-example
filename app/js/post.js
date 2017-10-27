'use strict'

var lastPost = [];

firebase.database().ref('post').orderByChild('timestamp').on('child_added', getPosts);
firebase.database().ref('post').orderByChild('timestamp').on('child_removed', removePost);

function newPost() {
  document.getElementById('nePost').className += ' disabled';
  var file = document.getElementById('upload').files[0];
  var post = document.getElementById('post').value;

  if (file) {
    storageRef.child('images/' + file.name).put(file).then(function(response) {
      createPost(post, response.downloadURL);
    }).catch(function(err) {
      console.log(err);
    })
  } else if (post) {
    createPost(post, null);
  } else {
    alert('NO HAY NADA QUE POSTEAR');
    document.getElementById('nePost').className = 'waves-effect waves-light btn right';
  }
}

function createPost(post, url) {
  var postData = {
    userId: userData.uid,
    userName: userData.userName,
    userPhoto: userData.photoURL,
    post: post,
    image: url,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref('post').push(postData).then(function(response) {
    database.ref('users/' + userData.uid + '/posts').push(response.key);
    document.getElementById('upload').value = null;
    document.getElementById('post').value = null;
    document.getElementById('nePost').className = 'waves-effect waves-light btn right';
  });
}

function getPosts(data) {
  var postKey = data.key;
  var post = data.val();
  var html;
  post.post = post.post.replace(/\r?\n/g, '<br />');
  if (post.image) {
    html = '<div class="col s12 l8 offset-l2" id="' + postKey + '">' + '<div class="card">' + '<div class="row user-post">' + '<img src="' + post.userPhoto + '" class="avatar-post circle">' + '<p class="userName-post">' + post.userName + '</p>' + '</div>' + '<div class="row post">' + '<p class="card-content post-content">' + post.post + '</p>' + '<img src="' + post.image + '" class="post-img">' + '</div>' + '</div>';
  } else {
    html = '<div class="col s12 l8 offset-l2" id="' + postKey + '">' + '<div class="card">' + '<div class="row user-post">' + '<img src="' + post.userPhoto + '" class="avatar-post circle">' + '<p class="userName-post">' + post.userName + '</p>' + '</div>' + '<div class="row post">' + '<p class="card-content post-content">' + post.post + '</p>' + '</div>' + '</div>';
  }

  if (lastPost[0]) {
    var last = document.getElementById(lastPost[lastPost.length-1]);
    var parent = last.parentNode;
    var helper = document.createElement('span');
    helper.innerHTML = html;
    parent.insertBefore(helper.firstChild, last);
  } else {
    document.getElementById('posts').innerHTML = html;
  }
  lastPost.push(postKey);
  console.log(lastPost);
}

function removePost(data) {
  var index = lastPost.indexOf(data.key, 1);

  if (index > -1) {
    lastPost.splice(index, 1);
    console.log(lastPost);
  }
  document.getElementById(data.key).remove();
}
