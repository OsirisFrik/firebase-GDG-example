# firebase-GDG-example
Ejemplo de aplicación con firebase full js

## Requerimientos

### Firebase keys
`` js/key.js ``
```
// Initialize Firebase
  var config = {
    apiKey: "YOU API KEY",
    authDomain: "YOU AUTH DOMAIN",
    databaseURL: "YOU DATABASE URL",
    projectId: "YOU PROJECT ID",
    storageBucket: "YOU STORAGE BUCKET",
    messagingSenderId: "YU MESSAGING SENDER ID"
  };
  firebase.initializeApp(config);
```

### http-server

``$ npm install -g http-server ``

### Validator-js

``$ cd app/ && bower install ``

## Iniciar

``$ http-server app/ -o -p <port> ``
