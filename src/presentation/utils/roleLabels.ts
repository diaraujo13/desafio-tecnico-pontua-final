/**
 * User Role Label Utilities
 *
 * Presentation-layer utilities for displaying user roles in pt-BR locale.
 * Maps domain enums to user-friendly labels.
 *
 * Rules:
 * - Domain enums MUST NOT be modified
 * - This is presentation-only formatting
 * - Labels are in pt-BR
 */

import { UserRole } from '../../domain/enums/UserRole';

/**
 * Mapping of UserRole enum to pt-BR labels
 */
const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.COLLABORATOR]: 'Colaborador',
  [UserRole.MANAGER]: 'Gestor',
  [UserRole.ADMIN]: 'Administrador',
};

/**
 * Gets a user-friendly label for a user role
 *
 * @param role - The UserRole enum value
 * @returns Localized label in pt-BR, or the role value if not found
 */
export function getRoleLabel(role: UserRole | undefined | null): string {
  if (!role) {
    return 'N/A';
  }

  return ROLE_LABELS[role] ?? role;
}
