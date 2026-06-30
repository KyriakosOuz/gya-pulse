import { TARGETS as SEED, fmtTarget } from '../data/targets.js'

function withT(obj) {
  const o = {}
  for (const k in obj) o[k] = { ...obj[k], t: fmtTarget(obj[k]) }
  return o
}
let targets = withT(JSON.parse(JSON.stringify(SEED)))
const subs = new Set()

export const targetsStore = {
  get: () => targets,
  setValue: (key, value) => {
    const e = { ...targets[key], value: Number(value) || 0 }
    e.t = fmtTarget(e)
    targets = { ...targets, [key]: e }
    subs.forEach(cb => cb())
  },
  subscribe: cb => { subs.add(cb); return () => subs.delete(cb) },
}
