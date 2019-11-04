const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

// GET ALL posts route

app.get('/posts', (req,res) => {
    admin
      .firestore()
      .collection("posts")
      .get()
      .then(data => {
        let posts = [];
        data.forEach(doc => {
          posts.push({
            postId: doc.id,
            name: doc.data().name,
            images: doc.data().images,
            link: doc.data().link,
            info: doc.data().info,
            price: doc.data().price,
            itemCategory:doc.data().itemCategory,
            available: doc.data().available,
            highEnd: doc.data().highEnd,
            createdAt: doc.data().createdAt
          });
        });
        return res.json(posts);
      })
      .catch(err => console.error(err));
});

// CREATE Post route

app.post('/post', (req, res) => {
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

exports.api = functions.https.onRequest(app)