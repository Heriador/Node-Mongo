const { Router } = require("express");
const router = Router();

const {
    renderNoteForm,
    createNewNote,
    renderNotes,
    renderEditForm,
    editNote,
    deleteNote,
} = require("../controllers/notes.controller");

//New Note
router.get("/notes/add", renderNoteForm);
router.post("/notes/new-note", createNewNote);

//Get All Notes
router.get("/notes", renderNotes);

//Edits Notes
router.get("/notes/edit/:id", renderEditForm);
router.put("/notes/edit/:id", editNote);

//Delete Note
router.delete("/notes/delete/:id", deleteNote);

module.exports = router;
