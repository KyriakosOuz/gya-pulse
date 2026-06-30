// Agency clients. `type` drives which pages & metrics the dashboard shows.
export const CLIENTS = [
  { id: 'northwind', name: 'Northwind Outdoors', type: 'ecommerce', initial: 'N', sub: 'Ecommerce client' },
  { id: 'lumen', name: 'Lumen Skincare', type: 'ecommerce', initial: 'L', sub: 'Ecommerce client' },
  { id: 'apex', name: 'Apex Legal', type: 'leadgen', initial: 'A', sub: 'Lead-gen client' },
  { id: 'harbor', name: 'Harbor Dental', type: 'leadgen', initial: 'H', sub: 'Lead-gen client' },
  { id: 'mistral-coffee', name: 'Mistral Coffee', type: 'awareness', initial: 'M', sub: 'Awareness client' },
  { id: 'civic-trust', name: 'Civic Trust', type: 'awareness', initial: 'C', sub: 'Awareness client' },
]

export const TYPE_LABEL = { ecommerce: 'Ecommerce', leadgen: 'Lead-Gen', awareness: 'Awareness' }
