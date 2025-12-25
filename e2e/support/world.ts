/**
 * Cucumber World Object
 *
 * Shared state across test steps.
 * Contains ONLY test state, NO business logic.
 *
 * Rules:
 * - Do NOT import UseCases, repositories, or container
 * - Do NOT add business logic here
 * - Only store test state (user roles, IDs, etc.)
 */

import { setWorldConstructor, World } from '@cucumber/cucumber';

export interface TestWorld extends World {
  currentUserRole?: 'COLLABORATOR' | 'MANAGER' | 'ADMIN';
  lastVacationId?: string;
  lastErrorMessage?: string;
  currentScreen?: string;
}

export class CustomWorld implements TestWorld {
  public currentUserRole?: 'COLLABORATOR' | 'MANAGER' | 'ADMIN';
  public lastVacationId?: string;
  public lastErrorMessage?: string;
  public currentScreen?: string;

  constructor(_options: { attach: World['attach']; parameters: World['parameters'] }) {
    // Initialize world state
    this.currentUserRole = undefined;
    this.lastVacationId = undefined;
    this.lastErrorMessage = undefined;
    this.currentScreen = undefined;
  }

  /**
   * Reset world state between scenarios
   */
  reset(): void {
    this.currentUserRole = undefined;
    this.lastVacationId = undefined;
    this.lastErrorMessage = undefined;
    this.currentScreen = undefined;
  }
}

setWorldConstructor(CustomWorld);
