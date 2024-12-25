const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let filteredUser = users.filter(user=> user.username === username && user.password === password)
  if (filteredUser.length > 0){
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password){
    return res.status(404).json({"message": "Error in logging"})
  }

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: 60 * 60})
    req.session.authorization = {
      accessToken, username
    }
    return  res.status(200).json({"msg":"User successfully logged in"})
  } else {
    return res.status(401).json({"message": "Invalid Login. Check username password."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let username = req.session.authorization["username"]
  let reviews = req.body.reviews

  let filteredBook = Object.keys(books).filter(bIsbn => bIsbn == isbn)
  
  if (filteredBook.length > 0){
    let book = books[filteredBook[0]]
    if (book.reviews[username]){
      console.log("Rich put")
      book.reviews[username] = reviews
      return res.status(201).send(JSON.stringify(book))
    } else{
      console.log("Rich post")
      book.reviews[username] = reviews
      return res.status(200).send(JSON.stringify(book))
    }
  }
  return res.status(402).json({message: "Unable to added review"});
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  let username = req.session.authorization["username"]
  let isbn = req.params.isbn

  let bookId = Object.keys(books).filter(key => key == isbn)
  console.log(bookId)

  if (bookId.length > 0){
    let book = books[bookId[0]]

    if (username in book.reviews){
      delete book[username]
      return res.status(200).json({"msg": "content was successfully deleted"})
    }
    else{
      return res.status(403).json({"msg": "unable to perform the operation"})
    }
  }


})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
