import { CLOVER_ROLE_PERMISSIONS } from '@/config/clover-roles';

export { CLOVER_ROLE_PERMISSIONS };

// Define permission types based on the structure in CLOVER_ROLE_PERMISSIONS
export type CloverPermission = keyof typeof CLOVER_ROLE_PERMISSIONS.OWNER;