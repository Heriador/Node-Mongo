import { describe, it, expect, vi } from 'vitest';
import { isAuthenticated } from '../../helpers/auth.js';

describe('isAuthenticated middleware', () => {
  function createMocks(authenticated) {
    const req = {
      isAuthenticated: vi.fn(() => authenticated),
      flash: vi.fn(),
    };
    const res = {
      redirect: vi.fn(),
    };
    const next = vi.fn();
    return { req, res, next };
  }

  it('should call next() when user is authenticated', () => {
    const { req, res, next } = createMocks(true);
    isAuthenticated(req, res, next);

    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it('should flash error and redirect to /signin when not authenticated', () => {
    const { req, res, next } = createMocks(false);
    isAuthenticated(req, res, next);

    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(req.flash).toHaveBeenCalledWith('error_msg', 'Not Authenticated, Log in firts');
    expect(res.redirect).toHaveBeenCalledWith('/signin');
  });
});
