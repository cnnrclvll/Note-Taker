const path = require('path');  // module for working with paths
const router = require('express').Router(); // express.js router

router.get('/notes', (req, res) => { // get request at /notes
  res.sendFile(path.join(__dirname, '../public/notes.html')); // respose is notes.html file
});

router.get('*', (req, res) => { // get request for everywhere else
  res.sendFile(path.join(__dirname, '../public/index.html')); // response is index.html file
});

module.exports = router; // export router, which retains theses two get requests
