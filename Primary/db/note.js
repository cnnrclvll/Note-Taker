const util = require('util'); // node module supporting internal APIs
const fs = require('fs'); // allows file system interactions
const uuidv1 = require('uuid/v1'); ; // Universally Unique Identifier. uniquely identify information.
// https://www.npmjs.com/package/uuid


const readFileAsync = util.promisify(fs.readFile); // constant. convert fs readFile function from returning callback to returning promises
const writeFileAsync = util.promisify(fs.writeFile); // constant. convert fs writeFile function from returning callback to returning promises

class Note { // defining the Note class
  read() { // defining read() method
    return readFileAsync('db/db.json', 'utf8'); // return value of: async readFile of db.json (utf8: default character encoding (file transmission))
  }

  write(note) { // defining write(note) method. pass this function a note to be added to the database file.
    return writeFileAsync('db/db.json', JSON.stringify(note)); // write the passed note to the db.json file. pass a JSON.stringify(note) because writeFileAsync excpects a string
  }

  get() { // defining the get() method
    return this.read().then((notes) => { // return: this.read() = read database, return promise --(when this.read() completes successfully)--> .then((notes) passes the return of this.read() to the arrow function
      let formatNotes; // initiate a variable

      try { // try parsing the notes (cause they are a string in JSON format)
        formatNotes = [].concat(JSON.parse(notes)); // create an empty array, concatenate the empty array with the parsed notes
      } catch (err) { // if failed
        formatNotes = []; // empty array
      }

      return formatNotes; // return the value of parsed notes.
    });
  }

  add(note) { // defining the add(note) method
    const { title, text } = note; // deconstruct the note into title and text

    if (!title || !text) { // if there is no value for title or text throw error
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    const newNote = { title, text, id: uuidv1() }; // recreate the note with a unique id

    // Get all notes, add the new note, write all the updated notes, return the newNote
    return this.get() // get all the notes and begin promise chain (below)
      .then((notes) => [...notes, newNote]) // add the new note to the array, retrieved from getNotes()
      .then((updateNotes) => this.write(updateNotes)) // write the updated array to the db file
      .then(() => newNote); // return the new note
  }

  delete(id) { // defining the delete(id) method. pass this method a note's id
    // Get all notes, remove the note with the given id, write the filtered notes
    return this.get() // get all the notes and begin promise chain (below)
      .then((notes) => notes.filter((note) => note.id !== id)) // return all notes that do not have a matching id
      .then((filterNotes) => this.write(filterNotes)); // write the filtered array to the db file
  }
}

module.exports = new Note(); // export an instance of the note class object
