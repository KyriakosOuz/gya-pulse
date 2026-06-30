import { CLIENTS as SEED } from '../data/clients.js'

let clients = [...SEED]
const subs = new Set()

export const clientStore = {
  get: () => clients,
  add: c => { clients = [...clients, c]; subs.forEach(cb => cb()) },
  subscribe: cb => { subs.add(cb); return () => subs.delete(cb) },
}
