'use strict'

function newPost() {
  document.getElementById('nePost').className += ' loading disabled';
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
    document.getElementById('nePost').className = 'mini ui green button';
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
    document.getElementById('nePost').className = 'mini ui green button';
  });
}

function getPosts(data) {
  var postKey = data.key;
  var post = data.val();
  var html;
  post.post = post.post.replace(/\r?\n/g, '<br />');
  if (post.image) {
    html = '<div class="row" id="' + postKey + '"><div class="eight wide column" id="">' + '<div class="ui segment">' + '<div class="row">' + '<img src="' + post.userPhoto + '" class="ui avatar image">' + '<span>' + post.userName + '</span>' + '</div>' + '<div class="row post">' + '<span>' + post.post + '</span>' + '<img src="' + post.image + '" class="post-img">' + '</div>' + '</div>' + '</div>';
  } else {
    html = '<div class="row" id="' + postKey + '"><div class="eight wide column" id="">' + '<div class="ui segment">' + '<div class="row">' + '<img src="' + post.userPhoto + '" class="ui avatar image">' + '<span>' + post.userName + '</span>' + '</div>' + '<div class="row post">' + '<span>' + post.post + '</span>' + '</div>' + '</div>' + '</div>';
  }

  if (lastPost) {
    var last = document.getElementById(lastPost);
    var parent = last.parentNode;
    var helper = document.createElement('span');
    helper.innerHTML = html;
    parent.insertBefore(helper.firstChild, last);
  } else {
    document.getElementById('posts').innerHTML = html;
  }
  lastPost = postKey
}
