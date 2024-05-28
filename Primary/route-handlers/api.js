const router = require('express').Router();  // require express Router
const noteHandler = require('../db/note'); // require note.js for Note class methods

router.get('/notes', (req, res) => { // GET endpoint handler for `/notes`
  noteHandler
    .notesGrab() // grab all notes
    .then((notes) => { // promise to return JSON response of all notes
      return res.json(notes); 
    })
    .catch((err) => res.status(500).json(err)); // catch error response 500 + JSON response error
});

router.post('/notes', (req, res) => { // POST endpoint handler for `/notes`
  noteHandler
    .notesAdd(req.body) // send request body to the addNote method
    .then((note) => res.json(note)) // promise to respond with JSON reponse of that note
    .catch((err) => res.status(500).json(err)); // catch error response 500 + JSON response error
});

// DELETE "/api/notes" deletes the note with an id equal to req.params.id
router.delete('/notes/:id', (req, res) => { // DELETE endpoint handler for `/notes/:id`
  noteHandler
    .removeNote(req.params.id) // pass request body paramater: id to the removeNote method
    .then(() => res.json({ ok: true })) // promise to send JSON response to confirm deletion
    .catch((err) => res.status(500).json(err)); // or catch error response 500 + JSON response error
});

module.exports = router; // export router
