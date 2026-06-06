import Note from '../models/Note.js';

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

export const renderNoteForm = (req,res) =>{
    res.render('notes/newNote');
}

export const createNewNote = async (req,res) => {
    const {title, description} = req.body;
    if (!title || !description) {
        req.flash('error_msg', 'Title and description are required');
        return res.redirect('/notes/add');
    }
    if (title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
        req.flash('error_msg', `Title max ${MAX_TITLE_LENGTH} chars, description max ${MAX_DESCRIPTION_LENGTH} chars`);
        return res.redirect('/notes/add');
    }
    const newNote = new Note({title: title.trim(), description: description.trim()});
    newNote.user = req.user._id;
    await newNote.save();
    req.flash('succes_msg', 'Note Added Succesfully');
    res.redirect('/notes');
}

export const renderNotes = async (req,res) =>{
    const notes = await Note.find({user: req.user._id}).lean().sort({createdAt: 'desc'});
    res.render('notes/all_notes', { notes })
}

export const renderEditForm = async (req,res) =>{
    const note = await Note.findById(req.params.id).lean();
    if (!note || note.user != req.user._id) {
        req.flash('error_msg','Not In Your Notes')
        return res.redirect('/notes');
    }
    res.render('notes/editNote', {note});
}

export const editNote = async (req,res) =>{
    const {title, description} = req.body;
    const note = await Note.findById(req.params.id);
    if (!note || note.user != req.user._id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    if (!title || !description) {
        req.flash('error_msg', 'Title and description are required');
        return res.redirect(`/notes/edit/${req.params.id}`);
    }
    if (title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
        req.flash('error_msg', `Title max ${MAX_TITLE_LENGTH} chars, description max ${MAX_DESCRIPTION_LENGTH} chars`);
        return res.redirect(`/notes/edit/${req.params.id}`);
    }
    await Note.findByIdAndUpdate(req.params.id, {title: title.trim(), description: description.trim()});
    req.flash('succes_msg', 'Note Updated Succesfully');
    res.redirect('/notes');
}

export const deleteNote = async (req,res) =>{
    const note = await Note.findById(req.params.id);
    if (!note || note.user != req.user._id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg', 'Note Deleted Succesfully');
    res.redirect('/notes');
}
