const PROFILE_IMAGE_KEY = 'anubama_portfolio_profile_v1';
const PROFILE_CHANGE_EVENT = 'anubama_profile_image_changed';

export const profileService = {
  /**
   * Get current stored profile picture Data URL or null
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
   * Save new profile picture Data URL
   */
  setProfileImage(dataUrl: string): void {
    try {
      localStorage.setItem(PROFILE_IMAGE_KEY, dataUrl);
      window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: dataUrl }));
    } catch (e) {
      console.error('Error saving profile image to localStorage:', e);
      throw e;
    }
  },

  /**
   * Remove profile picture and revert to Sakura avatar placeholder
   */
  removeProfileImage(): void {
    try {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: null }));
    } catch (e) {
      console.error('Error removing profile image from localStorage:', e);
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
