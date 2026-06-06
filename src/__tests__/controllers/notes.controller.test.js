import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Note model before importing the controller
vi.mock('../../models/Note.js', () => {
  const mockNote = vi.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = vi.fn().mockResolvedValue(this);
  });

  mockNote.find = vi.fn();
  mockNote.findById = vi.fn();
  mockNote.findByIdAndUpdate = vi.fn();
  mockNote.findByIdAndDelete = vi.fn();

  return { default: mockNote };
});

const Note = (await import('../../models/Note.js')).default;
const {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  editNote,
  deleteNote,
} = await import('../../controllers/notes.controller.js');

describe('notes.controller', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
      params: {},
      user: { _id: 'user123' },
      flash: vi.fn(),
    };
    res = {
      render: vi.fn(),
      redirect: vi.fn(),
    };
  });

  describe('renderNoteForm', () => {
    it('should render notes/newNote', () => {
      renderNoteForm(req, res);
      expect(res.render).toHaveBeenCalledWith('notes/newNote');
    });
  });

  describe('createNewNote', () => {
    it('should create a note, assign user, save, flash, and redirect', async () => {
      req.body = { title: 'Test Title', description: 'Test Desc' };

      await createNewNote(req, res);

      expect(Note).toHaveBeenCalledWith({ title: 'Test Title', description: 'Test Desc' });
      expect(req.flash).toHaveBeenCalledWith('succes_msg', 'Note Added Succesfully');
      expect(res.redirect).toHaveBeenCalledWith('/notes');
    });
  });

  describe('renderNotes', () => {
    it('should find notes for user, sort desc, and render', async () => {
      const mockNotes = [{ title: 'A' }];
      const sortMock = vi.fn().mockResolvedValue(mockNotes);
      const leanMock = vi.fn().mockReturnValue({ sort: sortMock });
      Note.find.mockReturnValue({ lean: leanMock });

      await renderNotes(req, res);

      expect(Note.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(leanMock).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: 'desc' });
      expect(res.render).toHaveBeenCalledWith('notes/all_notes', { notes: mockNotes });
    });
  });

  describe('renderEditForm', () => {
    it('should render editNote when user owns the note', async () => {
      req.params.id = 'note1';
      const mockNote = { title: 'A', user: 'user123' };
      const leanMock = vi.fn().mockResolvedValue(mockNote);
      Note.findById.mockReturnValue({ lean: leanMock });

      await renderEditForm(req, res);

      expect(Note.findById).toHaveBeenCalledWith('note1');
      expect(res.render).toHaveBeenCalledWith('notes/editNote', { note: mockNote });
    });

    it('should flash error and redirect when user does not own the note', async () => {
      req.params.id = 'note1';
      const mockNote = { title: 'A', user: 'otherUser' };
      const leanMock = vi.fn().mockResolvedValue(mockNote);
      Note.findById.mockReturnValue({ lean: leanMock });

      await renderEditForm(req, res);

      expect(req.flash).toHaveBeenCalledWith('error_msg', 'Not In Your Notes');
      expect(res.redirect).toHaveBeenCalledWith('/notes');
      expect(res.render).not.toHaveBeenCalled();
    });
  });

  describe('editNote', () => {
    it('should update the note by id, flash, and redirect', async () => {
      req.params.id = 'note1';
      req.body = { title: 'Updated', description: 'Updated Desc' };
      Note.findByIdAndUpdate.mockResolvedValue({});

      await editNote(req, res);

      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith('note1', {
        title: 'Updated',
        description: 'Updated Desc',
      });
      expect(req.flash).toHaveBeenCalledWith('succes_msg', 'Note Updated Succesfully');
      expect(res.redirect).toHaveBeenCalledWith('/notes');
    });
  });

  describe('deleteNote', () => {
    it('should delete the note by id, flash, and redirect', async () => {
      req.params.id = 'note1';
      Note.findByIdAndDelete.mockResolvedValue({});

      await deleteNote(req, res);

      expect(Note.findByIdAndDelete).toHaveBeenCalledWith('note1');
      expect(req.flash).toHaveBeenCalledWith('succes_msg', 'Note Deleted Succesfully');
      expect(res.redirect).toHaveBeenCalledWith('/notes');
    });
  });
});
