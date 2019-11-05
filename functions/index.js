const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth')

const { getAllPosts, createOnePost } = require('./handlers/posts');
const { login } = require('./handlers/users');

// Posts Routes

app.get('/posts', getAllPosts);
app.post("/post", FBAuth, createOnePost);

// Login Route

app.post('/login', login)

exports.api = functions.https.onRequest(app)