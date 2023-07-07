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
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    // Parse notes data and send as JSON response
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Return the "notes.html" file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Delete a specific note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    // Parse notes data
    let notes = JSON.parse(data);

    // Find the index of the note with the specified ID
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      // If the note is not found, return an error response
      return res.status(404).send('Note not found');
    }

    // Remove the note from the array
    notes.splice(noteIndex, 1);

    // Write the updated notes back to "db.json"
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }

      // Send a success response
      res.sendStatus(204);
    });
  });
});

// Create a new note
app.post("/api/notes", (req, res) => {
  // Read the existing notes from "db.json"
  fs.readFile(path.join(__dirname, "db/db.json"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    // Parse notes data
    let notes = JSON.parse(data);

    // Generate a unique ID for the new note
    const newNote = {
      id: uuid(),
      ...req.body // Request body contains the new note data
    };

    // Add the new note to the array of notes
    notes.push(newNote);

    // Write the updated notes back to "db.json"
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }

      // Send the new note as the response
      res.json(newNote);
    });
  });
});

// Return the "index.html" file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});