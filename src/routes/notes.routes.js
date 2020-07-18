const { Router } = require("express");
const router = Router();
const { isAuthenticated } = require('../helpers/auth');

const {
    renderNoteForm,
    createNewNote,
    renderNotes,
    renderEditForm,
    editNote,
    deleteNote,
} = require("../controllers/notes.controller");

//New Note
router.get("/notes/add",isAuthenticated ,renderNoteForm);
router.post("/notes/new-note",isAuthenticated , createNewNote);

//Get All Notes
router.get("/notes",isAuthenticated , renderNotes);

//Edits Notes
router.get("/notes/edit/:id",isAuthenticated , renderEditForm);
router.put("/notes/edit/:id",isAuthenticated , editNote);

//Delete Note
router.delete("/notes/delete/:id",isAuthenticated , deleteNote);

module.exports = router;
