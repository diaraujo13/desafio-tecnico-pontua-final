import { tokens } from '../../../../src/presentation/theme/tokens';

// Testes dos tokens primitivos: agnósticos ao tema

describe('Design Tokens', () => {
  describe('tokens structure', () => {
    it('should export tokens object with all required keys', () => {
      expect(tokens).toHaveProperty('colors');
      expect(tokens).toHaveProperty('spacing');
      expect(tokens).toHaveProperty('borderRadius');
      expect(tokens).toHaveProperty('typography');
      expect(tokens).toHaveProperty('shadows');
    });

    it('should have colors with primary, neutral, status, and semantic keys', () => {
      expect(tokens.colors).toHaveProperty('primary');
      expect(tokens.colors).toHaveProperty('neutral');
      expect(tokens.colors).toHaveProperty('status');
      expect(tokens.colors).toHaveProperty('semantic');
    });

    it('should have primary color scale', () => {
      expect(tokens.colors.primary).toHaveProperty('50');
      expect(tokens.colors.primary).toHaveProperty('100');
      expect(tokens.colors.primary).toHaveProperty('500');
      expect(tokens.colors.primary).toHaveProperty('700');
      expect(tokens.colors.primary).toHaveProperty('900');
    });

    it('should have status colors', () => {
      expect(tokens.colors.status).toHaveProperty('pending');
      expect(tokens.colors.status).toHaveProperty('approved');
      expect(tokens.colors.status).toHaveProperty('rejected');
      expect(tokens.colors.status).toHaveProperty('cancelled');
    });

    it('should have semantic colors', () => {
      expect(tokens.colors.semantic).toHaveProperty('success');
      expect(tokens.colors.semantic).toHaveProperty('error');
      expect(tokens.colors.semantic).toHaveProperty('warning');
      expect(tokens.colors.semantic).toHaveProperty('info');
    });

    it('should have spacing scale', () => {
      expect(tokens.spacing).toHaveProperty('xs');
      expect(tokens.spacing).toHaveProperty('sm');
      expect(tokens.spacing).toHaveProperty('md');
      expect(tokens.spacing).toHaveProperty('lg');
      expect(tokens.spacing).toHaveProperty('xl');
      expect(tokens.spacing).toHaveProperty('xxl');
    });

    it('should have borderRadius scale', () => {
      expect(tokens.borderRadius).toHaveProperty('sm');
      expect(tokens.borderRadius).toHaveProperty('md');
      expect(tokens.borderRadius).toHaveProperty('lg');
      expect(tokens.borderRadius).toHaveProperty('full');
    });

    it('should have typography with fontFamily, fontSize, and lineHeight', () => {
      expect(tokens.typography).toHaveProperty('fontFamily');
      expect(tokens.typography).toHaveProperty('fontSize');
      expect(tokens.typography).toHaveProperty('lineHeight');
    });

    it('should have shadows with sm and md', () => {
      expect(tokens.shadows).toHaveProperty('sm');
      expect(tokens.shadows).toHaveProperty('md');
    });
  });

  describe('token values', () => {
    it('should have valid spacing values (positive numbers)', () => {
      Object.values(tokens.spacing).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });

    it('should have valid borderRadius values', () => {
      Object.values(tokens.borderRadius).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid color hex values', () => {
      const checkColor = (color: string) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      };

      checkColor(tokens.colors.primary[500]);
      checkColor(tokens.colors.status.pending);
      checkColor(tokens.colors.semantic.success);
    });
  });
});



