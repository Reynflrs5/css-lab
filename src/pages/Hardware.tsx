import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Cpu,
  Layers,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  HardDrive,
  CircuitBoard,
  Fan,
  Box,
  Disc,
  ArrowRight,
  Sparkles,
  Maximize2,
} from 'lucide-react'
import '../styles/tech-pages.css'
import PcDiagram from '../components/PcDiagram'
import { assemblySteps, disassemblySteps } from '../data/assemblyGuide'


interface ComponentItem {
  name: string
  spec: string
  desc: string
  icon: typeof Cpu
  tag: string
}

const components: ComponentItem[] = [
  {
    name: 'Motherboard (Mainboard)',
    spec: 'Form Factors: ATX, Micro-ATX, Mini-ITX',
    desc: 'Central printed circuit board (PCB) that interconnects all components. Houses the CPU socket, RAM slots, PCIe lanes, chipset, and rear I/O controllers.',
    icon: CircuitBoard,
    tag: 'Chassis Backbone',
  },
  {
    name: 'CPU (Central Processing Unit)',
    spec: 'Sockets: LGA (Intel) / PGA & AM5 (AMD)',
    desc: 'Executes instruction cycles (Fetch-Decode-Execute). Characterized by core/thread count, clock frequency (GHz), L3 cache, and thermal design power (TDP).',
    icon: Cpu,
    tag: 'Processing Unit',
  },
  {
    name: 'RAM (Random Access Memory)',
    spec: 'Standards: DDR4 (288-pin) / DDR5 (288-pin on-die ECC)',
    desc: 'High-speed volatile primary memory for active OS kernel and application data. Operates in Dual-Channel configurations (slots A2 + B2).',
    icon: Layers,
    tag: 'Volatile Memory',
  },
  {
    name: 'GPU (Dedicated Graphics Card)',
    spec: 'Interface: PCIe 4.0 / 5.0 x16 Bus',
    desc: 'Renders video signals, 3D geometry rasterization, and hardware video encode/decode. Requires dedicated 8-pin or 12VHPWR PCIe power cables.',
    icon: Layers,
    tag: 'Display Adapter',
  },
  {
    name: 'PSU (Power Supply Unit)',
    spec: 'Rating: 80 PLUS Bronze / Gold / Platinum',
    desc: 'Converts alternating current (110V/220V AC) to regulated direct current (+12V, +5V, +3.3V, +5VSB DC). ATX 3.0 standard with transient spike suppression.',
    icon: Wrench,
    tag: 'Power Conversion',
  },
  {
    name: 'Storage (NVMe M.2 / SATA SSD)',
    spec: 'Buses: PCIe 4.0 NVMe (up to 7,500 MB/s) / SATA III (6 Gbps)',
    desc: 'Non-volatile storage for boot partition and persistent data. M.2 2280 form factor mounts directly to motherboard with heat-spreader.',
    icon: HardDrive,
    tag: 'Persistent Storage',
  },
  {
    name: 'Case / Chassis',
    spec: 'Enclosures: Full Tower, Mid Tower, Small Form Factor',
    desc: 'Structural enclosure with motherboard standoffs, front I/O headers (USB 3.2, Type-C, HD Audio), and airflow ventilation paths.',
    icon: Box,
    tag: 'Structural Frame',
  },
  {
    name: 'CPU Cooler (Air / AIO Liquid)',
    spec: 'Mounting: 4-pin PWM Fan Header, TDP Rated',
    desc: 'Dissipates processor thermal energy via copper heatpipes, aluminum fins, or closed-loop liquid radiator. Thermal interface material (TIM) mandatory.',
    icon: Fan,
    tag: 'Thermal Solution',
  },
  {
    name: 'Optical Drive (ODD)',
    spec: 'SATA Data + 15-pin SATA Power',
    desc: 'Reads and writes optical media (CD/DVD/Blu-ray). Historically standard, now mostly superseded by high-capacity bootable USB flash drives.',
    icon: Disc,
    tag: 'Legacy Media',
  },
]

export default function Hardware() {
  const [activeTab, setActiveTab] = useState<'components' | 'safety' | 'assembly' | 'disassembly' | 'quiz'>('components')
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})
  const [selectedPartId, setSelectedPartId] = useState<string>('chassis')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const diagramContainerRef = useRef<HTMLDivElement>(null)

  const toggleStep = (idx: number, partId?: string) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }))
    if (partId) {
      setSelectedPartId(partId)
    }
  }

  // Handle Fullscreen for PcDiagram container
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const toggleFullScreen = () => {
    if (!diagramContainerRef.current) return
    if (!document.fullscreenElement) {
      diagramContainerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-cyan" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>HARDWARE ARCHITECTURE // MODULE 01 // TESDA COC 1 STANDARD</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-cyan">Computer Hardware Architecture</span>
          </h1>

          <p className="tech-page-desc">
            Technical identification of core microcomputer components, electrical tolerances, LGA/PGA socket specifications,
            and standard operating procedures for systematic assembly and disassembly.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <CircuitBoard size={14} color="#38bdf8" />
              <span>Components: <strong>9 Core Hardware Parts</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <ShieldAlert size={14} color="#f59e0b" />
              <span>Safety Standard: <strong>IEC 61340-5-1 ESD Safe</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Link to="/pc-parts" style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={14} />
                <span>Open 3D PC Parts Atlas →</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Dropdown */}
        <div className="tech-dropdown-container" style={{ marginBottom: '32px', position: 'relative' }}>
          <select 
            value={activeTab} 
            onChange={(e) => {
              const val = e.target.value as 'components' | 'safety' | 'assembly' | 'disassembly' | 'quiz';
              setActiveTab(val);
              if (val === 'assembly') setSelectedPartId('chassis');
              if (val === 'disassembly') setSelectedPartId('psu');
            }}
            className="tech-dropdown"
          >
            <option value="components">1. Component Identification & Specs</option>
            <option value="safety">2. Tools & ESD Safety Protocols</option>
            <option value="assembly">3. Assembly SOP Checklist (10 Steps)</option>
            <option value="disassembly">4. Disassembly SOP Checklist (8 Steps)</option>
          </select>
        </div>

        {/* TAB 1: Components */}
        {activeTab === 'components' && (
          <div>
            <div className="tech-callout cyan">
              <div className="tech-callout-text">
                <strong>Technician Standard Operating Procedure:</strong> Always verify a component by its <strong>form factor</strong>, 
                <strong> socket / interface keying</strong>, and <strong>power draw rating (TDP / Amperage)</strong> before installation. Never force misaligned connectors.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {components.map(c => {
                const Icon = c.icon
                return (
                  <div key={c.name} className="tech-card">
                    <div className="tech-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 4, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="tech-badge tech-badge-blue">{c.tag}</span>
                        </div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                      {c.name}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#2563eb', marginBottom: '10px', fontWeight: 600 }}>
                      {c.spec}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.55 }}>
                      {c.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Tools & Safety */}
        {activeTab === 'safety' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="tech-card">
              <div className="tech-card-header">
                <span className="tech-card-title">
                  <Wrench size={18} color="#2563eb" />
                  Essential Technician Toolkit
                </span>
                <span className="tech-badge tech-badge-blue">Tooling Standard</span>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {[
                  { name: 'Phillips #1 & #2 Screwdrivers', note: 'Magnetic tip for standoff and case screws' },
                  { name: 'Anti-Static ESD Wrist Strap', note: 'With alligator clip connected to bare unpainted case chassis' },
                  { name: 'Thermal Paste Compound', note: 'Non-conductive carbon/ceramic base (Arctic MX-4 / Noctua NT-H1)' },
                  { name: 'Curved Precision Tweezers', note: 'For grasping fallen header screws and jumper switches' },
                  { name: 'Digital Multimeter (DMM)', note: 'For probing ATX 24-pin DC voltages (+12V, +5V, +3.3V)' },
                  { name: 'Canned Compressed Air', note: 'For clearing dust from heatsink fins and PCIe sockets' },
                  { name: 'Velcro Ties & Flush Cutters', note: 'For cable harness bundling and strain relief' },
                ].map(t => (
                  <li key={t.name} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.note}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tech-card">
              <div className="tech-card-header">
                <span className="tech-card-title">
                  <ShieldAlert size={18} color="#d97706" />
                  ESD &amp; Electrical Safety Rules
                </span>
                <span className="tech-badge tech-badge-amber">Safety Protocol</span>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {[
                  { rule: 'Continuous Grounding', desc: 'Equalize electrical potential between your body and the equipment chassis before touching delicate PCBs.' },
                  { rule: 'Edge-Handling Protocol', desc: 'Hold motherboards, RAM DIMMs, and PCIe cards strictly by non-conductive edges. Never touch exposed contacts or pins.' },
                  { rule: 'Capacitor Bleed-Down', desc: 'Always unplug the AC power cord and press the chassis power switch for 5 seconds to discharge internal PSU capacitors before touching internals.' },
                  { rule: 'Static-Dissipative Work Mat', desc: 'Work on an anti-static vinyl or rubber bench mat. Never assemble a PC directly on carpet or polystyrene foam.' },
                  { rule: 'Anti-Static Packaging', desc: 'Store unused components inside metallized static shielding bags until immediately ready for insertion.' },
                ].map(r => (
                  <li key={r.rule} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#d97706' }}>●</span> {r.rule}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.desc}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3 & 4: Interactive Assembly / Disassembly with PC Diagram */}
        {/* TAB 3 & 4: Interactive Assembly / Disassembly with PC Diagram */}
        {(activeTab === 'assembly' || activeTab === 'disassembly') && (
          <div 
            ref={diagramContainerRef}
            className={`tech-split-view ${isFullscreen ? 'fullscreen-mode' : ''}`}
          >
            {/* Left Column: Steps */}
            <div>
              <div className={`tech-callout ${activeTab === 'assembly' ? '' : 'amber'}`}>
                <div className="tech-callout-text">
                  <strong>{activeTab === 'assembly' ? 'Interactive Assembly Checklist:' : 'Caution on Disassembly:'}</strong> 
                  {activeTab === 'assembly' 
                    ? ' Click on each step to highlight the component in the 3D model.' 
                    : ' Click steps to view components. Always verify that all display cables and power cords are disconnected.'}
                </div>
              </div>

              <div className="steps-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: isFullscreen ? 'none' : '600px', overflowY: isFullscreen ? 'visible' : 'auto', paddingRight: '8px' }}>
                {(activeTab === 'assembly' ? assemblySteps : disassemblySteps).map((s, idx) => {
                  const stepIndex = activeTab === 'assembly' ? idx : idx + 50
                  const done = !!completedSteps[stepIndex]
                  const isSelected = selectedPartId === s.partId
                  
                  return (
                    <div
                      key={s.title}
                      onClick={() => toggleStep(stepIndex, s.partId)}
                      className="tech-step-card"
                      style={{
                        cursor: 'pointer',
                        background: done ? '#f0fdf4' : (isSelected ? '#f8fafc' : '#ffffff'),
                        borderColor: done ? '#86efac' : (isSelected ? '#3b82f6' : '#e2e8f0'),
                        boxShadow: isSelected ? '0 0 0 1px #3b82f6' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        className="tech-step-index"
                        style={{
                          background: done ? '#22c55e' : (isSelected ? '#3b82f6' : '#f1f5f9'),
                          color: done || isSelected ? '#ffffff' : '#0f172a',
                        }}
                      >
                        {done ? <CheckCircle2 size={18} /> : `${idx + 1}`}
                      </div>
                      <div className="tech-step-content" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ 
                            textDecoration: done ? 'line-through' : 'none', 
                            color: done ? '#15803d' : (isSelected ? '#1d4ed8' : '#0f172a'),
                            marginBottom: '4px'
                          }}>
                            Step {idx + 1}: {s.title}
                          </h4>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: done ? '#16a34a' : '#94a3b8' }}>
                            {done ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{s.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Interactive 3D Model */}
            <div 
              style={{ 
                position: 'sticky', 
                top: '80px', 
                height: '650px', 
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                background: '#0f172a',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ 
                position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 
              }}>
                <button
                  type="button"
                  onClick={toggleFullScreen}
                  className="btn-tech-secondary"
                  style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Maximize2 size={14} />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <PcDiagram 
                  selectedId={selectedPartId} 
                  onSelect={setSelectedPartId}
                  isFullscreen={isFullscreen} 
                  initialZoom={1.2}
                  atlasMode={true}
                />
              </div>
            </div>
          </div>
        )}



        {/* Footer Link to PC Parts */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <Link to="/pc-parts" className="btn-tech-primary" style={{ display: 'inline-flex' }}>
            Open 3D PC Parts &amp; Chassis Atlas
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}
