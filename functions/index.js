const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth')

const cors = require('cors');
app.use(cors());


const { getAllPosts, createOnePost, getThePost, deletePost, uploadImage } = require('./handlers/posts');
const { login } = require('./handlers/users');


// app.get("/", function(req, res) {
//   res.render(path.join(__dirname + "/build/index.html"));
// });
// app.get("/login", function(req, res) {
//   res.render(path.join(__dirname + "/build/index.html"));
// });

// Posts Routes

app.get('/posts', getAllPosts);
app.get('/post/:postId', getThePost);
app.post("/post", FBAuth, createOnePost);
app.delete('/post/:postId', FBAuth, deletePost);
app.post('/post/:postId/image', FBAuth, uploadImage);
//TODO update post

// Login Route
app.post('/login', login)

exports.api = functions.https.onRequest(app)