const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// GET ALL posts route

exports.getPosts = functions.https.onRequest((req, res) => {
  admin.firestore().collection("posts")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push(doc.data());
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
});

// CREATE Post route

exports.createPost = functions.https.onRequest((req, res) => {
  
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
  admin
    .firestore()
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

// const newPost = {
//   name: req.body.name,
//   images: req.body.images,
//   link: req.body.link,
//   info: req.body.info,
//   price: req.body.price,
//   itemCategory: req.body.itemCategory,
//   available: req.body.available,
//   highEnd: req.body.highEnd,
//   createdAt: new Date().toISOString()
// };