const express = require('express');
const path = require('path');
const app = express();
const baseUrl = 'http://localhost:3333';
const endpoint = '/test/:some-value/val';
const url = new URL(endpoint, baseUrl);

//console.log(__dirname);


// Will send the index.html file as response
app.get('/', (clientRequestObject, serverResponseObject) => {
    serverResponseObject.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/notes', (clientRequestObject, serverResponseObject) => {
   //read the db.json and return all saved notes as json
   serverResponseObject.sendFile(path.join(__dirname, 'db/db.json'));
   //output the object on the page to print out the notes
});

app.get('/api/notes', (clientRequestObject, serverResponseObject) => {
    //read the db.json and return all saved notes as json
    serverResponseObject.sendFile(path.join(__dirname, 'db/db.json'));
    //output the object on the page to print out the notes
 });

app.listen(3333, () => console.log('Server started on port 3333.'));

// Getting Started
// The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.

// The following HTML routes should be created:

// GET /notes should return the notes.html file.

// GET * should return the index.html file.

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).