export const DEFAULT_PREVIEW_URL =
  'https://ais-pre-jqshzsk7mviud42zwym3kp-886028545573.us-east1.run.app';

export const RECOMMENDED_DOMAINS = [
  {
    label: 'Custom Subdomain (stay.vbzenhouse.com)',
    value: 'https://stay.vbzenhouse.com',
    type: 'subdomain',
    description: 'Professional subdomain on your custom domain',
  },
  {
    label: 'Root Custom Domain (vbzenhouse.com)',
    value: 'https://vbzenhouse.com',
    type: 'root',
    description: 'Clean branded primary web address',
  },
  {
    label: 'Free Firebase / Web App Subdomain (vbzenhouse.web.app)',
    value: 'https://vbzenhouse.web.app',
    type: 'cloud',
    description: 'Free Google Cloud / Firebase Hosting subdomain',
  },
  {
    label: 'Instant Vanity Redirect (bit.ly/vbzenhouse)',
    value: 'https://bit.ly/vbzenhouse',
    type: 'short',
    description: 'Free instant shortlink redirect for business cards & QR codes',
  },
  {
    label: 'Cloud Run Live URL (ais-pre-...)',
    value: DEFAULT_PREVIEW_URL,
    type: 'direct',
    description: 'Direct AI Studio live deployment server',
  },
];

const DOMAIN_STORAGE_KEY = 'vbzh_custom_subdomain';

export function getCustomDomain(): string {
  if (typeof window === 'undefined') return 'https://vbzenhouse.com';
  const stored = localStorage.getItem(DOMAIN_STORAGE_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  // Default to current origin if on live preview, or fallback to vbzenhouse.com
  return window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://vbzenhouse.com';
}

export function setCustomDomain(domain: string): void {
  if (typeof window === 'undefined') return;
  const clean = domain.trim().replace(/\/+$/, '');
  if (clean) {
    localStorage.setItem(DOMAIN_STORAGE_KEY, clean);
  } else {
    localStorage.removeItem(DOMAIN_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent('vbzh-domain-updated', { detail: clean }));
}
