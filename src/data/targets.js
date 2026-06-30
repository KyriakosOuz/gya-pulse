// Seed KPI targets. The live, editable copy lives in lib/targetsStore.js, which
// both the campaign detail panel and Settings → KPI targets read from.
// dir: 'low' = lower is better, 'high' = higher is better.
// kind drives how the target is formatted: currency / percent / multiple.
export const TARGETS = {
  cpc:   { label: 'CPC',         dir: 'low',  value: 5,   kind: 'currency', src: 'Meta + Ads' },
  ctr:   { label: 'CTR',         dir: 'high', value: 1.5, kind: 'percent',  src: 'Meta + Ads' },
  roas:  { label: 'ROAS',        dir: 'high', value: 3,   kind: 'multiple', src: 'Meta + Ads' },
  cpl:   { label: 'CPL',         dir: 'low',  value: 120, kind: 'currency', src: 'Ads + Meta' },
  cvr:   { label: 'Conv. rate',  dir: 'high', value: 6,   kind: 'percent',  src: 'GA4' },
  conv:  { label: 'Conversions', dir: 'high' },
  leads: { label: 'Leads',       dir: 'high' },
}

export function fmtTarget(t) {
  if (t.value == null) return ''
  const op = t.dir === 'low' ? '< ' : '> '
  const v = t.kind === 'currency' ? '$' + t.value : t.kind === 'percent' ? t.value + '%' : t.kind === 'multiple' ? t.value + 'x' : t.value
  return op + v
}
