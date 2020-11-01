'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const { request, response } = require('express');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
app.set('views', 'views/');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

app.get('/', homePage);
app.get('/searches/new', getBook);
app.post('/searches', searchForBooks);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

function homePage(request, response) {
  response.render('pages/index');
}

function getBook(request, response) {
  response.render('pages/searches/new');

}

function searchForBooks(request, response) {
  console.log('I searched for books');
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}&max-results=10`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}&max-results=10`; }
  console.log(url);
  superagent.get(url).then(apiResponse =>
    apiResponse.body.items.map(result => {
      console.log(result);
      new Book(result);
    })
  )
    .then(results => {
      response.render('pages/searches/show', { searchResults: booksArray });
    }).catch(() => {
      response.status(500).send('Something Went Wrong');
    });
}

let booksArray = [];
function Book(info) {
  this.book_id = info.id;
  this.title = info.volumeInfo.title;
  this.author = info.volumeInfo.authors;
  this.image_url = `https://books.google.com/books/content?id=${info.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api` || 'https://placehold.it/200x300';
  this.isbn = info.volumeInfo.industryIdentifiers[0].identifier;
  this.description = info.volumeInfo.description;
  booksArray.push(this);
}
