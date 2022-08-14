import { Router } from "express";
import { isAuthenticated } from '../helpers/auth.js'
import { 
        renderNoteForm, 
        createNewNote, 
        renderNotes,
        renderEditForm,
        editNote,
        deleteNote
} from "../controllers/notes.controller.js";

const router = Router();



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

export default router;
