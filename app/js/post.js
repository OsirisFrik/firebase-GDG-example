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
var i = 0;
function getPosts(data) {
  var postKey = data.key;
  var post = data.val();
  var html;
  var option;
  var menu = '';
  post.post = post.post.replace(/\r?\n/g, '<br />');
  if (post.userId == userData.uid) {
    menu = '<a data-activates="more-post' + postKey + '" id="menu' + postKey + '" class="dropdown-button" href="#"><i class="material-icons right" id="more-post">more_vert</i></a>';
    option = '<ul id="more-post' + postKey + '" class="dropdown-content options"><li><a onclick="deletePost(\''+postKey+'\')"><i class="material-icons">delete</i>&nbsp; Delete</a></li></ul>';
    document.getElementById('op').innerHTML += option;
  }

  if (post.image) {
    html = '<div class="col s12 l8 offset-l2" id="' + postKey + '"><div class="card"><div class="row user-post"><img src="' + post.userPhoto + '" class="avatar-post circle"><p class="userName-post"><a href="/profile.html#'+post.userName+'">' + post.userName + '</a></p>'+menu+'</div><div class="row post"><p class="card-content post-content">' + post.post + '</p>' + '<img src="' + post.image + '" class="post-img"></div></div>';
  } else {
    html = '<div class="col s12 l8 offset-l2" id="' + postKey + '"><div class="card"><div class="row user-post"><img src="' + post.userPhoto + '" class="avatar-post circle"><p class="userName-post"><a href="/profile.html#'+post.userName+'">' + post.userName + '</a></p>'+menu+'</div><div class="row post"><p class="card-content post-content">' + post.post + '</p></div></div>';
  }

  if (lastPost[0]) {
    var last = document.getElementById(lastPost[lastPost.length - 1]);
    var parent = last.parentNode;
    var helper = document.createElement('span');
    helper.innerHTML = html;
    parent.insertBefore(helper.firstChild, last);
  } else {
    document.getElementById('posts').innerHTML = html;
  }
  lastPost.push(postKey);
  var id = '#menu'+postKey;
  $(id).dropdown({
    belowOrigin: true
  });
  //document.getElementById('op').innerHTML += option;
}

function removePost(data) {
  var index = lastPost.indexOf(data.key, 1);

  if (index > -1) {
    lastPost.splice(index, 1);
    console.log(lastPost);
  }
  document.getElementById(data.key).remove();
}

function deletePost(postKey) {
  database.ref('post/'+postKey).remove().then(function () {
    database.ref('users/'+userData.uid).once('value', function (data) {
      data = data.val();
      for (var key in data.posts) {
        if (data.posts[key] == postKey) {
          database.ref('users/'+userData.uid+'/posts/'+key).remove();
        }
      }
    });
  });
}
