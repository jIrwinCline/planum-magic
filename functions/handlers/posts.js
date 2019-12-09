const { admin, db } = require('../util/admin');
const config = require("../util/config");

exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
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
          itemCategory: doc.data().itemCategory,
          available: doc.data().available,
          highEnd: doc.data().highEnd,
          featured: doc.data().featured,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
};

exports.getThePost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not Found" });
      }
      postData = doc.data();
      // postData.postId = doc.id;
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.createOnePost = (req, res) => {
  if (req.body.name.trim() === "") {
    return res.status(400).json({ body: "name must not be empty" });
  }
  if (req.body.images.trim() === "") {
    return res.status(400).json({ body: "images must not be empty" });
  }
  if (req.body.link.trim() === "") {
    return res.status(400).json({ body: "link must not be empty" });
  }
  if (req.body.info.trim() === "") {
    return res.status(400).json({ body: "info must not be empty" });
  }
  if (req.body.price.trim() === "") {
    return res.status(400).json({ body: "price must not be empty" });
  }
  if (req.body.itemCategory.trim() === "") {
    return res.status(400).json({ body: "itemCategory must not be empty" });
  }
  if (req.body.available.trim() === "") {
    return res.status(400).json({ body: "available must not be empty" });
  }
  if (req.body.highEnd.trim() === "") {
    return res.status(400).json({ body: "highEnd must not be empty" });
  }
  const newPost = {
    name: req.body.name,
    images: req.body.images,
    link: req.body.link,
    info: req.body.info,
    price: req.body.price,
    itemCategory: req.body.itemCategory,
    available: req.body.available,
    highEnd: req.body.highEnd,
    featured: req.body.featured,
    createdAt: new Date().toISOString()
  };
  db.collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

//DELETE route

exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: "Post was not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Successfully deleted" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}

//Upload images

exports.uploadImage = (req, res) => {

  // res.send("this worked"); // everything works up to this point

  const Busboy = require("busboy");
  
  const path = require("path");
  
  const os = require("os");

  const fs = require("fs");
  
  const busboy = new Busboy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // res.send("this worked");
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
    
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const image = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db
          .doc(`/posts/${req.params.postId}`)
          .update({ images: admin.firestore.FieldValue.arrayUnion(image) });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

