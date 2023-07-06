const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const {v4: uuid} = require("uuid")
//console.log(__dirname);

app.use(express.static("public"));
app.use(express.json());

app.get("/api/notes", (clientRequestObject, serverResponseObject) => {
   //read the db.json and return all saved notes as json
   serverResponseObject.sendFile(path.join(__dirname, "db/db.json"));
   //output the object on the page to print out the notes
});

app.get("/notes", (clientRequestObject, serverResponseObject) => {
    //read the db.json and return all saved notes as json
    serverResponseObject.sendFile(path.join(__dirname, "./public/notes.html"));
    //output the object on the page to print out the notes
 });

 app.delete("/api/notes/:filler", (clientRequestObject, serverResponseObject) => 
 {
  console.log(clientRequestObject);
 
 return serverResponseObject.sendFile(path.join(__dirname, "./public/notes.html"));
 });
 
 app.post("/api/notes", (clientRequestObject, serverResponseObject) => {
  // Read the existing notes from db.json
  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return serverResponseObject.status(500).send('Server Error');
    }

    let notes = JSON.parse(data);

    // Generate a unique ID
    const newNote = {
      id: uuid(),
      ...clientRequestObject.body // Request body contains the new note data
    };

    // Add the new note to the array of notes
    notes.push(newNote);

    // Write the updated notes back to db.json
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        console.error(err);
        return serverResponseObject.status(500).send('Server Error');
      }

      // Send the new note as the response
      serverResponseObject.json(newNote);
    });
  });
});

// Will send the index.html file as response
app.get("*", (clientRequestObject, serverResponseObject) => {
  serverResponseObject.sendFile(path.join(__dirname, "./public/index.html"));
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