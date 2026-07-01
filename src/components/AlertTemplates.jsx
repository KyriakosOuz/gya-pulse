import { useSyncExternalStore } from 'react'
import { useFilters } from '../lib/filters.js'
import { clientStore } from '../lib/clientStore.js'

// dummy roll-up shown in both the email and the Slack digest
const STATS = [
  { label: 'Spend', value: '€2,410', delta: '+8%', good: true },
  { label: 'Blended ROAS', value: '4.8x', delta: '+0.3x', good: true },
  { label: 'Conversions', value: '312', delta: '+11%', good: true },
  { label: 'CPL', value: '€9.60', delta: '−6%', good: true },
]
const ALERTS = [
  'Harbor Dental — ROAS dropped below 2.5×',
  'Briar & Co — CPA up 38% week-over-week',
]
const DATE = 'Tuesday · Jul 1'

function Logo({ client, size = 34, radius = 9 }) {
  const style = { width: size, height: size, flex: `0 0 ${size}px`, borderRadius: radius, overflow: 'hidden', display: 'grid', placeItems: 'center' }
  if (client?.logo) return <div style={style}><img src={client.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
  return <div style={{ ...style, background: 'linear-gradient(150deg,#2B8FEA,#22FF88)', color: '#04122b', fontWeight: 800, fontSize: size * 0.42 }}>{(client?.initial || 'G')}</div>
}

function EmailPreview({ client }) {
  return (
    <div className="tpl">
      <div className="tpl-cap"><span className="ms">mail</span> Email</div>
      <div className="mail">
        <div className="mail-chrome">
          <div className="mail-from"><Logo client={client} size={30} radius={8} /><div><b>GYA Pulse Reports</b><small>reports@gyapulse.com</small></div><span className="mail-time">8:00 AM</span></div>
          <div className="mail-subj">Your daily performance digest — {DATE}</div>
        </div>
        <div className="mail-brandbar"><b>GYA&nbsp;PULSE</b><span>DAILY DIGEST</span></div>
        <div className="mail-body">
          <div className="mail-hi">Good morning, Apollo 👋</div>
          <p className="mail-sub">Here’s how <b>{client?.name || 'your client'}</b> performed yesterday.</p>
          <div className="mail-kpis">
            {STATS.map(s => (
              <div className="mail-kpi" key={s.label}>
                <span>{s.label}</span>
                <b>{s.value}</b>
                <em className={s.good ? 'up' : 'down'}>{s.delta}</em>
              </div>
            ))}
          </div>
          <div className="mail-sec">⚠️ Needs attention</div>
          {ALERTS.map(a => <div className="mail-alert" key={a}>{a}</div>)}
          <div className="mail-win">🏆 Top performer — <b>Lumen Skincare</b> · 6.1× ROAS</div>
          <a className="mail-cta">Open full dashboard →</a>
          <div className="mail-foot">Daily digest for {client?.name || 'this client'} · <u>Manage cadence</u> · <u>Unsubscribe</u></div>
        </div>
      </div>
    </div>
  )
}

function SlackPreview({ client }) {
  return (
    <div className="tpl">
      <div className="tpl-cap"><span className="ms">tag</span> Slack</div>
      <div className="slack">
        <div className="slack-head"><span className="slack-hash">#</span> gya-pulse-alerts</div>
        <div className="slack-msg">
          <Logo client={client} size={36} radius={8} />
          <div className="slack-b">
            <div className="slack-name">GYA Pulse <span className="slack-app">APP</span> <span className="slack-time">8:00 AM</span></div>
            <div className="slack-text"><b>Daily digest — {DATE}</b> · {client?.name || 'client'} roll-up</div>
            <div className="slack-att green">
              <div className="slack-fields">
                {STATS.map(s => (
                  <div key={s.label}><span>{s.label}</span><b>{s.value} <em>{s.delta}</em></b></div>
                ))}
              </div>
            </div>
            <div className="slack-att red">
              <div className="slack-att-t">⚠️ 2 alerts need attention</div>
              {ALERTS.map(a => <div className="slack-line" key={a}>• {a}</div>)}
            </div>
            <div className="slack-btns"><button className="on">View dashboard</button><button>Snooze 24h</button></div>
            <div className="slack-react"><span>👍 3</span><span>🔥 1</span><span className="slack-thread">2 replies</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MorningDigest() {
  const fil = useFilters()
  const clients = useSyncExternalStore(clientStore.subscribe, clientStore.get)
  const client = clients.find(c => c.id === fil?.clientId) || clients[0]
  return (
    <div className="card">
      <div className="cardhead"><h3>Daily digest automation</h3><span className="tag-src">template preview</span></div>
      <div className="digest-head">
        <span className="ms digest-ic">schedule</span>
        <div className="digest-meta">
          <b>Every morning · 8:00 AM</b>
          <small>Account roll-up + any triggered alerts, delivered to Email &amp; Slack</small>
        </div>
        <span className="digest-badge"><span className="dot" /> Active</span>
      </div>
      <div className="digest-grid">
        <EmailPreview client={client} />
        <SlackPreview client={client} />
      </div>
    </div>
  )
}
