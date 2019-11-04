const { db } = require('../util/admin');

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