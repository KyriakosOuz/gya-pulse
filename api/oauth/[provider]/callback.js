// GET /api/oauth/<provider>/callback?code=&state=
// Verifies state, exchanges the code for durable tokens, stores them, redirects back.
import { PROVIDERS, APP_BASE } from '../../_lib/config.js'
import { verifyState } from '../../_lib/state.js'
import { exchangeCode } from '../../_lib/providers.js'
import { saveConnection } from '../../_lib/tokenStore.js'

export default async function handler(req, res) {
  const provider = req.query.provider
  const { code, state, error } = req.query
  const back = qs => { res.writeHead(302, { Location: `${APP_BASE}/?connected=${provider}&${qs}` }); res.end() }

  if (!PROVIDERS[provider]) { res.status(404).json({ error: 'unknown provider' }); return }
  if (error) return back('error=denied')

  const data = verifyState(state)
  if (!data || data.provider !== provider) return back('error=badstate')

  try {
    const tokens = await exchangeCode(provider, code)
    if (!tokens || tokens.error) return back('error=exchange')
    await saveConnection(data.clientId, provider, { ...tokens, connectedAt: Date.now() })
    // NEXT STEP for production: resource selection (GA4 property / Ads customer /
    // Search Console site / Merchant id for Google; ad-account discovery for Meta).
    back(`client=${encodeURIComponent(data.clientId)}&ok=1`)
  } catch {
    back('error=exception')
  }
}
