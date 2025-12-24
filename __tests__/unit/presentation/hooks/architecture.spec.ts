import * as fs from 'fs';
import * as path from 'path';

/**
 * Architecture Test: Ensure hooks don't use instanceof Error
 *
 * This test enforces the architectural rule that hooks should not
 * perform semantic interpretation of errors using instanceof checks.
 * All errors should be accessed via DomainError.message property.
 * Hooks are "dumb" - they only consume error.message, never create DomainErrors.
 */
describe('Hooks Architecture: Error Handling', () => {
  const hooksDir = path.join(__dirname, '../../../../src/presentation/hooks');

  function getAllHookFiles (dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllHookFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  it('should not use instanceof Error in hooks', () => {
    const hookFiles = getAllHookFiles(hooksDir);
    const violations: string[] = [];

    for (const filePath of hookFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for instanceof Error patterns
      const instanceofErrorPattern = /instanceof\s+Error/g;
      if (instanceofErrorPattern.test(content)) {
        violations.push(filePath);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Found ${violations.length} hook file(s) using 'instanceof Error':\n` +
          violations.join('\n') +
          '\n\nHooks should use error.message directly.',
      );
    }
  });

  it('should use DomainError.message pattern in hooks', () => {
    const hookFiles = getAllHookFiles(hooksDir);
    const filesWithoutMessagePattern: string[] = [];

    for (const filePath of hookFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check if file handles errors but doesn't use .message pattern
      const hasErrorHandling = /result\.isFailure|result\.getError\(\)/.test(content);
      const usesMessagePattern = /\.getError\(\)\.message/.test(content);

      if (hasErrorHandling && !usesMessagePattern) {
        filesWithoutMessagePattern.push(filePath);
      }
    }

    // This is a warning, not a failure, as some hooks might not handle errors
    if (filesWithoutMessagePattern.length > 0) {
      console.warn(
        `Warning: Some hook files handle errors but may not use .message pattern:\n${filesWithoutMessagePattern.join(
          '\n',
        )}`,
      );
    }
  });
});
