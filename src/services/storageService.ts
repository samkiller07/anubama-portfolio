import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/pjpeg',
  'image/x-png'
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const STORAGE_BUCKET = 'anubama-portfolio-media';

export interface UploadResult {
  url: string;
  error?: string;
  isLocalMode?: boolean;
}

export const storageService = {
  /**
   * Validate image file size and type (with resilient extension fallback)
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected.' };
    }

    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime = file.type ? ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('image/') : false;

    if (!hasValidExtension && !hasValidMime) {
      return {
        valid: false,
        error: `Unsupported file format. Please choose a JPG, PNG, WEBP, GIF, or SVG image.`
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Image exceeds 5MB size limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`
      };
    }

    return { valid: true };
  },

  /**
   * Read file as Base64 Data URL for local standalone operation and immediate preview
   */
  readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('FileReader did not produce a string result.'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error while reading image file.'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Upload a project cover / thumbnail image
   * If dedicated Anubama Supabase Storage is configured, uploads to Anubama bucket.
   * Otherwise, safely operates in LOCAL FALLBACK mode using Data URL.
   */
  async uploadProjectImage(file: File): Promise<UploadResult> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      return { url: '', error: validation.error };
    }

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `projects/${Date.now()}_${sanitizedName}`;

        const { error: uploadError } = await client.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
          if (data?.publicUrl) {
            return { url: data.publicUrl, isLocalMode: false };
          }
        }
      } catch (err) {
        console.warn('Dedicated Supabase storage unavailable, using local fallback:', err);
      }
    }

    // Isolated Local Fallback Mode: Read as Data URL
    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      return { url: dataUrl, isLocalMode: true };
    } catch (e: any) {
      return { url: '', error: e.message || 'Failed to process image locally.' };
    }
  },

  /**
   * Delete image from storage if applicable
   */
  async deleteProjectImage(imageUrl: string): Promise<void> {
    if (!imageUrl || imageUrl.startsWith('data:')) return;

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await client.storage.from(STORAGE_BUCKET).remove([filePath]);
        }
      } catch (err) {
        console.warn('Supabase deleteProjectImage warning:', err);
      }
    }
  }
};
