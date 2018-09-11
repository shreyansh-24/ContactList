// here we are making a custom middleware so that we can add it to the requests at the backend
// this middleware checks if the token receied from the frontend is valid or not

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken  = jwt.verify(token, 'the_secret_hashing_password');
    req.userData = { email: decodedToken.email, userID: decodedToken.UserId }
    // the token returned here id by default decoded so we can fetched the information here that we passed inside the token previously
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth Failed, Invalid User!'
    })
  }
};


// express.js lets us add any number of requests we want to pass with the middleware that we may need in the api routes
// and so we add decoded token info with this miiddleware to fetch userID at the api post route
