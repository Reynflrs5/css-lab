import { BEST_PRACTICES } from '../data/cablingData'

const icons: Record<string, string> = {
  'Bend Radius': '↩',
  'Electromagnetic Interference (EMI)': '⚡',
  'Cable Tying (Velcro vs Zip Ties)': '🔒',
}

const accentColors: Record<string, { border: string; badge: string; badgeText: string; icon: string }> = {
  'Bend Radius': { border: '#f59e0b', badge: '#fef3c7', badgeText: '#92400e', icon: '#f59e0b' },
  'Electromagnetic Interference (EMI)': { border: '#ef4444', badge: '#fee2e2', badgeText: '#991b1b', icon: '#ef4444' },
  'Cable Tying (Velcro vs Zip Ties)': { border: '#10b981', badge: '#d1fae5', badgeText: '#065f46', icon: '#10b981' },
}

export default function CableBestPractices() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="frame">
        <div className="frame-inner">
          <span className="label">Field Standards — Professional Installation</span>
          <h2 style={{ marginTop: '4px', marginBottom: '8px' }}>Cable Management & Installation Best Practices</h2>
          <p style={{ marginBottom: '24px', color: 'var(--graphite)', lineHeight: 1.6, fontSize: '0.92rem' }}>
            Passing the continuity test is only half the job. A professional cabling installation must also follow physical best practices
            to ensure long-term reliability, easy maintenance, and compliance with TIA/EIA standards.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {BEST_PRACTICES.map((item) => {
              const accent = accentColors[item.title]
              return (
                <div
                  key={item.title}
                  className="panel"
                  style={{ borderLeft: `4px solid ${accent.border}`, display: 'flex', gap: '20px', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    background: accent.badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {icons[item.title]}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{item.title}</h3>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '12px',
                        background: accent.badge,
                        color: accent.badgeText,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}>BEST PRACTICE</span>
                    </div>

                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 500 }}>
                      {item.description}
                    </p>

                    <div className="callout" style={{ fontSize: '0.82rem', margin: 0 }}>
                      <span className="label">Why it matters:</span>
                      {item.why}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="panel-dark">
        <div className="label" style={{ color: 'var(--mist)', marginBottom: '8px' }}>TESDA Assessment Note</div>
        <h3 style={{ color: 'var(--paper)', marginBottom: '10px' }}>These are commonly asked theory questions</h3>
        <p style={{ color: 'var(--mist)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
          In the CSS NC II written assessment, examiners often ask why certain practices are followed. 
          Always explain the <strong>effect on the twisted pairs</strong> — the answer almost always comes back to 
          crosstalk, signal noise, or conductor damage.
        </p>
      </div>
    </div>
  )
}
