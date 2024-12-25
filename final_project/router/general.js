const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require("axios")




const doesExist=(username)=>{
  let filteredUser = users.filter(user=>user.username === username)
  if (filteredUser.length > 0){
    return true
  }else{
    return false
  }
}


public_users.post("/register", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  if (username && password){
    if (!doesExist(username)){
      users.push({"username": username, "password": password})
      return res.status(200).json({"msg": "User successfully registered. Now you can login."})
    } else{
      return res.status(404).json({"meg": "User already exists!"})
    }
  }
  return res.status(404).json({"msg": "Unable to register user."});
});



async function getBooks(){
  return new Promise((resolve, reject)=>{
    resolve(books)
  })
}


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const booksDict = await getBooks()
    return res.status(200).send(JSON.stringify(booksDict, null, 4));
  } catch (error){
    return res.status(204);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let bookIsbn = req.params.isbn

  new Promise((resolve, reject)=>{
    let filteredBook = Object.keys(books).filter(bookKey=> bookKey == bookIsbn)
    if (filteredBook.length > 0){
      resolve(books[filteredBook[0]])
    } else{
      reject({"message":"No content"})
    }
  }).then(data=>{
    return res.status(200).send(JSON.stringify(data, null, 6))
  }).catch((err)=>{
    return res.status(204).send(err);
  })
});


  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author

  new Promise((resolve, reject)=>{
    let filteredAuthors = Object.values(books).
    filter(detail=>detail.author.toLowerCase().includes(author.toLowerCase()))
    if (filteredAuthors.length > 0){
      resolve(filteredAuthors)
    } else{
      reject({"message":"No content"})
    }
  }).then(data=>{
    return res.status(200).send(JSON.stringify(data, null, 4))
  }).catch(err=>{
    return res.status(204).send(err);
  })
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  new Promise((resolve, reject)=>{
    filteredBooks = Object.values(books).
    filter(detail=>detail.title.toLowerCase().includes(title.toLowerCase()))
    if (filteredBooks.length > 0){
      resolve(filteredBooks)
    } else{
      reject({"message":"No content"})
    }
  }).then(data=>{
    return res.status(200).send(JSON.stringify(data, null, 4))
  }).catch(err=>{
    return res.status(204).send(err);
  })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  let bookKey = Object.keys(books).filter(key=>key==isbn)
  if (Object.keys(bookKey).length > 0 && Object.keys(books[bookKey[0]].reviews).length > 0){
    return res.status(200).send(JSON.stringify(books[bookKey[0]].reviews, null, 4))
  }

  return res.status(204).send({"message":"No content"});
});




module.exports.general = public_users;
