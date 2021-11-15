const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//first and second HTML routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
  fs.readFile('./db/notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      res.status(200).json(parsedNotes);
    }})
  // ;

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNoteBtn = {
      title,
      text,
    };

    // Obtain existing notes
    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object, add a new note
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNoteBtn);

        // Write updated notes back to the file will change to appendFile later
        fs.writeFile(
          './api/notes.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNoteBtn,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting your note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
