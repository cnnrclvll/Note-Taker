// index to match back end functionality to front end elements

let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let notesList;

// initiate undeclared variables

if (window.location.pathname === '/notes') { // if at `/notes` declare each variable above to an element in the DOM using a query-selector
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  notesList = document.querySelectorAll('.list-container .list-group');
}

const show = (e) => { // constant. function to change element display style to `inline` (show)
  e.style.display = 'inline';
};

const hide = (e) => {
  e.style.display = 'none'; // constant. function to change element display style to `none` (hide)
};

let currentNote = {}; // initialize empty object for current note

const grabNotes = () => // constant. fetch function
  fetch('/api/notes', { // GET request to `/api/notes` (1st arg), (2nd arg): method details
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const addNotes = (note) => // constant. fetch function  
  fetch('/api/notes', { // POST request to `/api/notes` (1st arg), (2nd arg): method details
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const delNotes = (id) => // constant. fetch function 
  fetch(`/api/notes/${id}`, { // DELETE request to `/api/notes/:id` (1st arg), (2nd arg): method details
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

// function updates the UI based on the state of currentNote
const setCurrent = () => { // constant. defining a function.
  hide(saveNoteBtn); // hide save button
  hide(clearBtn); // hide clear button

  if (currentNote.id) { // if currentNote has been given an id (already created)
    show(newNoteBtn); // show new note button
    noteTitle.setAttribute('readonly', true); // set title attribute to read only
    noteText.setAttribute('readonly', true); // set text attribute to read only
    noteTitle.value = currentNote.title; // initiates a title key for currentNote and sets the value
    noteText.value = currentNote.text; // initiates a text key for currentNote and sets the value
  } else { // if cuurentNote has NOT been given an id (being created)
    hide(newNoteBtn); // hide new note button
    noteTitle.removeAttribute('readonly'); // title no longer read only
    noteText.removeAttribute('readonly'); // text no longer read only
    noteTitle.value = ''; // empty title value
    noteText.value = ''; // empty text value
  }
};

const saveNotes = () => { // constant. defining a function
  const newNote = { // constant. note object
    title: noteTitle.value, // key/value. take title value from user input
    text: noteText.value // key/value. take text value from user input
  };
  addNotes(newNote).then(() => { // POST request with newNote as the req body. THEN (promise)
    renderNotes(); // render updated notes list
    setCurrent(); // run setCurrent due to state change
  });
};

const deleteNotes = (e) => { // constant. defining a function. accept event object as param
  e.stopPropagation(); // delete button doesnt propagate outward

  const note = e.target; // target is a JS object property.  element which triggerent event (delete button)
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id; // access data-note attribute of parent element -> parse data-note JSON string into JS object -> get id from object

  if (currentNote.id === noteId) { // if deleting the current note, empty it.
    currentNote = {};
  }

  delNotes(noteId).then(() => { // pass the note id to the delNotes function. THEN (promise)
    renderNotes(); // render updated notes list
    setCurrent(); // run setCurrent due to state change
  });
};

const selectedView = (e) => { // constant. defining a function. accept event object as param
  e.preventDefault(); // prevent default for passed element
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note')); // setting value of currentNote: access data-note attribute of parent element -> parse data-note JSON string into JS object
  setCurrent(); // run setCurrent due to state change
};

const createView = (e) => { // constant. defining a function. accept event object as param
  currentNote = {}; // empty currentNote
  show(clearBtn); // show the clear button
  setCurrent(); // run setCurrent due to state change
};

const buttonHandler = () => { // constant. defining a function
  show(clearBtn); // show the clear button
  if (!noteTitle.value.trim() && !noteText.value.trim()) { // if there isnt input in title AND there isnt input in text form
    hide(clearBtn); // hide clear button
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) { // if there isnt input in title OR there isnt input in text form
    hide(saveNoteBtn); // hide save button
  } else { // otherwise 
    show(saveNoteBtn); // show save button
  }
};

const listNotes = async (notes) => { // constant. defining an async function. pass it notes
  let dataNotes = await notes.json(); // await resolve of JSON data response
  if (window.location.pathname === '/notes') { // if path is `/notes`
    notesList.forEach((el) => (el.innerHTML = '')); // for each noteList element (li), empty the innerHTML (refresh)
  }

  let listContainer = []; // initalize an empty array (container for list items)

  const createLi = (text, delBtn = true) => { // constant. defining a nested function. creates a <li> with two params: text and a delete button (boolean. default is true)
    const liEl = document.createElement('li'); // constant. creates a new <li> element
    liEl.classList.add('list-group-item'); // add class='list-group-item' to <li>

    const spanEl = document.createElement('span'); // constant. create <span> element
    spanEl.classList.add('list-item-title'); // add class='list-item-title' to <span>
    spanEl.innerText = text; // populate innerText of span with createLi text param
    spanEl.addEventListener('click', selectedView); // add click listener to <span>, sending it to selectedView

    liEl.append(spanEl); // append span to li

    if (delBtn) { // there delBtn is true, which it is by default
      const delBtnEl = document.createElement('i'); // constant. create <i> element
      delBtnEl.classList.add( // provide the delete icon with the following css attributes
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', deleteNotes); // add click listener to delete button to send the corresponding note to deleteNotes

      liEl.append(delBtnEl); // append delete button to li
    }

    return liEl; // return the constructed li
  };

  if (dataNotes.length === 0) { // if no notes
    listContainer.push(createLi('No saved Notes', false)); // create a placeholder for no saved notes
  }

  dataNotes.forEach((note) => { // iterates over each note in the dataNotes array
    const li = createLi(note.title); // constant. create a li, passing the title as the text param
    li.dataset.note = JSON.stringify(note); // set data-note attribute of the li to a JSON string of the note

    listContainer.push(li); // push the current li into the container
  });

  if (window.location.pathname === '/notes') { // if at `/notes`
    listContainer.forEach((note) => notesList[0].append(note)); // send list container contents to notesList element (send notes to UI)
  }
};

const renderNotes = () => grabNotes().then(listNotes); // constant. get notes, send em to the UI through listNotes

if (window.location.pathname === '/notes') { // if at `/notes` add listeners to connect functionality to UI
  saveNoteBtn.addEventListener('click', saveNotes);
  newNoteBtn.addEventListener('click', createView);
  clearBtn.addEventListener('click', setCurrent);
  noteForm.addEventListener('input', buttonHandler);
}

renderNotes(); // go go go
