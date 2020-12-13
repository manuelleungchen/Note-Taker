const express = require("express");     // Module to create server object 
const fs = require("fs");      // Module to access File System
const path = require("path")    // Module to access System Path

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
// app.get("/api/notes", (req, res) => res.json(notesData));

// app.get('/api/notes', (req, res) => {
//     try {
//         const jsonString = fs.readFileSync("./db/db.json", "utf8");
//         console.log(jsonString);
//         res.json(JSON.parse(jsonString))
//     }
//     catch (err) {
//         console.log("Error passing JSON", err)
//     }
// });

const getNotes = () => {
    try {
        const jsonString = fs.readFileSync("./db/db.json", "utf8");
        return JSON.parse(jsonString);
    }
    catch (parseErr) {
        console.log("Error passing JSON", parseErr)
    }
}

app.get('/api/notes', (req, res) => {
    // Read Json file asyncronily
    // fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         try {
    //             res.json(JSON.parse(jsonString))
    //         }
    //         catch (parseErr) {
    //             console.log("Error passing JSON", parseErr)
    //         }
    //     }
    // });
    console.log(getNotes())
    res.json(getNotes());
});

// POST
// app.post("/api/notes", (req, res) => {
//     // Our "server" will take a note and save it to database.
//     // It will return the saved note to the client.
//     // req.body is available since we're using the body parsing middleware
//     notesData.push(req.body);
//     res.json(req.body);
// })

app.post('/api/notes', (req, res) => {

    let notesData = getNotes();
    notesData.push(req.body);
    // Write Json file asyncronily
    const jsonString = JSON.stringify(notesData);
    fs.writeFile("./db/db.json", jsonString, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Database Updated Successfully!");
            res.json(req.body);
        }
    });
});

// If no matching route is found default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));


// Server Listening
app.listen(PORT, console.log(`Server is istening to port: ${PORT}`));




