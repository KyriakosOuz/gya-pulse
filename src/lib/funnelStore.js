// Tiny in-memory store for saved funnels, shared between the Builder and the
// Saved-funnels page. Seeded with starter templates (template:true); funnels
// saved from the Builder are prepended (template:false).
let saved = [
  { name: 'Ecommerce purchase', type: 'Ecommerce', steps: 5, cr: '5.6%', updated: '2d ago', template: true },
  { name: 'Lead generation', type: 'Leads', steps: 5, cr: '5.2%', updated: '5d ago', template: true },
  { name: 'Newsletter signup', type: 'Leads', steps: 3, cr: '12.1%', updated: '1w ago', template: true },
  { name: 'App install → activate', type: 'App', steps: 4, cr: '31.4%', updated: '2w ago', template: true },
]
const subs = new Set()

export const funnelStore = {
  get: () => saved,
  add: f => { saved = [{ ...f, template: false }, ...saved]; subs.forEach(cb => cb()) },
  subscribe: cb => { subs.add(cb); return () => subs.delete(cb) },
}
