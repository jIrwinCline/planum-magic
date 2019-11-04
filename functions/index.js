const functions = require('firebase-functions');


const app = require('express')();

const {getAllPosts } = require('./handlers/posts');

var firebaseConfig = {
  apiKey: "AIzaSyDMLR-QTpzz8WDMrAS4A1j9UJj8Ea_bXfM",
  authDomain: "planum-magic.firebaseapp.com",
  databaseURL: "https://planum-magic.firebaseio.com",
  projectId: "planum-magic",
  storageBucket: "planum-magic.appspot.com",
  messagingSenderId: "115892163015",
  appId: "1:115892163015:web:d44104c478bb31447409e2",
  measurementId: "G-XY1RV01RWB"
};

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig);



//helper functions

const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

// Posts Routes

app.get('/posts', getAllPosts);


const FBAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('no token found')
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        // req.user = decodedToken;
        // return db.collection('users')
        // .where('userId', '==', req.user.uid)
        // .limit(1)
        // .get()
        if(!decodedToken){
            console.error("Error while verifying the token", err);
            return res.status(403).json(err);
        }
        return next();
    })
    // .then(data => {
    //     req.user.handle = data.docs[0].data().handle;
    //     return next();
    // })
    .catch(err => {
        console.error('Error while verifying the token', err);
        return res.status(403).json(err)
    })
}
// CREATE Post route

app.post('/post', FBAuth, (req, res) => {
    const newPost = {
    name: req.body.name,
    images: req.body.images,
    link: req.body.link,
    info: req.body.info,
    price: req.body.price,
    itemCategory: req.body.itemCategory,
    available: req.body.available,
    highEnd: req.body.highEnd,
    createdAt: new Date().toISOString()
    };
  db
    .collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// Login Route

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors.email = "Must not be empty";
    if(isEmpty(user.password)) errors.password = "Must not be empty";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Wrong credentials, please try again' })
        } else return res.stattus(500).json({error: err.code})
    })
})

exports.api = functions.https.onRequest(app)