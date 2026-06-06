import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock User model
vi.mock('../../models/User.js', () => {
  const mockUser = vi.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.encryptPassword = vi.fn().mockResolvedValue('hashedpassword');
    this.save = vi.fn().mockResolvedValue(this);
  });

  mockUser.findOne = vi.fn();

  return { default: mockUser };
});

// Mock passport (signIn uses it directly)
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(() => (req, res, next) => next()),
  },
}));

const User = (await import('../../models/User.js')).default;
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
  logOut,
} = await import('../../controllers/users.controller.js');

describe('users.controller', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
      flash: vi.fn(),
      logOut: vi.fn(),
    };
    res = {
      render: vi.fn(),
      redirect: vi.fn(),
    };
  });

  describe('renderSignUpForm', () => {
    it('should render user/signup', () => {
      renderSignUpForm(req, res);
      expect(res.render).toHaveBeenCalledWith('user/signup');
    });
  });

  describe('renderSignInForm', () => {
    it('should render user/signin', () => {
      renderSignInForm(req, res);
      expect(res.render).toHaveBeenCalledWith('user/signin');
    });
  });

  describe('signUp', () => {
    it('should re-render with errors when passwords do not match', async () => {
      req.body = {
        name: 'Test',
        email: 'test@example.com',
        password: 'abcd',
        confirm_password: 'efgh',
      };

      await signUp(req, res);

      expect(res.render).toHaveBeenCalledWith('user/signup', {
        errors: [{ text: 'Passwords do not match' }],
        name: 'Test',
        email: 'test@example.com',
      });
    });

    it('should re-render with errors when password is too short', async () => {
      req.body = {
        name: 'Test',
        email: 'test@example.com',
        password: 'ab',
        confirm_password: 'ab',
      };

      await signUp(req, res);

      expect(res.render).toHaveBeenCalledWith('user/signup', {
        errors: [{ text: 'Password must be at least 4 characters' }],
        name: 'Test',
        email: 'test@example.com',
      });
    });

    it('should show both errors when password is short AND does not match', async () => {
      req.body = {
        name: 'Test',
        email: 'test@example.com',
        password: 'ab',
        confirm_password: 'cd',
      };

      await signUp(req, res);

      expect(res.render).toHaveBeenCalledWith('user/signup', {
        errors: [
          { text: 'Passwords do not match' },
          { text: 'Password must be at least 4 characters' },
        ],
        name: 'Test',
        email: 'test@example.com',
      });
    });

    it('should flash error and redirect when email is already in use', async () => {
      req.body = {
        name: 'Test',
        email: 'existing@example.com',
        password: 'abcde',
        confirm_password: 'abcde',
      };
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await signUp(req, res);

      expect(req.flash).toHaveBeenCalledWith('error_msg', 'The email is already on use.');
      expect(res.redirect).toHaveBeenCalledWith('/signup');
    });

    it('should create, encrypt password, save user, and redirect to /signin', async () => {
      req.body = {
        name: 'Test',
        email: 'new@example.com',
        password: 'abcde',
        confirm_password: 'abcde',
      };
      User.findOne.mockResolvedValue(null);

      await signUp(req, res);

      expect(User).toHaveBeenCalledWith({
        name: 'Test',
        email: 'new@example.com',
        password: 'abcde',
      });
      expect(req.flash).toHaveBeenCalledWith('succes_msg', 'Successfully registered');
      expect(res.redirect).toHaveBeenCalledWith('/signin');
    });
  });

  describe('logOut', () => {
    it('should call req.logOut, flash success, and redirect to /signin', () => {
      req.logOut = vi.fn((cb) => cb());

      logOut(req, res);

      expect(req.logOut).toHaveBeenCalled();
      expect(req.flash).toHaveBeenCalledWith('succes_msg', 'You are logged out now');
      expect(res.redirect).toHaveBeenCalledWith('/signin');
    });
  });
});
