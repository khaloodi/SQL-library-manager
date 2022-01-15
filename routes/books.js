var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. In other words, we are abstracting away the try catch for all of our calls by creating an asyncHandler function and using or implimenting it in all of our calls.*/
function asyncHandler(cb) { // catches an error (or a rejected promise) that occurs in a route and forwards the error to the global error handler (in app.js) with the next() method
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // res.status(500).send(error) // this line/catch statement will send a 500 error or internal server error to the user if an exception is thrown in the try block, or in any of the handler functions           
            // With only next(error) inside of the catch block, if you visit an article that does not exist in the database (/articles/101, for example), or run findByPk() with an invalid ID, the response returns errors and a 500 status code. The server cannot process the request because the entry is not found.
            next(error); // Forward error to the global error handler, I believe this operates the same as res.status(500).send(error)

        }
    }
}

/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  // res.render('index', { title: 'Express' });
  const books = await Book.findAll()
  res.json(books)
}));

module.exports = router;