import Note from '../models/Note.js';
import { catchAsync } from './catchAsync.js';
import { errorRedirect } from './flashRedirect.js';

export const checkNoteOwnership = catchAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id).lean();
    if (!note) {
        return errorRedirect(req, res, 'Note Not Found', '/notes');
    }
    if (note.user != req.user._id) {
        return errorRedirect(req, res, 'Not In Your Notes', '/notes');
    }
    req.note = note;
    next();
});
