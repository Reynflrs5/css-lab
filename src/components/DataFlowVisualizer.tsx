import { useState } from 'react'

export default function DataFlowVisualizer() {
  const [cableType, setCableType] = useState<'straight' | 'crossover'>('straight')
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="frame">
        <div className="frame-inner">
          <span className="label">Physical Layer Data Flow</span>
          <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>Crossover vs Straight-Through Visualizer</h2>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
            <button 
              className={`tech-tab-btn ${cableType === 'straight' ? 'active' : ''}`}
              onClick={() => setCableType('straight')}
              style={cableType === 'straight' ? { borderColor: '#3b82f6', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' } : {}}
            >
              Straight-Through (PC to Switch)
            </button>
            <button 
              className={`tech-tab-btn ${cableType === 'crossover' ? 'active' : ''}`}
              onClick={() => setCableType('crossover')}
              style={cableType === 'crossover' ? { borderColor: '#3b82f6', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' } : {}}
            >
              Crossover (PC to PC)
            </button>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            background: '#0f172a',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px'
          }}>
            {/* Device A (PC) */}
            <div style={{ color: '#fff', width: '120px', textAlign: 'center', zIndex: 2 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>PC (MDI)</div>
              <div style={{ background: '#1e293b', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                <div style={{ color: '#60a5fa', marginBottom: '12px', fontSize: '0.85rem' }}>Tx (Pins 1,2) ➔</div>
                <div style={{ color: '#4ade80', fontSize: '0.85rem' }}>Rx (Pins 3,6) ⬅</div>
              </div>
            </div>

            {/* Cable Area */}
            <div style={{ flex: 1, position: 'relative', height: '100%' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} preserveAspectRatio="none">
                {cableType === 'straight' ? (
                  <>
                    <path d="M 0,135 L 100%,135" stroke="#334155" strokeWidth="4" fill="none" />
                    <circle r="4" fill="#60a5fa">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 0,135 L 100%,135" />
                    </circle>
                    
                    <path d="M 100%,165 L 0,165" stroke="#334155" strokeWidth="4" fill="none" />
                    <circle r="4" fill="#4ade80">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 100%,165 L 0,165" />
                    </circle>
                  </>
                ) : (
                  <>
                    <path id="cross1" d="M 0,135 C 50%,135 50%,165 100%,165" stroke="#334155" strokeWidth="4" fill="none" />
                    <circle r="4" fill="#60a5fa">
                      <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href="#cross1" />
                      </animateMotion>
                    </circle>
                    
                    <path id="cross2" d="M 100%,135 C 50%,135 50%,165 0,165" stroke="#334155" strokeWidth="4" fill="none" />
                    <circle r="4" fill="#4ade80">
                      <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href="#cross2" />
                      </animateMotion>
                    </circle>
                  </>
                )}
              </svg>
            </div>

            {/* Device B (Switch or PC) */}
            <div style={{ color: '#fff', width: '120px', textAlign: 'center', zIndex: 2 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                {cableType === 'straight' ? 'Switch (MDI-X)' : 'PC (MDI)'}
              </div>
              <div style={{ background: '#1e293b', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                {cableType === 'straight' ? (
                  <>
                    <div style={{ color: '#60a5fa', marginBottom: '12px', fontSize: '0.85rem' }}>➔ Rx (Pins 1,2)</div>
                    <div style={{ color: '#4ade80', fontSize: '0.85rem' }}>⬅ Tx (Pins 3,6)</div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#4ade80', marginBottom: '12px', fontSize: '0.85rem' }}>Rx (Pins 3,6) ⬅</div>
                    <div style={{ color: '#60a5fa', fontSize: '0.85rem' }}>Tx (Pins 1,2) ➔</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            {cableType === 'straight' ? (
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>Straight-Through Logic:</strong> PCs transmit on pins 1 & 2 (MDI). Switches have their ports internally crossed (MDI-X), so their pins 1 & 2 are designed to receive. Therefore, you just wire it straight!
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>Crossover Logic:</strong> When two PCs connect directly, they both transmit on pins 1 & 2. If you use a straight cable, their transmissions collide. A Crossover cable physically swaps the Tx pins (1,2) of PC 1 directly into the Rx pins (3,6) of PC 2.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
