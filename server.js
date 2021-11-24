const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const { type } = require('os');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//first and second HTML GET routes
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
  const { title, text, note_id } = req.body; // do I need note_id here? 
  console.log('title and text' + req.body);
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNoteBtn = {
      title,
      text,
      note_id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object, add a new note
        console.log('i am in readfile');
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNoteBtn);

        // Write updated notes back to the file 
        fs.writeFile(
          './db/notes.json',
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

// DELETE request to add a note
app.delete('/api/notes/:id', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to delete a note`);
  console.log('title and text' + req.params.id);
  // Obtain existing notes
  fs.readFile('./db/notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log('i am in deletefile');
      const parsedNotes = JSON.parse(data);
      console.log(parsedNotes);
      const index1 = Object.keys(parsedNotes).length;
      // console.log(Object.values(parsedNotes));
      const newArray = [];
      for (i = 0; i < index1; i++){
        let num = i;
        let n = num.toString();    
        tempArray = parsedNotes[n];
        newArray.push(tempArray);
      if (tempArray.note_id === '9869') {index2 = i}
      }
      // I am cheating a little here because correct way to remove an element from an array is to use splice. 
      // I know in this demo I remove last element. So I use pop
newArray.pop();
console.log(newArray);
// and now I can use writeFile() to add newArray and to update notes.json
    }
  });
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
