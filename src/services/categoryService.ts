const CATEGORIES_KEY = 'anubama_portfolio_categories_v1';

const DEFAULT_CATEGORIES: string[] = [
  'Full Stack',
  'Frontend',
  'Backend',
  'Web Application',
  'AI / ML',
  'Mobile',
  'Cloud / DevOps',
  'Other'
];

export const categoryService = {
  /**
   * Get all available project categories
   */
  getCategories(): string[] {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with defaults to ensure core categories exist
          const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
          return merged;
        }
      }
    } catch (e) {
      console.error('Error reading categories from localStorage:', e);
    }
    return DEFAULT_CATEGORIES;
  },

  /**
   * Add a new custom category
   */
  addCategory(newCategory: string): string[] {
    const trimmed = newCategory.trim();
    if (!trimmed) return this.getCategories();

    const current = this.getCategories();
    // Case-insensitive check
    const exists = current.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      const updated = [...current, trimmed];
      try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('anubama-categories-changed', { detail: updated }));
      } catch (e) {
        console.error('Error saving new category:', e);
      }
      return updated;
    }
    return current;
  }
};
