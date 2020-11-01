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
app.get('/searches/new', getBooks);
app.post('/searches', findBooks);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

function homePage(request, response) {
  response.render('pages/index');
}

function getBooks(request, response) {
  response.render('pages/searches/new');

}

function findBooks(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}&max-results=10`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}&max-results=10`; }
  superagent.get(url).then(booksResults =>
    booksResults.body.items.map(book => {
      new Book(book);
    })
  ).then(results => {
    response.render('pages/searches/show', { booksResults: booksArray });
  }).catch(() => {
    response.status(500).send('Something Went Wrong');
  });
}

let booksArray = [];
function Book(info) {
  this.title = info.volumeInfo.title || 'No title available.';
  this.author = info.volumeInfo.authors || 'No authors available.';
  this.image_url = `https://books.google.com/books/content?id=${info.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api` || 'https://placehold.it/200x300';
  this.description = info.volumeInfo.description || 'No description available.';
  booksArray.push(this);
}
