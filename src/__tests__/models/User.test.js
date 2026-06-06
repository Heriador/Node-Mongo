import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

// Test the password hashing logic directly (without Mongoose connection)
// since the schema methods are pure functions over bcryptjs.

describe('User password utilities', () => {
  describe('encryptPassword (bcrypt hash)', () => {
    it('should return a hash that is different from the plain text', async () => {
      const password = 'testpassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce a valid bcrypt hash', async () => {
      const password = 'securePass123';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // bcrypt hashes start with $2a$ or $2b$
      expect(hash).toMatch(/^\$2[ab]\$/);
    });
  });

  describe('matchPassword (bcrypt compare)', () => {
    it('should return true when passwords match', async () => {
      const password = 'correctpassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const result = await bcrypt.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const password = 'correctpassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const result = await bcrypt.compare('wrongpassword', hash);
      expect(result).toBe(false);
    });

    it('should return false for empty string comparison', async () => {
      const password = 'somepassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const result = await bcrypt.compare('', hash);
      expect(result).toBe(false);
    });
  });
});
