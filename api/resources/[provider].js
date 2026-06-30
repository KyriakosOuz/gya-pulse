// GET /api/resources/<provider>?client=<id>
// Lists the selectable resources for a connected provider (GA4 property / ad account /
// merchant account). Returns demo data now; wire the provider API when creds exist.
import { DEMO_RESOURCES } from '../_lib/config.js'
// import { getTokens } from '../_lib/tokenStore.js'  // for the real implementation

export default async function handler(req, res) {
  const provider = req.query.provider
  const demo = DEMO_RESOURCES[provider]
  if (!demo) { res.status(404).json({ error: 'no resources for provider' }); return }

  // PRODUCTION: const tokens = await getTokens(clientId, provider)
  //   google → GA4 Admin API accountSummaries.list
  //   meta   → GET /me/adaccounts
  //   merchant → Content API accounts.authinfo
  res.status(200).json({ provider, label: demo.label, items: demo.items })
}
