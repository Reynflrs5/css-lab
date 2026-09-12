import { useState } from 'react'
import Rj45Simulator from '../components/Rj45Simulator'
import WiringChallenge from '../components/WiringChallenge'
import CableCalculator from '../components/CableCalculator'
import {
  WIRE_COLORS,
  T568B_PINOUT,
  T568A_PINOUT,
  CABLE_STANDARDS,
  CRIMPING_PROCEDURE,
  FAULT_TYPES
} from '../data/cablingData'
import {
  Wrench,
  FileText,
  AlertTriangle,
  Layers,
  Sparkles,
  Timer,
  Ruler
} from 'lucide-react'
import '../styles/tech-pages.css'

export default function CableLab() {
  const [activeTab, setActiveTab] = useState<'sim' | 'standards' | 'procedure' | 'troubleshooting' | 'challenge' | 'calculator'>('sim')

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-emerald" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>VIRTUAL WORKBENCH // LAB 01 // ANSI/TIA-568.2-D COMPLIANT</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-emerald">RJ-45 Cable Crimping &amp; Testing Lab</span>
          </h1>

          <p className="tech-page-desc">
            Interactive cable laboratory featuring 8P8C crimping workbench simulators, T568A/T568B wire pinout standards,
            dual-unit LED continuity fault sweep testers, and 110 IDC keystone jack punchdown guides.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <Sparkles size={14} color="#10b981" />
              <span>Standards: <strong>TIA/EIA-568-A &amp; T-568-B</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Wrench size={14} color="#38bdf8" />
              <span>Tools: <strong>8P8C Crimper, Stripper, LAN Tester</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Timer size={14} color="#f59e0b" />
              <span>Assessment: <strong>TESDA COC 3 Practical</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Tab Navigation */}
        <div className="tech-tab-strip" style={{ marginBottom: '32px' }}>
          {[
            { id: 'sim', label: '1. Virtual Workbench & Tester', icon: Wrench },
            { id: 'standards', label: '2. Pinout Standards (T568A / T568B)', icon: Layers },
            { id: 'procedure', label: '3. Step-by-Step Crimping Guide', icon: FileText },
            { id: 'troubleshooting', label: '4. LAN Tester Diagnostics', icon: AlertTriangle },
            { id: 'challenge', label: '5. ⏱ Timed Wiring Challenge', icon: Timer },
            { id: 'calculator', label: '6. 📏 Cable Performance Calculator', icon: Ruler },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`tech-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'sim' && (
          <div>
            <Rj45Simulator />
          </div>
        )}

        {/* TAB 2: STANDARDS REFERENCE */}
        {activeTab === 'standards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Side-by-side color charts */}
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Conductor Color Standards</span>
                <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>T-568A vs T-568B Pinout Comparison</h2>
                <p style={{ marginBottom: '24px' }}>
                  Notice that only <strong>Pair 2 (Orange)</strong> and <strong>Pair 3 (Green)</strong> swap places.
                  Pair 1 (Blue) and Pair 4 (Brown) remain in identical pin positions in both standards!
                </p>

                <div className="grid-2" style={{ gap: '24px' }}>
                  {/* T-568B Chart */}
                  <div className="panel" style={{ border: '2px solid var(--ink)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0 }}>T-568B Standard</h3>
                      <span className="tag" style={{ background: '#dcfce7', color: '#15803d', borderColor: '#86efac' }}>
                        Commercial Standard
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                      Primary cabling standard used in commercial installations, homes, and computer labs across the Philippines and globally.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {T568B_PINOUT.map((id, idx) => {
                        const wire = WIRE_COLORS.find(w => w.id === id)!
                        return (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: '#f8fafc',
                            border: '1px solid var(--line)',
                            borderRadius: '2px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '38px' }}>
                                Pin {idx + 1}
                              </span>
                              <div style={{
                                width: '22px',
                                height: '14px',
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: '1px',
                                background: wire.stripeColor
                                  ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${wire.stripeColor} 4px, ${wire.stripeColor} 8px)`
                                  : wire.primaryColor
                              }} />
                              <strong style={{ fontSize: '0.82rem' }}>{wire.name}</strong>
                            </div>
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--steel)' }}>{wire.shortName}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* T-568A Chart */}
                  <div className="panel" style={{ border: '2px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0 }}>T-568A Standard</h3>
                      <span className="tag">Gov / Legacy</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                      Specified by US federal government and legacy telecommunications wiring. Backward compatible with 1-line and 2-line USOC telephone wiring.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {T568A_PINOUT.map((id, idx) => {
                        const wire = WIRE_COLORS.find(w => w.id === id)!
                        const isSwapped = (idx === 0 || idx === 1 || idx === 2 || idx === 5)
                        return (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: isSwapped ? '#eff6ff' : '#f8fafc',
                            border: `1px solid ${isSwapped ? '#93c5fd' : 'var(--line)'}`,
                            borderRadius: '2px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '38px' }}>
                                Pin {idx + 1}
                              </span>
                              <div style={{
                                width: '22px',
                                height: '14px',
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: '1px',
                                background: wire.stripeColor
                                  ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${wire.stripeColor} 4px, ${wire.stripeColor} 8px)`
                                  : wire.primaryColor
                              }} />
                              <strong style={{ fontSize: '0.82rem' }}>{wire.name}</strong>
                            </div>
                            <span className="mono" style={{ fontSize: '0.72rem', color: isSwapped ? '#1d4ed8' : 'var(--steel)' }}>
                              {isSwapped ? '⇄ SWAPPED' : wire.shortName}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cable Types Usage Matrix */}
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Structured Cabling Application Matrix</span>
                <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>When to Use Which Cable</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {CABLE_STANDARDS.map(cs => (
                    <div key={cs.id} className="panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0 }}>{cs.title}</h3>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className="tag">End A: {cs.endA}</span>
                          <span className="tag">End B: {cs.endB}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.86rem', marginBottom: '10px' }}>
                        <strong>Common applications:</strong>
                      </p>
                      <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '0.85rem', color: 'var(--graphite)', marginBottom: '12px' }}>
                        {cs.useCases.map((u, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>{u}</li>
                        ))}
                      </ul>

                      <div className="callout" style={{ margin: 0, fontSize: '0.82rem' }}>
                        <span className="label">TESDA Assessment Tip:</span>
                        {cs.examNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEP-BY-STEP PROCEDURE */}
        {activeTab === 'procedure' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Tools Required Panel */}
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Laboratory Equipment Checklist</span>
                <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>Required Tools & Materials</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { tool: 'RJ45 Modular Crimping Tool', desc: '8P8C crimping chamber with built-in stripper and cut-off blade.' },
                    { tool: 'Cat 5e or Cat 6 UTP Cable', desc: '4 unshielded twisted pairs (24 AWG solid or stranded copper).' },
                    { tool: 'RJ45 Modular Plugs (8P8C)', desc: 'Clear polycarbonate plugs with 8 gold-plated 3-prong contact pins.' },
                    { tool: 'Cable Jacket Stripper / Flush Cutter', desc: 'Precise rotating stripper ring to avoid nicking conductors.' },
                    { tool: 'Master & Remote LAN Tester', desc: 'LED sweep continuity tester with 9V battery.' },
                    { tool: 'Rubber Strain Relief Boots', desc: 'Protects connector latch from snapping during cable pulling.' },
                  ].map(t => (
                    <div key={t.tool} className="panel" style={{ padding: '14px' }}>
                      <div className="label" style={{ marginBottom: '4px' }}>TOOL / ASSET</div>
                      <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{t.tool}</strong>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8-Step Procedure */}
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Standard Operating Procedure</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Practical Crimping Workflow (8 Steps)</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {CRIMPING_PROCEDURE.map(p => (
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
        )}

        {/* TAB 4: DIAGNOSTICS & TROUBLESHOOTING */}
        {activeTab === 'troubleshooting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Diagnostic Methodology</span>
                <h2 style={{ marginTop: '4px', marginBottom: '16px' }}>Reading LAN Cable Tester LED Patterns</h2>
                <p style={{ marginBottom: '24px' }}>
                  During practical assessments, the assessor will plug your newly crimped cable into a tester.
                  Understanding the visual flash pattern allows you to instantly diagnose faults and fix them before final submission.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {FAULT_TYPES.map(f => (
                    <div key={f.name} className="panel" style={{ borderLeft: '4px solid var(--ink)' }}>
                      <div className="label" style={{ marginBottom: '4px' }}>TESTER PATTERN</div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{f.name}</h3>

                      <div style={{
                        background: 'var(--mist)',
                        padding: '8px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        marginBottom: '10px',
                        borderRadius: '2px'
                      }}>
                        {f.testerPattern}
                      </div>

                      <div style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
                        <span className="label" style={{ display: 'block', marginBottom: '2px' }}>Root Cause:</span>
                        <p style={{ margin: 0, fontSize: '0.82rem' }}>{f.cause}</p>
                      </div>

                      <div style={{ fontSize: '0.82rem' }}>
                        <span className="label" style={{ display: 'block', marginBottom: '2px' }}>Corrective Action:</span>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#15803d', fontWeight: 500 }}>{f.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-MDIX note */}
            <div className="panel-dark">
              <div className="label" style={{ color: 'var(--mist)', marginBottom: '8px' }}>Industry Context: What about Auto-MDIX?</div>
              <h3 style={{ color: 'var(--paper)', marginBottom: '10px' }}>Why do we still study Crossover Cables?</h3>
              <p style={{ color: 'var(--mist)', fontSize: '0.88rem', margin: 0 }}>
                Modern Gigabit NICs and switches support <strong>Auto-MDIX</strong> (Automatic Medium-Dependent Interface Crossover),
                which automatically detects and internally reverses Tx and Rx lines even with a straight-through cable.
                However, <strong>TESDA CSS NC II, Cisco CCNA, and CompTIA Network+</strong> certifications still strictly require students to
                demonstrate manual crimping of crossover cables and understand pin transposition at the physical layer.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: TIMED WIRING CHALLENGE */}
        {activeTab === 'challenge' && (
          <WiringChallenge />
        )}

        {/* TAB 6: CABLE PERFORMANCE CALCULATOR */}
        {activeTab === 'calculator' && (
          <CableCalculator />
        )}

      </div>
    </main>
  )
}
