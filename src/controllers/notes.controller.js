import Note from '../models/Note.js';
import { catchAsync } from '../helpers/catchAsync.js';
import { successRedirect } from '../helpers/flashRedirect.js';

export const renderNoteForm = (req,res) =>{
    res.render('notes/newNote');
}

export const createNewNote = catchAsync(async (req,res) => {
    const {title, description} = req.body;
    const newNote = new Note({title,description});
    newNote.user = req.user._id;
    await newNote.save();
    successRedirect(req, res, 'Note Added Succesfully', '/notes');
});

export const renderNotes = catchAsync(async (req,res) =>{
    const notes = await Note.find({user: req.user._id}).lean().sort({createdAt: 'desc'});
    res.render('notes/all_notes', { notes })
});

export const renderEditForm = (req,res) =>{
    res.render('notes/editNote', {note: req.note});
};

export const editNote = catchAsync(async (req,res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description})
    successRedirect(req, res, 'Note Updated Succesfully', '/notes');
});

export const deleteNote = catchAsync(async (req,res) =>{
    await Note.findByIdAndDelete(req.params.id);
    successRedirect(req, res, 'Note Deleted Succesfully', '/notes');
});
