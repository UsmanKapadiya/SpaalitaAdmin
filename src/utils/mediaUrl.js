import { API_ORIGIN } from '../services/api';

/**
 * Build a URL the browser can load from an image value saved by the API.
 *
 * - absolute, data: and blob: URLs are returned unchanged
 * - "/uploads/..." paths are served by the API server
 * - "userProfile/x.jpg" style paths live under /uploads/
 * - bare file names live in /uploads/{folder}/ (product and gift card images: "products")
 */
export const mediaUrl = (src, folder = '') => {
  if (!src || typeof src !== 'string') return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/')) return `${API_ORIGIN}${src}`;
  if (src.startsWith('uploads/')) return `${API_ORIGIN}/${src}`;
  if (src.includes('/') || !folder) return `${API_ORIGIN}/uploads/${src}`;
  return `${API_ORIGIN}/uploads/${folder}/${src}`;
};

export default mediaUrl;
