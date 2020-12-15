const express = require("express");     // Module to create server object 
const fs = require("fs");      // Module to access File System
const path = require("path")    // Module to access System Path
const uniqid = require("uniqid")    // Module to create a random ID


// LOAD DATA
// const notesData = require('./db/db.json'); // These data sources hold arrays of information on notes data

const app = express();  // Server Object
const PORT = 3000;  // Variable to storage Server Port

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static files in Express
app.use(express.static('public'));

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// GET all notes
const getNotes = () => {
    try {
        const jsonString = fs.readFileSync("./db/db.json", "utf8");
        return JSON.parse(jsonString);
    }
    catch (parseErr) {
        console.log("Error passing JSON", parseErr)
    }
}

const writeNotes = (jsonString) => {
    fs.writeFile("./db/db.json", jsonString, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Database Updated Successfully!");
        }
    });
}


app.get('/api/notes', (req, res) => {
    console.log(getNotes())
    res.json(getNotes());
});

// POST
app.post('/api/notes', (req, res) => {

    let notesData = getNotes();
    let newNote = req.body;
    newNote.id = uniqid();
    notesData.push(newNote);
    // Write Json file asyncronily
    const jsonString = JSON.stringify(notesData);
    
    writeNotes(jsonString);
    res.json(newNote);
});

// Update
app.put("/api/notes/:id", function (req, res) {
    let notesData = getNotes();     // Storage all notes
    const chosen = req.params.id;   // Storage the ID selected

    // console.log(notesData);
    let newData = notesData.map(note => { 
        if (note.id === chosen) {
            let newNote = req.body;
            newNote.id = chosen;
            note = newNote;
        }
        return note;
    })
    // console.log(`This is the new data ${newData}`);
    writeNotes(JSON.stringify(newData));
    res.json(req.body);
  })

// Delete
app.delete("/api/notes/:id", function (req, res) {
    let notesData = getNotes();     // Storage all notes
    const chosen = req.params.id;   // Storage the ID selected

    let newData = notesData.filter(note => note.id !== chosen);
    
    writeNotes(JSON.stringify(newData));
    res.send('Note Deleted')
  })

// If no matching route is found default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));


// Server Listening
app.listen(PORT, console.log(`Server is istening to port: ${PORT}`));




