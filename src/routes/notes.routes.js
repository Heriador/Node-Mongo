import { Router } from "express";
import { isAuthenticated } from '../helpers/auth.js'
import { checkNoteOwnership } from '../helpers/noteOwnership.js';
import { 
        renderNoteForm, 
        createNewNote, 
        renderNotes,
        renderEditForm,
        editNote,
        deleteNote
} from "../controllers/notes.controller.js";

const router = Router();

// All note routes require authentication
router.use(isAuthenticated);

//New Note
router.get("/notes/add", renderNoteForm);
router.post("/notes/new-note", createNewNote);

//Get All Notes
router.get("/notes", renderNotes);

//Edits Notes
router.get("/notes/edit/:id", checkNoteOwnership, renderEditForm);
router.put("/notes/edit/:id", checkNoteOwnership, editNote);

//Delete Note
router.delete("/notes/delete/:id", deleteNote);

export default router;
