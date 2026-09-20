import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const PROFILE_IMAGE_KEY = 'anubama_portfolio_profile_v1';
const PROFILE_CHANGE_EVENT = 'anubama_profile_image_changed';

export const profileService = {
  /**
   * Get current stored profile picture URL/Data URL synchronously (for instant UI paint)
   */
  getProfileImage(): string | null {
    try {
      return localStorage.getItem(PROFILE_IMAGE_KEY) || null;
    } catch (e) {
      console.error('Error reading profile image from localStorage:', e);
      return null;
    }
  },

  /**
   * Fetch canonical profile image from Supabase database across all devices
   */
  async fetchProfileImage(): Promise<string | null> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client
          .from('profile')
          .select('profile_image_url')
          .eq('id', 'anubama_profile')
          .maybeSingle();

        if (!error && data) {
          const remoteUrl = data.profile_image_url || null;
          const currentLocal = localStorage.getItem(PROFILE_IMAGE_KEY);

          if (remoteUrl) {
            localStorage.setItem(PROFILE_IMAGE_KEY, remoteUrl);
          } else {
            localStorage.removeItem(PROFILE_IMAGE_KEY);
          }

          if (remoteUrl !== currentLocal) {
            window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: remoteUrl }));
          }
          return remoteUrl;
        }
      } catch (err) {
        console.warn('Dedicated Supabase fetchProfileImage notice, using local cache:', err);
      }
    }
    return this.getProfileImage();
  },

  /**
   * Save new profile picture (persists to Supabase profile table & local cache)
   */
  async setProfileImage(imageUrl: string): Promise<void> {
    try {
      // 1. Update local cache immediately
      localStorage.setItem(PROFILE_IMAGE_KEY, imageUrl);
      window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: imageUrl }));

      // 2. Persist to dedicated Supabase database
      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        const { error } = await client
          .from('profile')
          .upsert({
            id: 'anubama_profile',
            profile_image_url: imageUrl,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('Supabase profile table update notice:', error);
        }
      }
    } catch (e) {
      console.error('Error saving profile image:', e);
      throw e;
    }
  },

  /**
   * Remove custom profile picture and revert to default avatar
   */
  async removeProfileImage(): Promise<void> {
    try {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: null }));

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        await client
          .from('profile')
          .upsert({
            id: 'anubama_profile',
            profile_image_url: null,
            updated_at: new Date().toISOString()
          });
      }
    } catch (e) {
      console.error('Error removing profile image:', e);
      throw e;
    }
  },

  /**
   * Subscribe to profile image updates across components and tabs
   */
  onProfileImageChange(callback: (newUrl: string | null) => void): () => void {
    const customHandler = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      callback(customEvent.detail);
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === PROFILE_IMAGE_KEY) {
        callback(e.newValue || null);
      }
    };

    window.addEventListener(PROFILE_CHANGE_EVENT, customHandler);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener(PROFILE_CHANGE_EVENT, customHandler);
      window.removeEventListener('storage', storageHandler);
    };
  }
};
