const { admin, db } = require('../util/admin');

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
          createdAt: doc.data().createdAt
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
};

exports.createOnePost = (req, res) => {

  const newPost = {
    name: req.body.name,
    images: null,
    link: req.body.link,
    info: req.body.info,
    price: req.body.price,
    itemCategory: req.body.itemCategory,
    available: req.body.available,
    highEnd: req.body.highEnd,
    createdAt: new Date().toISOString()
  };
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
        }
        //img png
        const imageExtension = filename.split(".")[
        filename.split(".").length - 1
        ];
        imageFileName = `${Math.round(
        Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: { 
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            newPost.images = imageUrl
            return newPost.images = imageUrl

        })
        .then(() => {
            return res.json({ message: 'image uploaded successfully'});
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Something went wrong" })
        });
    });
    busboy.end(req.rawBody);

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