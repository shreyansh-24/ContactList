const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth  = require('./middleware/check-auth');

const ContactModel = require('./models/contact');
const UserModel = require('./models/user');


const app = express();


app.use(bodyParser.json()); // this package gives us access to the request body
app.use(bodyParser.urlencoded({ extended : false }));

// connecting to mongodb via mongoose

mongoose
  .connect(
    "mongodb://localhost/contactList"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// Cross Origin Resource Sharing (CORS) Error Handling

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/contacts/', checkAuth , (req, res, next) => {
  const contact = new ContactModel({
    cname: req.body.cname,
    cnum: req.body.cnum,
    creator: req.userData.userID
  })

  contact.save(); // mongoose command to save the object in db

  console.log(contact);
  res.status(201).json({
    message: "Contact successfully added!"
  });
});

app.get('/api/contacts/', checkAuth, (req, res, next) => {

  ContactModel.find({ creator: req.userData.userID }).then( (docs) => {
    res.status(200).json({
      message: "Contacts fetched Successfully",
      contacts: docs
    })
  });
})

app.delete('/api/contacts/:deleteId', checkAuth , (req, res, next) => {

  ContactModel.deleteOne({_id: req.params.deleteId, creator: req.userData.userID})
  .then(
    ContactModel.find().then( (docs) => {
    res.status(200).json({
      message: "Contacts updated Successfully",
      contacts: docs

    });
  }));

});

//api paths for signup

app.post('/api/signup/', (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // using bcrypt so that raw password is not saved in database (security)
    .then( hash => {
      const user = new UserModel({
        email: req.body.email,
        password: hash
      })
      user.save();
      console.log(user);
      res.status(201).json({
        message: 'New User Signed Up recently'
      })
    });

})

// api path for login

app.post('/api/login/', (req, res, next) => { // here return is used as there are multiple 'then' blocks and hence multiple 'res' sections in a single api call
  let fetchedUser;
  UserModel.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message: 'Authentication Failed!'
        })
      }
      else{
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Authentication Failed!'
        })
      }
      else{
    const token = jwt.sign({ email: fetchedUser.email, UserId: fetchedUser._id }, 'the_secret_hashing_password', { expiresIn: '1h' });

    res.status(201).json({ // no return needed here as this is the last 'res' block
      token: token,
      message: 'login Successful',
      email: fetchedUser.email,
      expiresIn: 3600
    });
  }
    })
    .catch(err => {
      res.status(401).json({ // return not needed here as this is the last 'res' statement
        message: 'Authentication Failed!',
        error: err
      })
    })
})





module.exports = app;
