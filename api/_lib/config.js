// Central OAuth config. Real credentials come from Vercel env vars; when they're
// missing a provider runs in "demo mode" (simulated connect) so the prototype works.
const REDIRECT_BASE = process.env.OAUTH_REDIRECT_BASE || 'https://gya-pulse.vercel.app'

export const APP_BASE = REDIRECT_BASE
export const STATE_SECRET = process.env.OAUTH_STATE_SECRET || 'dev-insecure-change-me'

export const PROVIDERS = {
  google: {
    label: 'Google',
    enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${REDIRECT_BASE}/api/oauth/google/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/adwords',
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/content',
    ],
  },
  meta: {
    label: 'Meta',
    enabled: !!(process.env.META_APP_ID && process.env.META_APP_SECRET),
    clientId: process.env.META_APP_ID,
    clientSecret: process.env.META_APP_SECRET,
    configId: process.env.META_LOGIN_CONFIG_ID,
    redirectUri: `${REDIRECT_BASE}/api/oauth/meta/callback`,
    authUrl: 'https://www.facebook.com/v23.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v23.0/oauth/access_token',
    graphBase: 'https://graph.facebook.com/v23.0',
  },
  // Google Merchant Center uses the same Google OAuth client, content scope only.
  // A client's Merchant account may be a different Google login than their GA4/Ads,
  // so it's a separate connection.
  merchant: {
    label: 'Google Merchant Center',
    enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${REDIRECT_BASE}/api/oauth/merchant/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/content'],
  },
}

// Store connectors with their own OAuth (Shopify/Woo) — demo-only for now.
export const STORE_PROVIDERS = ['shopify', 'woocommerce']

// Demo resource lists shown in the resource-selection step until real APIs are wired.
export const DEMO_RESOURCES = {
  google: { label: 'GA4 property', items: [{ id: 'properties/391044820', name: 'Northwind — Web' }, { id: 'properties/388210199', name: 'Northwind — App' }] },
  meta: { label: 'Ad account', items: [{ id: 'act_1029384756', name: 'Northwind Ads' }, { id: 'act_5582109934', name: 'Northwind — EU' }] },
  merchant: { label: 'Merchant account', items: [{ id: '118842203', name: 'Northwind Store feed' }] },
}
