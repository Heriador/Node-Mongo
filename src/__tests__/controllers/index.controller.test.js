import { describe, it, expect, vi } from 'vitest';
import { renderIndex } from '../../controllers/index.controller.js';

describe('index.controller', () => {
  it('renderIndex should call res.render with "index"', () => {
    const req = {};
    const res = { render: vi.fn() };

    renderIndex(req, res);

    expect(res.render).toHaveBeenCalledWith('index');
  });
});
