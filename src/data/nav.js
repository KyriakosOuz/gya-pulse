// Two-level navigation: rail sources -> secondary sub-tabs.
// Navigation is a function of client type — ecommerce clients get Google Merchant,
// lead-gen clients get Webinars. Everything else is shared, Overview-only per the brief.

const OVERVIEW = { key: 'overview', icon: 'space_dashboard', label: 'Overview', eyebrow: 'Blended · all channels' }

const META = { key: 'meta', icon: 'campaign', label: 'Meta', title: 'META ADS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }

const ADS = { key: 'ads', icon: 'ads_click', label: 'Ads', title: 'GOOGLE ADS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }

const GA4 = { key: 'ga4', icon: 'monitoring', label: 'GA4', title: 'GOOGLE ANALYTICS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'events', icon: 'touch_app', label: 'In-page actions' },
  { key: 'demographics', icon: 'groups', label: 'Demographics' },
] }

const SEARCH = { key: 'search', icon: 'travel_explore', label: 'Search', title: 'SEARCH CONSOLE', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }

// Ecommerce-only
const MERCHANT = { key: 'merchant', icon: 'storefront', label: 'Merchant', title: 'GOOGLE MERCHANT', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }

// Lead-gen-only
const WEBINAR = { key: 'webinar', icon: 'co_present', label: 'Webinars', title: 'ZOOM / WEBINARS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'funnel', icon: 'filter_alt', label: 'Webinar funnel', star: true },
] }

// Placeholder integrations (all types) — content deferred to post-MVP
const YOUTUBE = { key: 'youtube', icon: 'smart_display', label: 'YouTube', title: 'YOUTUBE', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }
const LINKEDIN = { key: 'linkedin', icon: 'work', label: 'LinkedIn', title: 'LINKEDIN', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }
const SOCIAL = { key: 'social', icon: 'thumb_up', label: 'Social', title: 'META SOCIAL (IG / FB)', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
] }

const CLIENTS_NAV = { key: 'clients', icon: 'groups', label: 'Clients', title: 'AGENCY', tabs: [
  { key: 'portfolio', icon: 'grid_view', label: 'Portfolio' },
  { key: 'master', icon: 'leaderboard', label: 'Master roll-up' },
  { key: 'alerts', icon: 'notifications', label: 'Alerts' },
  { key: 'add', icon: 'person_add', label: 'Add client' },
] }

const SETTINGS = { key: 'settings', icon: 'settings', label: 'Settings', title: 'SETTINGS', tabs: [
  { key: 'connections', icon: 'link', label: 'Connections' },
  { key: 'targets', icon: 'target', label: 'KPI targets' },
  { key: 'branding', icon: 'palette', label: 'Branding' },
  { key: 'team', icon: 'group', label: 'Team' },
  { key: 'health', icon: 'monitor_heart', label: 'Tracking health' },
  { key: 'log', icon: 'history_edu', label: 'Reporting log' },
] }

export function buildNav(clientType = 'ecommerce') {
  return [
    OVERVIEW,
    META, ADS, GA4, SEARCH,
    ...(clientType === 'ecommerce' ? [MERCHANT] : []),
    ...(clientType === 'leadgen' ? [WEBINAR] : []),
    { key: 'sep' },
    YOUTUBE, LINKEDIN, SOCIAL,
    { key: 'sep' },
    CLIENTS_NAV, SETTINGS,
  ]
}

// Default export kept for any legacy import.
export const NAV = buildNav('ecommerce')
