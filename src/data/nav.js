// Two-level navigation: rail sources -> secondary sub-tabs.
// Navigation is a function of client type — ecommerce and lead-gen clients
// get different targeted sections (Products/Customers vs Leads).

const FUNNELS = { key: 'funnels', icon: 'filter_alt', label: 'Funnels', eyebrow: 'Flagship · funnels & journeys', title: 'FUNNELS & JOURNEYS', tabs: [
  { key: 'builder', icon: 'filter_alt', label: 'Builder', star: true },
  { key: 'ecommerce', icon: 'shopping_cart', label: 'Ecommerce funnel' },
  { key: 'lead', icon: 'person_add', label: 'Lead funnel' },
  { key: 'journeys', icon: 'account_tree', label: 'Journeys' },
  { key: 'saved', icon: 'bookmark', label: 'Saved funnels' },
] }

const GA4 = { key: 'ga4', icon: 'monitoring', label: 'GA4', title: 'GOOGLE ANALYTICS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'realtime', icon: 'bolt', label: 'Realtime' },
  { key: 'acquisition', icon: 'call_split', label: 'Acquisition' },
  { key: 'engagement', icon: 'touch_app', label: 'Engagement' },
  { key: 'funnels', icon: 'filter_alt', label: 'Funnels & Journeys', star: true },
  { key: 'conversions', icon: 'flag', label: 'Conversions' },
  { key: 'monetization', icon: 'payments', label: 'Monetization' },
  { key: 'retention', icon: 'history', label: 'Retention' },
  { key: 'demographics', icon: 'groups', label: 'Demographics' },
  { key: 'tech', icon: 'devices', label: 'Tech' },
  { key: 'explore', icon: 'tune', label: 'Explore' },
] }

const ADS = { key: 'ads', icon: 'ads_click', label: 'Ads', title: 'GOOGLE ADS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'campaigns', icon: 'campaign', label: 'Campaigns' },
  { key: 'adgroups', icon: 'ad_group', label: 'Ad groups / Ads' },
  { key: 'keywords', icon: 'key', label: 'Keywords & terms' },
  { key: 'funnel', icon: 'filter_alt', label: 'Conversion funnel', star: true },
  { key: 'audiences', icon: 'groups', label: 'Audiences' },
  { key: 'geo', icon: 'public', label: 'Devices & Geo' },
] }

const SEARCH = { key: 'search', icon: 'travel_explore', label: 'Search', title: 'SEARCH CONSOLE', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'queries', icon: 'search', label: 'Queries' },
  { key: 'pages', icon: 'description', label: 'Pages' },
  { key: 'geo', icon: 'public', label: 'Countries & devices' },
  { key: 'trends', icon: 'trending_up', label: 'Trends' },
] }

const META = { key: 'meta', icon: 'campaign', label: 'Meta', title: 'META ADS', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'campaigns', icon: 'campaign', label: 'Campaigns' },
  { key: 'adsets', icon: 'ad_group', label: 'Ad sets / Ads' },
  { key: 'breakdowns', icon: 'pie_chart', label: 'Breakdowns' },
] }

const CLIENTS_NAV = { key: 'clients', icon: 'groups', label: 'Clients', title: 'AGENCY', tabs: [
  { key: 'portfolio', icon: 'grid_view', label: 'Portfolio' },
  { key: 'master', icon: 'leaderboard', label: 'Master roll-up' },
  { key: 'alerts', icon: 'notifications', label: 'Alerts' },
  { key: 'add', icon: 'person_add', label: 'Add client' },
] }

const SETTINGS = { key: 'settings', icon: 'settings', label: 'Settings', title: 'SETTINGS', tabs: [
  { key: 'connections', icon: 'link', label: 'Connections' },
  { key: 'health', icon: 'monitor_heart', label: 'Tracking health' },
  { key: 'targets', icon: 'target', label: 'KPI targets' },
  { key: 'alerts', icon: 'notifications', label: 'Alerts' },
  { key: 'branding', icon: 'palette', label: 'Branding' },
  { key: 'team', icon: 'group', label: 'Team' },
] }

// Ecommerce-only sections
const PRODUCTS = { key: 'products', icon: 'inventory_2', label: 'Products', eyebrow: 'Ecommerce · product performance', title: 'PRODUCTS', tabs: [
  { key: 'overview', icon: 'leaderboard', label: 'Top products' },
  { key: 'categories', icon: 'category', label: 'Categories' },
  { key: 'shopping', icon: 'storefront', label: 'Shopping feed' },
  { key: 'inventory', icon: 'inventory', label: 'Inventory & stock' },
] }

const CUSTOMERS = { key: 'customers', icon: 'diversity_3', label: 'Customers', eyebrow: 'Retention & lifetime value', title: 'CUSTOMERS', tabs: [
  { key: 'retention', icon: 'history', label: 'Retention' },
  { key: 'cohorts', icon: 'grid_on', label: 'Cohorts' },
  { key: 'ltv', icon: 'savings', label: 'LTV & CAC' },
] }

// Lead-gen-only section
const LEADS = { key: 'leads', icon: 'person_add', label: 'Leads', eyebrow: 'Lead-gen · pipeline', title: 'LEAD GENERATION', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'funnel', icon: 'filter_alt', label: 'Acquisition funnel', star: true },
  { key: 'channels', icon: 'call_split', label: 'Channels & landing' },
  { key: 'quality', icon: 'verified', label: 'Lead quality' },
] }

// Awareness-only section (TOFU brand reach)
const AWARENESS = { key: 'awareness', icon: 'visibility', label: 'Brand reach', eyebrow: 'Awareness · top of funnel', title: 'BRAND REACH', tabs: [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'reach', icon: 'public', label: 'Reach & geo' },
  { key: 'video', icon: 'play_circle', label: 'Video engagement' },
  { key: 'organic', icon: 'travel_explore', label: 'Organic visibility' },
] }

export function buildNav(clientType = 'ecommerce') {
  const overview = { key: 'overview', icon: 'space_dashboard', label: 'Overview', eyebrow: 'Blended · all channels' }
  const targeted = clientType === 'leadgen' ? [LEADS]
    : clientType === 'awareness' ? [AWARENESS]
    : [PRODUCTS, CUSTOMERS]
  return [
    overview,
    ...targeted,
    FUNNELS,
    { key: 'sep' },
    GA4, ADS, SEARCH, META,
    { key: 'sep' },
    CLIENTS_NAV, SETTINGS,
  ]
}

// Default export kept for any legacy import.
export const NAV = buildNav('ecommerce')
