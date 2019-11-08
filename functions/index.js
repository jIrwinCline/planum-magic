const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth')

const { getAllPosts, createOnePost, getThePost, deletePost } = require('./handlers/posts');
const { login } = require('./handlers/users');

// Posts Routes

app.get('/posts', getAllPosts);
app.get('/post/:postId', getThePost);
app.post("/post", FBAuth, createOnePost);
app.delete('/post/:postId', FBAuth, deletePost);

//TODO delete post

//TODO update post

// Login Route

app.post('/login', login)

exports.api = functions.https.onRequest(app)