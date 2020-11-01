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
app.set('views', 'views/');
app.set('view engine', 'ejs');


app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

app.get('/', homePage);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

function homePage(request, response) {
  response.render('pages/index', {title :"page index"});
}
