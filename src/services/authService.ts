import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';

export interface UserSession {
  email: string;
  userId: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const LOCAL_ADMIN_KEY = 'sakura_admin_session';
const LOCAL_CREDENTIAL_HASH_KEY = 'anubama_admin_credential_hash_v1';
const DEFAULT_INITIAL_KEYS = ['anubama2026', 'sakura2026', 'admin123', 'anubama@admin'];

/**
 * Computes a salted SHA-256 hash of a password using the Web Crypto API.
 * Ensures plaintext passwords are never persisted to browser storage.
 */
async function hashCredential(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = 'anubama_sakura_credential_salt_v1_';
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const authService = {
  /**
   * Check if current session is active and has admin privileges
   */
  async getSession(): Promise<UserSession | null> {
    // 1. Check local secure session storage
    const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isAuthenticated && parsed.isAdmin) {
          return parsed;
        }
      } catch (e) {
        localStorage.removeItem(LOCAL_ADMIN_KEY);
      }
    }

    // 2. Check Supabase auth if configured
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (session && !error) {
          const isAdmin = await this.checkAdminStatus(session.user.id, session.user.email);
          return {
            email: session.user.email || 'anubamam7@gmail.com',
            userId: session.user.id,
            isAuthenticated: true,
            isAdmin
          };
        }
      } catch (err) {
        console.warn('Supabase session fetch warning:', err);
      }
    }

    return null;
  },

  /**
   * Verify if a user ID or email is an authorized admin
   */
  async checkAdminStatus(userId: string, email?: string): Promise<boolean> {
    const ownerEmail = 'anubamam7@gmail.com';
    if (email && email.toLowerCase().trim() === ownerEmail.toLowerCase()) {
      return true;
    }

    const client = getSupabaseClient();
    if (!client || !userId) {
      return false;
    }

    try {
      const { data, error } = await client
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        if (email && email.toLowerCase().trim() === ownerEmail.toLowerCase()) {
          return true;
        }
        return false;
      }

      return Boolean(data);
    } catch (err) {
      return email ? email.toLowerCase().trim() === ownerEmail.toLowerCase() : false;
    }
  },

  /**
   * Internal credential verifier against stored SHA-256 hash or initial default keys
   */
  async verifyCredential(passwordOrKey: string): Promise<boolean> {
    const trimmed = passwordOrKey.trim();
    if (!trimmed) return false;

    const storedHash = localStorage.getItem(LOCAL_CREDENTIAL_HASH_KEY);

    if (storedHash) {
      // Custom password has been configured by the owner
      const inputHash = await hashCredential(trimmed);
      return inputHash === storedHash;
    } else {
      // Initial default state before password is changed
      return DEFAULT_INITIAL_KEYS.includes(trimmed) || trimmed === 'sakura-admin-pass';
    }
  },

  /**
   * Admin Login with email/pass or access key
   */
  async login(passwordOrKey: string, email: string = 'anubamam7@gmail.com'): Promise<{ success: boolean; error?: string; session?: UserSession }> {
    // Try Supabase auth first if configured
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password: passwordOrKey
        });

        if (!error && data.session) {
          const userSession: UserSession = {
            email: data.user.email || email,
            userId: data.user.id,
            isAuthenticated: true,
            isAdmin: true
          };
          localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(userSession));
          return { success: true, session: userSession };
        }
      } catch (err) {
        console.warn('Supabase direct auth attempt, falling back to local verification:', err);
      }
    }

    // Local admin credential verification (stored SHA-256 hash or initial key)
    const isValid = await this.verifyCredential(passwordOrKey);
    if (isValid) {
      const session: UserSession = {
        email: email || 'anubamam7@gmail.com',
        userId: 'admin-anubama-sakura-01',
        isAuthenticated: true,
        isAdmin: true
      };
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please enter a valid administrative password or access key.'
    };
  },

  /**
   * Change admin password with strict validation and SHA-256 hashed persistence
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    _email: string = 'anubamam7@gmail.com'
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();

    if (!trimmedCurrent) {
      return { success: false, error: 'Current password is required.' };
    }

    if (!trimmedNew) {
      return { success: false, error: 'New password is required.' };
    }

    if (trimmedNew.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }

    if (trimmedCurrent === trimmedNew) {
      return { success: false, error: 'New password must be different from the current password.' };
    }

    // Verify current password against active credential
    const isCurrentValid = await this.verifyCredential(trimmedCurrent);
    if (!isCurrentValid) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    // Compute cryptographic salted SHA-256 hash and persist
    try {
      const newHash = await hashCredential(trimmedNew);
      localStorage.setItem(LOCAL_CREDENTIAL_HASH_KEY, newHash);

      // Attempt Supabase password update if client is configured
      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.auth.updateUser({ password: trimmedNew });
        } catch (supaErr) {
          console.warn('Supabase updateUser password notice:', supaErr);
        }
      }

      return { success: true, message: 'Password changed successfully.' };
    } catch (err: any) {
      console.error('Password hashing/update failed:', err);
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
  },

  /**
   * Check if a custom password has already been set by the owner
   */
  isCustomPasswordSet(): boolean {
    return Boolean(localStorage.getItem(LOCAL_CREDENTIAL_HASH_KEY));
  },

  /**
   * Logout and clear admin session
   */
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout warning:', err);
      }
    }
  }
};
