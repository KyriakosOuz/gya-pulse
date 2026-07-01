import { createContext, useContext } from 'react'

// ---- filter model ----
export const CHANNELS = ['Paid Search', 'Paid Social', 'Email', 'Direct', 'Organic', 'Referral', 'Other']
const SHARE = { 'Paid Search': .28, 'Paid Social': .26, 'Organic': .18, 'Email': .12, 'Direct': .08, 'Referral': .05, 'Other': .03 }

export const RANGES = {
  '7d':  { label: 'Last 7 days',  days: 7,  prev: '7 days' },
  '28d': { label: 'Last 28 days', days: 28, prev: '28 days' },
  '90d': { label: 'Last 90 days', days: 90, prev: '90 days' },
}

export const DEFAULT_FILTERS = { range: '28d', channels: [], compare: false, customStart: null, customEnd: null }

export const FilterContext = createContext(null)
export const useFilters = () => useContext(FilterContext)

// ---- date-range model ----
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY = 86400000
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
const REF_END = startOfToday()                      // anchor "today" for relative ranges — no data past today
export const toISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const TODAY_ISO = toISO(REF_END)
export const daysAgoISO = n => toISO(new Date(REF_END.getTime() - n * DAY))
const fmtDay = d => MONTHS[d.getMonth()] + ' ' + d.getDate()
const parseISO = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d) }

// resolve the active filter → concrete window: days, end date, magnitude factor, label
export function rangeInfo(f) {
  if (f.range === 'custom' && f.customStart && f.customEnd) {
    const s = parseISO(f.customStart), e = parseISO(f.customEnd)
    const days = Math.max(1, Math.round((e - s) / DAY) + 1)
    return { days, end: e, factor: days / 28, prev: days + ' days', label: `${fmtDay(s)} – ${fmtDay(e)}` }
  }
  const r = RANGES[f.range] || RANGES['28d']
  return { days: r.days, end: REF_END, factor: r.days / 28, prev: r.prev, label: r.label }
}

// n date labels evenly spanning the `days`-long window ending at `end`
function timeLabels(n, days, end) {
  if (n <= 1) return [fmtDay(end)]
  const span = days - 1
  const raw = Array.from({ length: n }, (_, i) => fmtDay(new Date(end.getTime() - span * DAY * (1 - i / (n - 1)))))
  // when points outnumber days, blank repeated labels so the axis reads cleanly
  let prev = null
  return raw.map(l => { if (l === prev) return ''; prev = l; return l })
}

// a chart x-axis is a reporting-window trend when every label carries a month name
const MONTH_RE = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i
const isDateAxis = x => Array.isArray(x) && x.length > 1 && x.every(l => MONTH_RE.test(String(l)))

// how many points a trend should have for a given window (daily → weekly → monthly)
function pointsForDays(days) {
  if (days <= 9) return Math.max(2, days)                          // daily
  if (days <= 35) return 8                                         // ~4-day steps (keeps the 28-day look)
  if (days <= 120) return Math.min(14, Math.round(days / 7) + 1)   // weekly
  return Math.min(13, Math.round(days / 30) + 1)                   // monthly
}
// stretch/compress a data series to n points, preserving its shape
function resample(arr, n) {
  const m = arr.length
  if (n === m || m === 0) return arr.slice()
  if (m === 1) return Array(n).fill(arr[0])
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * (m - 1), lo = Math.floor(t), hi = Math.min(m - 1, lo + 1)
    return round(arr[lo] * (1 - (t - lo)) + arr[hi] * (t - lo))
  })
}
// a series carries volume (scales with the window) unless it's a ratio/%/duration
const VOL_RE = /impression|click|view|user|session|reach|lead|conversion|revenue|spend|value|count|sales|visitor|follower|subscrib|watch|\blike|comment|\bshare|order|install|signup|sign-up/i
const isRateSeries = (name, title) => /%/.test(name) || isRate(name) || (isRate(title) && !VOL_RE.test(name))

// deterministic hashing → stable pseudo-random spikes (no Math.random, so charts are consistent)
const strHash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
function hashRand(seed) {
  let t = (seed + 0x6D2B79F5) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
// give a trend lively upstream/downstream spikes while keeping its overall shape (endpoints steadier)
function addSpikes(data, seed, amp = 0.09) {
  const n = data.length
  return data.map((v, i) => {
    if (!num(v)) return v
    const r = hashRand(seed + i * 2654435761)
    const edge = (i === 0 || i === n - 1) ? 0.4 : 1          // don't blow out the first/last anchor points
    const kick = r > 0.8 ? (r - 0.5) * amp * 3.4 : (r - 0.5) * amp * 1.8   // ~1 in 5 points spikes harder
    return round(v * (1 + kick * edge))
  })
}

export function filterSig(f) {
  return `${f.range}|${f.customStart || ''}|${f.customEnd || ''}|${[...f.channels].sort().join(',')}|${f.compare ? 'c' : ''}`
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

// weekly video-completion data sized to the window: one week per ~7 days, date-labelled, capped for legibility
const VID_COLORS = ['#2B8FEA', '#28C3AE', '#25E29C', '#22FF88']
const VID_STAGES = ['25%', '50%', '75%', '100%']
export function videoWeeks(ri) {
  const n = Math.min(8, Math.max(1, Math.round(ri.days / 7)))
  return Array.from({ length: n }, (_, i) => {
    const end = new Date(ri.end.getTime() - (n - 1 - i) * 7 * DAY)
    const t = n === 1 ? 1 : i / (n - 1)
    const wob = (hashRand(strHash('vidwk') + i * 97) - 0.5) * 2   // -1..1 stable jitter
    return {
      label: fmtDay(end),
      vals: [
        Math.round(40 + t * 15 + wob * 3),
        Math.round(26 + t * 11 + wob * 2),
        Math.round(14 + t * 10 + wob * 2),
        Math.round(7 + t * 8 + wob * 1.5),
      ],
    }
  })
}
export { VID_COLORS, VID_STAGES }

// ---- the transform ----
export function transformContent(content, f) {
  if (!content) return content
  const ri = rangeInfo(f)
  const chSel = f.channels && f.channels.length ? f.channels : null
  const chFactor = chSel ? Math.min(1, Math.max(.05, chSel.reduce((a, c) => a + (SHARE[c] || .05), 0))) : 1
  const factor = ri.factor * chFactor
  const ctx = { factor, ri, chSel, compare: f.compare }

  const out = { ...content }
  if (content.sub) out.sub = content.sub.replace(/previous \d+ days/i, 'previous ' + ri.prev)
  out.blocks = content.blocks.map(b => transformBlock(b, ctx))
  return out
}

function transformBlock(block, ctx) {
  const { factor, chSel, compare, ri } = ctx
  const b = JSON.parse(JSON.stringify(block)) // specs are plain JSON

  if (b.type === 'kpis') {
    b.items = b.items.map(it => ({
      ...it,
      v: isRate(it.l) ? it.v : scaleStr(it.v, factor),
      sp: it.sp ? addSpikes(it.sp, strHash(it.l), 0.13) : it.sp,
    }))
    return b
  }

  if (b.type === 'chart') {
    // time-series trends render for the selected window: point count + x labels + magnitude
    const timeChart = (b.kind === 'line' || b.kind === 'stack') && ri && isDateAxis(b.x)
    const n = timeChart ? pointsForDays(ri.days) : null
    if (timeChart) b.x = timeLabels(n, ri.days, ri.end)
    if (b.kind === 'line') {
      b.series = b.series.map(s => {
        const rate = isRateSeries(s.name, b.title)
        let data = timeChart ? resample(s.data, n) : s.data
        if (!rate) data = data.map(v => num(v) ? round(v * factor) : v)
        data = addSpikes(data, strHash(b.title + '|' + s.name), rate ? 0.05 : 0.09)
        return { ...s, data }
      })
      if (compare && b.series.length) {
        const base = b.series[0]
        b.series = [...b.series, { name: 'Previous', color: '#5b6b8a', dashed: true, data: base.data.map(v => num(v) ? round(v * 0.9) : v) }]
      }
    } else if (b.kind === 'stack') {
      if (b.weekly === 'video' && ri) {          // weekly bars follow the selected date range
        const wk = videoWeeks(ri)
        b.x = wk.map(w => w.label)
        b.series = VID_STAGES.map((name, k) => ({ name, color: VID_COLORS[k], data: wk.map(w => w.vals[k]) }))
        return b
      }
      b.series = b.series.map(s => {
        const rate = isRateSeries(s.name, b.title)
        let data = timeChart ? resample(s.data, n) : s.data
        if (timeChart && !rate) data = data.map(v => num(v) ? round(v * factor) : v)
        data = addSpikes(data, strHash(b.title + '|' + s.name), rate ? 0.05 : 0.08)
        return { ...s, data }
      })
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
