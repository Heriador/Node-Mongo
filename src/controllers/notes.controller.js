import Note from '../models/Note.js';

export const renderNoteForm = (req,res) =>{
    res.render('notes/newNote');
}

export const createNewNote = async (req,res,next) => {
    try {
        const {title, description} = req.body;
        const newNote = new Note({title,description});
        newNote.user = req.user._id;
        await newNote.save();
        req.flash('succes_msg', 'Note Added Succesfully');
        res.redirect('/notes');
    } catch (err) {
        next(err);
    }
}

export const renderNotes = async (req,res,next) =>{
    try {
        const notes = await Note.find({user: req.user._id}).lean().sort({createdAt: 'desc'});
        res.render('notes/all_notes', { notes })
    } catch (err) {
        next(err);
    }
}

export const renderEditForm = async (req,res,next) =>{
    try {
        const note = await Note.findById(req.params.id).lean();
        if(!note){
            req.flash('error_msg','Note not found');
            return res.redirect('/notes');
        }
        if(note.user != req.user._id){
            req.flash('error_msg','Not In Your Notes')
            return res.redirect('/notes');
        }
        res.render('notes/editNote', {note});
    } catch (err) {
        next(err);
    }
}

export const editNote = async (req,res,next) =>{
    try {
        const {title, description} = req.body;
        await Note.findByIdAndUpdate(req.params.id,{title,description})
        req.flash('succes_msg', 'Note Updated Succesfully');
        res.redirect('/notes');
    } catch (err) {
        next(err);
    }
}

export const deleteNote = async (req,res,next) =>{
    try {
        await Note.findByIdAndDelete(req.params.id);
        req.flash('succes_msg', 'Note Deleted Succesfully');
        res.redirect('/notes');
    } catch (err) {
        next(err);
    }
}
