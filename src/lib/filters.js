import { createContext, useContext } from 'react'

// ---- filter model ----
export const CHANNELS = ['Paid Search', 'Paid Social', 'Email', 'Direct', 'Organic', 'Referral', 'Other']
const SHARE = { 'Paid Search': .28, 'Paid Social': .26, 'Organic': .18, 'Email': .12, 'Direct': .08, 'Referral': .05, 'Other': .03 }

export const RANGES = {
  '7d':  { label: 'Last 7 days',  factor: 0.26, prev: '7 days' },
  '28d': { label: 'Last 28 days', factor: 1,    prev: '28 days' },
  '90d': { label: 'Last 90 days', factor: 3.3,  prev: '90 days' },
}

export const DEFAULT_FILTERS = { range: '28d', channels: [], compare: false }

export const FilterContext = createContext(null)
export const useFilters = () => useContext(FilterContext)

export function filterSig(f) {
  return `${f.range}|${[...f.channels].sort().join(',')}|${f.compare ? 'c' : ''}`
}

// ---- number helpers ----
// "rate" metrics (ratios) must NOT scale with date range / channel volume
const RATE = /\brate\b|roas|ctr|cpc|cpl|cpa|cpm|aov|avg|average|median|position|\bltv\b|\bcac\b|\bprice\b|per |frequency|repeat|retention|churn|share|qualified|engagement|score/i
const isRate = s => RATE.test(String(s || ''))

function parseMetric(s) {
  const str = String(s).trim()
  const m = str.match(/^([^\d-]*)(-?[\d,]*\.?\d+)\s*([a-zA-Z%]*)$/)
  if (!m) return null
  const pre = m[1] || '', suf = m[3] || ''
  let n = parseFloat(m[2].replace(/,/g, ''))
  if (isNaN(n)) return null
  let unit = suf
  if (/^k$/i.test(suf)) { n *= 1e3; unit = '' }
  else if (/^m$/i.test(suf)) { n *= 1e6; unit = '' }
  return { pre, n, unit }
}
const trim1 = x => (Math.round(x * 10) / 10).toString()
function fmtMetric(v, pre, unit) {
  if (unit) return pre + (Math.round(v * 100) / 100) + unit
  const a = Math.abs(v)
  let out
  if (a >= 1e6) out = trim1(v / 1e6) + 'M'
  else if (a >= 1e3) out = trim1(v / 1e3) + 'k'
  else out = Math.round(v).toLocaleString()
  return pre + out
}
// scale a display string by factor; returns unchanged if it's not a plain volume number
function scaleStr(s, factor) {
  const p = parseMetric(s)
  if (!p || p.unit) return s
  return fmtMetric(p.n * factor, p.pre, p.unit)
}
const num = v => typeof v === 'number'
const round = v => Math.round(v * 100) / 100
const isChannelArr = arr => Array.isArray(arr) && arr.filter(x => CHANNELS.includes(x)).length >= Math.ceil(arr.length / 2)

// ---- the transform ----
export function transformContent(content, f) {
  if (!content) return content
  const r = RANGES[f.range] || RANGES['28d']
  const chSel = f.channels && f.channels.length ? f.channels : null
  const chFactor = chSel ? Math.min(1, Math.max(.05, chSel.reduce((a, c) => a + (SHARE[c] || .05), 0))) : 1
  const factor = r.factor * chFactor
  const ctx = { factor, r, chSel, compare: f.compare }

  const out = { ...content }
  if (content.sub) out.sub = content.sub.replace(/previous \d+ days/i, 'previous ' + r.prev)
  out.blocks = content.blocks.map(b => transformBlock(b, ctx))
  return out
}

function transformBlock(block, ctx) {
  const { factor, chSel, compare } = ctx
  const b = JSON.parse(JSON.stringify(block)) // specs are plain JSON

  if (b.type === 'kpis') {
    b.items = b.items.map(it => isRate(it.l) ? it : { ...it, v: scaleStr(it.v, factor) })
    return b
  }

  if (b.type === 'chart') {
    if (b.kind === 'line') {
      const rateChart = isRate(b.title)
      b.series = b.series.map(s => {
        const rate = rateChart || isRate(s.name)
        return rate ? s : { ...s, data: s.data.map(v => num(v) ? round(v * factor) : v) }
      })
      if (compare && b.series.length) {
        const base = b.series[0]
        b.series = [...b.series, { name: 'Previous', color: '#5b6b8a', dashed: true, data: base.data.map(v => num(v) ? round(v * 0.9) : v) }]
      }
    } else if (b.kind === 'bar' || b.kind === 'hbar') {
      if (isChannelArr(b.x) && chSel) {
        const keep = b.x.map((x, i) => [x, b.data[i]]).filter(([x]) => chSel.includes(x))
        if (keep.length) { b.x = keep.map(k => k[0]); b.data = keep.map(k => k[1]) }
      } else if (!isRate(b.title)) {
        b.data = b.data.map(v => num(v) ? round(v * factor) : v)
      }
    } else if (b.kind === 'donut') {
      if (b.data && chSel && b.data.every(d => CHANNELS.includes(d.name))) {
        const kept = b.data.filter(d => chSel.includes(d.name))
        if (kept.length) b.data = kept
      }
    } else if (b.kind === 'funnel') {
      if (b.steps) b.steps = b.steps.map(st => ({ ...st, value: Math.round(st.value * factor) }))
    }
    return b
  }

  if (b.type === 'geo') {
    if (b.data) b.data = b.data.map((row, i) => i === 0 ? row : [row[0], Math.round(row[1] * factor)])
    return b
  }

  if (b.type === 'table') {
    const chanTable = b.rows && b.rows.some(r => CHANNELS.includes(r.name))
    let rows = b.rows
    if (chanTable && chSel) {
      const kept = rows.filter(r => !CHANNELS.includes(r.name) || chSel.includes(r.name))
      if (kept.length) rows = kept
    }
    rows = rows.map(r => {
      const nr = { ...r }
      b.columns.forEach(c => {
        if (c.k === 'name' || c.k === 'status' || isRate(c.label)) return
        const p = parseMetric(nr[c.k])
        if (p && !p.unit) nr[c.k] = fmtMetric(p.n * factor, p.pre, p.unit)
      })
      return nr
    })
    b.rows = rows
    return b
  }

  return b
}

// expose for count-up animation
export { parseMetric, fmtMetric }
