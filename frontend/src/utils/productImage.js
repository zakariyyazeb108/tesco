const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function productImageSrc(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return API_ORIGIN + imageUrl;
  return null;
}

export function isUploadedImage(imageUrl) {
  return Boolean(productImageSrc(imageUrl));
}
