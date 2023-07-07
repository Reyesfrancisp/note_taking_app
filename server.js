const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const { v4: uuid } = require("uuid");
const PORT = process.env.PORT || 3333;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse JSON requests
app.use(express.json());

// Read all saved notes from "db.json"
app.get("/api/notes", getNotes);

// Return the "notes.html" file
app.get("/notes", getNotesPage);

// Delete a specific note by ID
app.delete("/api/notes/:id", deleteNote);

// Create a new note
app.post("/api/notes", createNote);

// Return the "index.html" file for all other routes
app.get("*", getDefaultPage);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Function to read and send all saved notes as formatted JSON
function getNotes(req, res) {
  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    const notes = JSON.parse(data);
    res.json(notes, null, 2);
  });
}

// Function to return the "notes.html" file
function getNotesPage(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
}

// Function to delete a specific note by ID
function deleteNote(req, res) {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    let notes = JSON.parse(data);
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).send('Note not found');
    }

    notes.splice(noteIndex, 1);

    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }

      res.sendStatus(204);
    });
  });
}

// Function to create a new note
function createNote(req, res) {
  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    let notes = JSON.parse(data);

    const newNote = {
      id: uuid(),
      ...req.body
    };

    notes.push(newNote);

    const updatedNotes = JSON.stringify(notes, null, 2); // Include indentation

    fs.writeFile(path.join(__dirname, "db/db.json"), updatedNotes, err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }

      res.json(newNote, null, 2); // Respond with formatted JSON
    });
  });
}


// Function to return the "index.html" file for all other routes
function getDefaultPage(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
}