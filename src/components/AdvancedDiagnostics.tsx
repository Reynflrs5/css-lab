import { ADVANCED_DIAGNOSTICS } from '../data/cablingData'

export default function AdvancedDiagnostics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="frame">
        <div className="frame-inner">
          <span className="label">Beyond Continuity Testing — Professional Standards</span>
          <h2 style={{ marginTop: '4px', marginBottom: '8px' }}>Advanced Cable Diagnostics</h2>
          <p style={{ marginBottom: '24px', color: 'var(--graphite)', lineHeight: 1.6, fontSize: '0.92rem' }}>
            A basic LAN tester only confirms that pins are connected in the right order. Advanced testers like the <strong>Fluke DSX-8000</strong> measure
            signal quality metrics that can silently degrade a network even when the cable "passes" a simple continuity test.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {ADVANCED_DIAGNOSTICS.map((d) => (
              <div key={d.name} className="panel" style={{ borderLeft: '4px solid #6366f1' }}>
                <div className="label" style={{ marginBottom: '4px' }}>ADVANCED FAULT</div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', color: '#4338ca' }}>{d.name}</h3>

                <div style={{
                  background: 'var(--mist)',
                  padding: '8px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  marginBottom: '14px',
                  borderRadius: '4px',
                  color: '#475569'
                }}>
                  <strong>Symptom:</strong> {d.testerPattern}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Root Cause:</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--graphite)', lineHeight: 1.6 }}>{d.cause}</p>
                </div>

                <div>
                  <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Corrective Action:</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d', fontWeight: 500, lineHeight: 1.6 }}>{d.fix}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b' }}>Basic Tester vs. Advanced Certifier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { tester: 'Basic LAN Tester', price: '~₱200–500', checks: ['Continuity (open/short)', 'Miswire detection', 'Pass/Fail for each pin'] },
                { tester: 'Advanced Certifier (Fluke)', price: '~₱150,000+', checks: ['NEXT / FEXT (Crosstalk)', 'Attenuation / Insertion Loss', 'Return Loss', 'Delay Skew', 'TIA-568 Certification Report'] },
              ].map((t) => (
                <div key={t.tester} style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px', color: '#0f172a' }}>{t.tester}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>{t.price}</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.8 }}>
                    {t.checks.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-dark">
        <div className="label" style={{ color: 'var(--mist)', marginBottom: '8px' }}>The 100-Meter Rule — Why It Exists</div>
        <h3 style={{ color: 'var(--paper)', marginBottom: '10px' }}>Physics of Signal Attenuation in Copper</h3>
        <p style={{ color: 'var(--mist)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
          The copper wire in UTP cable has resistance. As an electrical signal travels through it, some energy is lost as heat.
          The TIA/EIA-568 standard limits a single cable segment to <strong>100 meters</strong> to guarantee that enough signal power
          arrives at the other end for reliable communication. Beyond this, you must install a <strong>switch</strong> (which regenerates the signal digitally)
          or switch to <strong>fiber optic cable</strong>, which uses light instead of electricity and can travel kilometers without degradation.
        </p>
      </div>
    </div>
  )
}
