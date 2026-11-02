import heroBedImg from '../assets/images/studio_queen_bed_authentic.jpg';
import kitchenTvBathImg from '../assets/images/studio_kitchen_tv_bath_authentic.jpg';
import livingSofaImg from '../assets/images/studio_living_sofa_authentic.jpg';
import beachImg from '../assets/images/chics_beach_coastal_1792188626657.jpg';
import gardenTrellisImg from '../assets/images/studio_garden_grape_trellis_authentic.jpg';
import { Property, GalleryPhoto } from '../types/rental';

export const AUTHENTIC_IMAGES = {
  hero: heroBedImg,
  kitchen: kitchenTvBathImg,
  workspace: livingSofaImg,
  beach: beachImg,
  bathroom: gardenTrellisImg,
};

/**
 * Resolves any image URL to ensure compatibility across mobile browsers and production builds.
 * Converts old unbundled /src/ paths or stale localStorage URLs into bundled Vite assets or /public/ URLs.
 */
export function resolveImageUrl(url: string | undefined, fallbackKey?: keyof typeof AUTHENTIC_IMAGES): string {
  if (!url || typeof url !== 'string') {
    return fallbackKey ? AUTHENTIC_IMAGES[fallbackKey] : heroBedImg;
  }

  // Preserve user-uploaded Base64 data URLs
  if (url.startsWith('data:image/')) {
    return url;
  }

  // Preserve full external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Match known authentic property photos
  if (url.includes('studio_queen_bed_authentic') || url.includes('studioc1')) {
    return heroBedImg;
  }
  if (url.includes('studio_kitchen_tv_bath_authentic') || url.includes('studioc4') || url.includes('studioc_f10fa8fd')) {
    return kitchenTvBathImg;
  }
  if (url.includes('studio_living_sofa_authentic') || url.includes('studioc2')) {
    return livingSofaImg;
  }
  if (url.includes('studio_garden_grape_trellis_authentic') || url.includes('studioc3')) {
    return gardenTrellisImg;
  }
  if (url.includes('chics_beach_coastal')) {
    return beachImg;
  }

  // If pointing to /src/assets/images/, redirect to /images/ which is served from /public
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }

  return url;
}

/**
 * Sanitizes property image paths from localStorage to ensure all photos display reliably on mobile phones
 */
export function sanitizeProperty(saved: Property): Property {
  if (!saved || !saved.images) return saved;

  const hero = resolveImageUrl(saved.images.hero, 'hero');
  const kitchen = resolveImageUrl(saved.images.kitchen, 'kitchen');
  const workspace = resolveImageUrl(saved.images.workspace, 'workspace');
  const beach = resolveImageUrl(saved.images.beach, 'beach');
  const bathroom = resolveImageUrl(saved.images.bathroom, 'bathroom');

  const additionalPhotos: GalleryPhoto[] = (saved.images.additionalPhotos || []).map((photo) => ({
    ...photo,
    url: resolveImageUrl(photo.url),
  }));

  return {
    ...saved,
    images: {
      hero,
      kitchen,
      workspace,
      beach,
      bathroom,
      additionalPhotos,
    },
  };
}
