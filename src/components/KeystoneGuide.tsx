import { useState } from 'react'
import { KEYSTONE_COLORS, KEYSTONE_PROCEDURE, WIRE_COLORS } from '../data/cablingData'

export default function KeystoneGuide() {
  const [standard, setStandard] = useState<'A' | 'B'>('B')

  const renderWire = (wireId: string) => {
    const wire = WIRE_COLORS.find(w => w.id === wireId)
    if (!wire) return null

    return (
      <div style={{
        width: '32px',
        height: '16px',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: '2px',
        background: wire.stripeColor
          ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${wire.stripeColor} 4px, ${wire.stripeColor} 8px)`
          : wire.primaryColor,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }} title={wire.name} />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="frame">
        <div className="frame-inner">
          <span className="label">Keystone Jack Visualization</span>
          <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>110-Block Punchdown (90-Degree)</h2>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <button 
              className={`tech-tab-btn ${standard === 'A' ? 'active' : ''}`}
              onClick={() => setStandard('A')}
              style={standard === 'A' ? { borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)' } : {}}
            >
              T-568A Standard
            </button>
            <button 
              className={`tech-tab-btn ${standard === 'B' ? 'active' : ''}`}
              onClick={() => setStandard('B')}
              style={standard === 'B' ? { borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)' } : {}}
            >
              T-568B Standard
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'center' }}>
            {/* Jack Visualization */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                background: '#e2e8f0',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#475569'
              }}>
                REAR VIEW (IDC CONTACTS)
              </div>
              
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '24px',
                borderRadius: '4px',
                display: 'flex',
                gap: '32px'
              }}>
                {/* Left Side Contacts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {KEYSTONE_COLORS[standard].left.map((wireId, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>L{idx+1}</span>
                      {renderWire(wireId)}
                      <div style={{ width: '12px', height: '16px', background: '#cbd5e1', border: '1px solid #94a3b8', borderRadius: '1px' }} />
                    </div>
                  ))}
                </div>

                <div style={{ width: '2px', background: '#e2e8f0' }} />

                {/* Right Side Contacts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {KEYSTONE_COLORS[standard].right.map((wireId, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '16px', background: '#cbd5e1', border: '1px solid #94a3b8', borderRadius: '1px' }} />
                      {renderWire(wireId)}
                      <span className="mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>R{idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ maxWidth: '300px' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Color Code Reference</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--graphite)', lineHeight: 1.6 }}>
                Unlike the RJ45 plug where all 8 wires lay in a flat row (Pins 1-8), the keystone jack splits the pairs into two rows of 4.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--graphite)', lineHeight: 1.6 }}>
                The manufacturer prints a sticker on the side of the jack. Always match the solid and striped colors exactly as shown on the row labeled <strong>{standard}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="frame">
        <div className="frame-inner">
          <span className="label">Standard Operating Procedure</span>
          <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Punchdown Workflow (5 Steps)</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {KEYSTONE_PROCEDURE.map(p => (
              <div key={p.step} style={{
                display: 'flex',
                gap: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--line)'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  flexShrink: 0,
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}>
                  0{p.step}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.88rem', margin: '0 0 10px 0', color: 'var(--ink)' }}>{p.action}</p>

                  <div className="callout" style={{ fontSize: '0.82rem', marginBottom: p.warning ? '8px' : '0' }}>
                    <span className="label">Technician Pro-Tip:</span>
                    {p.keyTip}
                  </div>

                  {p.warning && (
                    <div style={{
                      padding: '8px 12px',
                      background: '#fef2f2',
                      borderLeft: '3px solid #ef4444',
                      fontSize: '0.8rem',
                      color: '#991b1b',
                      marginTop: '8px'
                    }}>
                      <strong>CRITICAL WARNING:</strong> {p.warning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
