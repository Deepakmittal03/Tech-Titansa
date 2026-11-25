import { createClient } from './supabase';

// ─── Role Definitions ────────────────────────────────────────────────

export type UserRole =
  | 'super_admin'
  | 'store_owner'
  | 'store_manager'
  | 'inventory_manager'
  | 'cashier'
  | 'analyst';

export type Module =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'payments'
  | 'coupons'
  | 'analytics'
  | 'reports'
  | 'stores'
  | 'settings'
  | 'exit_verification';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'manage';

// ─── Role Permissions Matrix ─────────────────────────────────────────

interface ModuleAccess {
  actions: Action[];
  limited?: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Record<string, ModuleAccess>> = {
  super_admin: {
    dashboard:          { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    products:           { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    inventory:          { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    orders:             { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    customers:          { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    payments:           { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    coupons:            { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    analytics:          { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    reports:            { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    stores:             { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    settings:           { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    exit_verification:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  },

  store_owner: {
    dashboard:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    products:   { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    inventory:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    orders:     { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    customers:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    payments:   { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    coupons:    { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    analytics:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    reports:    { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    stores:     { actions: ['view', 'create', 'edit', 'manage'] },
    settings:   { actions: ['view', 'edit', 'manage'] },
  },

  store_manager: {
    dashboard:  { actions: ['view', 'edit'] },
    products:   { actions: ['view', 'create', 'edit'] },
    inventory:  { actions: ['view', 'create', 'edit'] },
    orders:     { actions: ['view', 'create', 'edit', 'manage'] },
    customers:  { actions: ['view', 'edit'] },
    coupons:    { actions: ['view', 'create', 'edit'] },
    reports:    { actions: ['view'] },
  },

  inventory_manager: {
    dashboard:  { actions: ['view'] },
    products:   { actions: ['view', 'create', 'edit'] },
    inventory:  { actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    reports:    { actions: ['view'] },
  },

  cashier: {
    dashboard:          { actions: ['view'], limited: true },
    orders:             { actions: ['view', 'create'], limited: true },
    exit_verification:  { actions: ['view', 'create', 'edit', 'manage'] },
  },

  analyst: {
    dashboard:  { actions: ['view'] },
    analytics:  { actions: ['view', 'manage'] },
    reports:    { actions: ['view', 'create'] },
  },
};

// ─── Authentication ──────────────────────────────────────────────────

/**
 * Sign in with email and password using Supabase Auth.
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get the currently authenticated user.
 * Returns `null` if no user is signed in.
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

// ─── Role & Permission Queries ───────────────────────────────────────

/**
 * Fetch the user's role from the database.
 * Expects a `users` table with `id` and `role` columns.
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user role: ${error.message}`);
  }

  return (data?.role as UserRole) ?? null;
}

/**
 * Fetch the full set of permissions for a user based on their role.
 * Returns a record mapping each accessible module to its allowed actions.
 */
export async function getUserPermissions(
  userId: string
): Promise<Record<string, ModuleAccess>> {
  const role = await getUserRole(userId);

  if (!role) {
    return {};
  }

  return ROLE_PERMISSIONS[role] ?? {};
}

/**
 * Check whether a user has a specific permission string.
 *
 * The `permission` parameter uses the format `"module:action"`,
 * e.g. `"products:edit"` or `"orders:delete"`.
 */
export async function hasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const [module, action] = permission.split(':') as [Module, Action];

  if (!module || !action) {
    throw new Error(
      `Invalid permission format "${permission}". Expected "module:action".`
    );
  }

  const role = await getUserRole(userId);

  if (!role) {
    return false;
  }

  // super_admin has unrestricted access
  if (role === 'super_admin') {
    return true;
  }

  const moduleAccess = ROLE_PERMISSIONS[role]?.[module];

  if (!moduleAccess) {
    return false;
  }

  return moduleAccess.actions.includes(action);
}

/**
 * Check whether a user may perform `action` on `module`.
 * Returns an object with `allowed` (boolean) and, when applicable,
 * a `limited` flag indicating the access is scoped / restricted.
 */
export async function checkAccess(
  userId: string,
  module: Module,
  action: Action
): Promise<{ allowed: boolean; limited: boolean }> {
  const role = await getUserRole(userId);

  if (!role) {
    return { allowed: false, limited: false };
  }

  // super_admin has full, unrestricted access to every module
  if (role === 'super_admin') {
    return { allowed: true, limited: false };
  }

  const moduleAccess = ROLE_PERMISSIONS[role]?.[module];

  if (!moduleAccess) {
    return { allowed: false, limited: false };
  }

  const allowed = moduleAccess.actions.includes(action);

  return { allowed, limited: moduleAccess.limited ?? false };
}
