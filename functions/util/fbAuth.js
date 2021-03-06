const { admin } = require('./admin')

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("no token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      // req.user = decodedToken;
      // return db.collection('users')
      // .where('userId', '==', req.user.uid)
      // .limit(1)
      // .get()
      if (!decodedToken) {
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
      console.error("Error while verifying the token", err);
      return res.status(403).json(err);
    });
};
