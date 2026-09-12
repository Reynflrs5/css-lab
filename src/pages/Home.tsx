import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Cpu,
  Layers,
  Network,
  Cable,
  Wrench,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Zap,
  Volume2,
  Sliders,
  ChevronRight,
} from 'lucide-react'
import '../styles/home.css'

interface BeepInfo {
  pattern: string
  label: string
  code: string
  desc: string
  action: string
  ledColor: string
}

const beepDatabase: Record<string, BeepInfo> = {
  normal: {
    pattern: '1 Short',
    label: 'Normal POST Complete',
    code: 'POST_OK_0x00',
    desc: 'System passed all hardware self-tests. BIOS handoff to OS Bootloader active.',
    action: 'Status: Optimal operation. Proceeding to UEFI/OS boot sequence.',
    ledColor: '#22c55e',
  },
  ram: {
    pattern: 'Continuous Loop',
    label: 'Memory Bank Failure',
    code: 'ERR_DRAM_UNSEATED',
    desc: 'No RAM detected, mismatched DDR generation, or corrupted contact pins on DIMM channel.',
    action: 'Action: Power off, discharge ESD, reseat DIMM in slot A2/B2, check gold contacts.',
    ledColor: '#ef4444',
  },
  display: {
    pattern: '1 Long, 2 Short',
    label: 'Video / GPU Adapter Error',
    code: 'ERR_VGA_DISPLAY',
    desc: 'Graphics card missing PCIe auxiliary 8-pin power, bad slot seating, or monitor disconnected.',
    action: 'Action: Verify PCIe 12VHPWR/8-pin cable, reseat GPU into primary PCIe x16 slot.',
    ledColor: '#f59e0b',
  },
  cpu: {
    pattern: '5 Short',
    label: 'Processor Fault',
    code: 'ERR_CPU_CORE_INIT',
    desc: 'CPU initialization failure. Bent socket pins (LGA), missing EPS 8-pin 12V, or thermal trip.',
    action: 'Action: Inspect ATX12V 8-pin connector, verify socket pin integrity, inspect thermal paste.',
    ledColor: '#ef4444',
  },
}

const t568bColors = [
  { name: 'W-ORG', bg: 'linear-gradient(135deg, #ffffff 50%, #f97316 50%)', border: '#f97316' },
  { name: 'ORG', bg: '#ea580c', border: '#c2410c' },
  { name: 'W-GRN', bg: 'linear-gradient(135deg, #ffffff 50%, #22c55e 50%)', border: '#22c55e' },
  { name: 'BLU', bg: '#2563eb', border: '#1d4ed8' },
  { name: 'W-BLU', bg: 'linear-gradient(135deg, #ffffff 50%, #38bdf8 50%)', border: '#38bdf8' },
  { name: 'GRN', bg: '#16a34a', border: '#15803d' },
  { name: 'W-BRN', bg: 'linear-gradient(135deg, #ffffff 50%, #92400e 50%)', border: '#92400e' },
  { name: 'BRN', bg: '#78350f', border: '#451a03' },
]

const t568aColors = [
  { name: 'W-GRN', bg: 'linear-gradient(135deg, #ffffff 50%, #22c55e 50%)', border: '#22c55e' },
  { name: 'GRN', bg: '#16a34a', border: '#15803d' },
  { name: 'W-ORG', bg: 'linear-gradient(135deg, #ffffff 50%, #f97316 50%)', border: '#f97316' },
  { name: 'BLU', bg: '#2563eb', border: '#1d4ed8' },
  { name: 'W-BLU', bg: 'linear-gradient(135deg, #ffffff 50%, #38bdf8 50%)', border: '#38bdf8' },
  { name: 'ORG', bg: '#ea580c', border: '#c2410c' },
  { name: 'W-BRN', bg: 'linear-gradient(135deg, #ffffff 50%, #92400e 50%)', border: '#92400e' },
  { name: 'BRN', bg: '#78350f', border: '#451a03' },
]

export default function Home() {
  // Hero HUD tabs
  const [hudTab, setHudTab] = useState<'beep' | 'pinout' | 'rails'>('beep')
  const [activeBeepKey, setActiveBeepKey] = useState<string>('normal')
  const [pinoutStandard, setPinoutStandard] = useState<'B' | 'A'>('B')

  // Interactive Workbench tabs
  const [wbTab, setWbTab] = useState<'cidr' | 'cableMatrix' | 'frontPanel'>('cidr')
  const [cidrPrefix, setCidrPrefix] = useState<number>(24)

  const selectedBeep = beepDatabase[activeBeepKey] || beepDatabase.normal

  // Calculate CIDR metrics
  const totalIps = Math.pow(2, 32 - cidrPrefix)
  const usableHosts = cidrPrefix >= 31 ? (cidrPrefix === 31 ? 2 : 1) : totalIps - 2
  const subnetMasks: Record<number, string> = {
    24: '255.255.255.0',
    25: '255.255.255.128',
    26: '255.255.255.192',
    27: '255.255.255.224',
    28: '255.255.255.240',
    29: '255.255.255.248',
    30: '255.255.255.252',
  }

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── 1. COMMAND DECK HERO ─────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-glow" />
        <div className="container">
          <div className="home-hero-grid">
            {/* Left Col: Hero Pitch & CTAs */}
            <div>
              <div className="hero-badge-pill">
                <span className="hero-pulse-dot" />
                <span>SYSTEM ONLINE // TESDA CSS NC-II STANDARD // v2.4 SPEC</span>
              </div>

              <h1 className="hero-main-title">
                <span className="hero-title-accent">Computer Systems Servicing</span>
                <span className="hero-title-gradient">Engineering Reference & Virtual Labs</span>
              </h1>

              <p className="hero-subtitle">
                An industrial-grade interactive workbench and technical curriculum for computer technicians,
                network engineers, and TESDA CSS NC II candidates. Interactive 3D chassis, copper cable simulators,
                live subnetting engines, and diagnostic decoders.
              </p>

              <div className="hero-ctas">
                <Link to="/cable-lab" className="btn-tech-primary">
                  <Cable size={18} />
                  Launch Cable Lab
                </Link>
                <Link to="/pc-parts" className="btn-tech-secondary">
                  <Layers size={18} />
                  Explore 3D PC Atlas
                </Link>
                <Link to="/lessons" className="btn-tech-secondary">
                  <BookOpen size={18} />
                  View Syllabus
                </Link>
              </div>

              <div className="hero-telemetry-strip">
                <div className="hero-telemetry-item">
                  <Activity size={14} color="#10b981" />
                  <span>Curriculum: <strong>TESDA NC-II</strong></span>
                </div>
                <div className="hero-telemetry-item">
                  <Zap size={14} color="#38bdf8" />
                  <span>Interactive Modules: <strong>7 Suites</strong></span>
                </div>
                <div className="hero-telemetry-item">
                  <Terminal size={14} color="#a855f7" />
                  <span>Shortcut: <strong>Press ⌘K / /</strong></span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Live Telemetry HUD */}
            <div className="hero-hud-card">
              <div className="hud-header">
                <div className="hud-header-left">
                  <div className="hud-controls-dots">
                    <span className="hud-dot red" />
                    <span className="hud-dot yellow" />
                    <span className="hud-dot green" />
                  </div>
                  <span className="hud-title">DIAGNOSTIC_TELEMETRY_HUD</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#10b981' }}>
                  ● LIVE SIMULATOR
                </span>
              </div>

              {/* HUD Tabs */}
              <div className="hud-tabs">
                <button
                  type="button"
                  onClick={() => setHudTab('beep')}
                  className={`hud-tab-btn ${hudTab === 'beep' ? 'active' : ''}`}
                >
                  <Volume2 size={13} />
                  POST Decoder
                </button>
                <button
                  type="button"
                  onClick={() => setHudTab('pinout')}
                  className={`hud-tab-btn ${hudTab === 'pinout' ? 'active' : ''}`}
                >
                  <Cable size={13} />
                  T568 Pinout
                </button>
                <button
                  type="button"
                  onClick={() => setHudTab('rails')}
                  className={`hud-tab-btn ${hudTab === 'rails' ? 'active' : ''}`}
                >
                  <Zap size={13} />
                  ATX Rails
                </button>
              </div>

              {/* HUD Content */}
              <div className="hud-body">
                {/* TAB 1: POST Beep Decoder */}
                {hudTab === 'beep' && (
                  <div className="hud-beep-decoder">
                    <div className="hud-signal-bar">
                      <span className="hud-signal-label">POST DIAGNOSTIC STATUS:</span>
                      <span className="hud-signal-output" style={{ color: selectedBeep.ledColor }}>
                        {selectedBeep.pattern}
                      </span>
                    </div>

                    <div className="hud-beep-select-row">
                      {Object.entries(beepDatabase).map(([key, item]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveBeepKey(key)}
                          className={`hud-beep-chip ${activeBeepKey === key ? 'active' : ''}`}
                        >
                          {item.pattern}
                        </button>
                      ))}
                    </div>

                    <div className="hud-beep-result-box" style={{ borderLeftColor: selectedBeep.ledColor }}>
                      <div className="hud-result-title">
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedBeep.ledColor }} />
                        {selectedBeep.label}
                        <code style={{ fontSize: '0.68rem', marginLeft: 'auto', background: '#1c202d', color: '#94a3b8' }}>
                          {selectedBeep.code}
                        </code>
                      </div>
                      <p className="hud-result-desc">{selectedBeep.desc}</p>
                      <div className="hud-result-action">{selectedBeep.action}</div>
                    </div>
                  </div>
                )}

                {/* TAB 2: T568 Pinout Quick View */}
                {hudTab === 'pinout' && (
                  <div className="hud-pinout-view">
                    <div className="pinout-toggle-btns">
                      <button
                        type="button"
                        onClick={() => setPinoutStandard('B')}
                        className={`pinout-toggle-btn ${pinoutStandard === 'B' ? 'active' : ''}`}
                      >
                        TIA/EIA-568-B (Commercial Std)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPinoutStandard('A')}
                        className={`pinout-toggle-btn ${pinoutStandard === 'A' ? 'active' : ''}`}
                      >
                        TIA/EIA-568-A (Residential Std)
                      </button>
                    </div>

                    <div className="pin-wires-grid">
                      {(pinoutStandard === 'B' ? t568bColors : t568aColors).map((wire, idx) => (
                        <div key={idx} className="pin-wire-col">
                          <span className="pin-num">P{idx + 1}</span>
                          <div
                            className="pin-wire-bar"
                            style={{ background: wire.bg, borderColor: wire.border }}
                          />
                          <span className="pin-wire-name">{wire.name}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94a3b8', background: '#090b10', padding: '6px 10px', borderRadius: 4, border: '1px solid #1c202d' }}>
                      <span style={{ color: '#38bdf8' }}>Gigabit Note:</span> All 4 pairs (1-2, 3-6, 4-5, 7-8) are bidirectional for 1000BASE-T Ethernet.
                    </div>
                  </div>
                )}

                {/* TAB 3: ATX PSU Rails */}
                {hudTab === 'rails' && (
                  <div className="hud-rails-grid">
                    <div className="hud-rail-card">
                      <div className="hud-rail-left">
                        <span className="hud-rail-name">+12.0V Rail</span>
                        <span className="hud-rail-purpose">CPU VRM & GPU PCIe</span>
                      </div>
                      <span className="hud-rail-val">+12.08V OK</span>
                    </div>

                    <div className="hud-rail-card">
                      <div className="hud-rail-left">
                        <span className="hud-rail-name">+5.0V Rail</span>
                        <span className="hud-rail-purpose">Logic & SATA Power</span>
                      </div>
                      <span className="hud-rail-val">+5.02V OK</span>
                    </div>

                    <div className="hud-rail-card">
                      <div className="hud-rail-left">
                        <span className="hud-rail-name">+3.3V Rail</span>
                        <span className="hud-rail-purpose">M.2 NVMe & RAM</span>
                      </div>
                      <span className="hud-rail-val">+3.31V OK</span>
                    </div>

                    <div className="hud-rail-card">
                      <div className="hud-rail-left">
                        <span className="hud-rail-name">+5.0V Standby</span>
                        <span className="hud-rail-purpose">Wake-on-LAN & Power SW</span>
                      </div>
                      <span className="hud-rail-val">+5.00V OK</span>
                    </div>
                  </div>
                )}
              </div>

              {/* HUD Footer */}
              <div className="hud-footer">
                <span>BENCHMARK SPEC: ATX 3.0 / TIA-568.2-D</span>
                <Link to="/troubleshooting">
                  Launch Full Diagnostics <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. METRICS & SPECIFICATIONS STRIP ─────────────── */}
      <section className="home-stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item highlight">
              <div className="stat-val">4<span className="stat-val-sub">/4</span></div>
              <div className="stat-label">TESDA Core Competencies</div>
              <div className="stat-desc">Hardware, OS, Networking & Servers</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">7<span className="stat-val-sub">+</span></div>
              <div className="stat-label">Interactive Modules</div>
              <div className="stat-desc">Simulators, cable lab & 3D diagrams</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">35<span className="stat-val-sub">+</span></div>
              <div className="stat-label">Technical Terms & Cards</div>
              <div className="stat-desc">Flip cards & certification quiz mode</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">100<span className="stat-val-sub">%</span></div>
              <div className="stat-label">Schematic Accuracy</div>
              <div className="stat-desc">TIA/EIA standards, voltage & pinouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BENTO MODULE CATALOG ───────────────────────── */}
      <section style={{ padding: '64px 0 24px' }}>
        <div className="container">
          <div className="home-section-head">
            <div className="section-eyebrow">MODULE CATALOG & WORKBENCHES</div>
            <h2 className="section-main-title">Interactive Training Modules</h2>
            <p className="section-subtitle">
              Comprehensive reference guides and interactive simulators mapped directly to the TESDA Computer
              Systems Servicing NC II training regulations.
            </p>
          </div>

          <div className="home-bento-grid">
            {/* CARD 1: Cable Lab (Featured Large) */}
            <Link to="/cable-lab" className="bento-card featured">
              <div className="bento-card-top">
                <span className="bento-card-code">LAB-01</span>
                <span className="bento-card-badge badge-lab">Virtual Simulator</span>
              </div>
              <div className="bento-icon-box icon-box-emerald">
                <Cable size={24} />
              </div>
              <h3>
                RJ-45 Crimping & Continuity Workbench
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                Interactive cable workbench featuring T568A and T568B color pinouts, gold-pin crimping animation,
                wire cutter simulators, 8-channel continuity LED tester, and 110 keystone punchdown block.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">T-568A / T-568B</span>
                <span className="bento-pill">8P8C Crimper</span>
                <span className="bento-pill">LED Continuity Tester</span>
                <span className="bento-pill">110 Keystone Jack</span>
              </div>
            </Link>

            {/* CARD 2: PC Parts Explorer (Featured) */}
            <Link to="/pc-parts" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-02</span>
                <span className="bento-card-badge badge-interactive">3D Interactive</span>
              </div>
              <div className="bento-icon-box icon-box-blue">
                <Layers size={24} />
              </div>
              <h3>
                PC Parts 3D Atlas
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                Exploded chassis architecture, motherboard form factors, expansion slots, and front panel connector maps.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">Chassis Anatomy</span>
                <span className="bento-pill">ATX / Micro-ATX</span>
                <span className="bento-pill">Front Panel Headers</span>
              </div>
            </Link>

            {/* CARD 3: Computer Hardware */}
            <Link to="/hardware" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-01</span>
                <span className="bento-card-badge badge-core">Core Module</span>
              </div>
              <div className="bento-icon-box icon-box-slate">
                <Cpu size={24} />
              </div>
              <h3>
                Hardware Architecture
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                LGA vs PGA CPU sockets, DDR4/DDR5 RAM bandwidth, NVMe M.2 PCIe bus lanes, and power supply calculation.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">CPU Sockets</span>
                <span className="bento-pill">DDR5 Specs</span>
                <span className="bento-pill">PCIe 5.0</span>
                <span className="bento-pill">PSU Rails</span>
              </div>
            </Link>

            {/* CARD 4: Networking */}
            <Link to="/networking" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-03</span>
                <span className="bento-card-badge badge-interactive">Calculator</span>
              </div>
              <div className="bento-icon-box icon-box-indigo">
                <Network size={24} />
              </div>
              <h3>
                Networking & Subnetting
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                Topologies (Star, Mesh, Bus), IPv4 CIDR subnetting calculator, OSI 7-layer model, and IP routing tables.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">OSI 7 Layers</span>
                <span className="bento-pill">IPv4 CIDR Engine</span>
                <span className="bento-pill">Network Topologies</span>
              </div>
            </Link>

            {/* CARD 5: Troubleshooting */}
            <Link to="/troubleshooting" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-04</span>
                <span className="bento-card-badge badge-diagnostic">Diagnostics</span>
              </div>
              <div className="bento-icon-box icon-box-amber">
                <Wrench size={24} />
              </div>
              <h3>
                Diagnostics & POST Decoder
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                Synthesized POST audio beep code player (AMI, Award, Phoenix), BSOD stop-code matrix, and multimeter probe testing.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">POST Audio Player</span>
                <span className="bento-pill">BSOD Matrix</span>
                <span className="bento-pill">Multimeter Tests</span>
              </div>
            </Link>

            {/* CARD 6: Lessons & Curriculum */}
            <Link to="/lessons" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-05</span>
                <span className="bento-card-badge badge-core">Curriculum</span>
              </div>
              <div className="bento-icon-box icon-box-purple">
                <BookOpen size={24} />
              </div>
              <h3>
                TESDA Syllabus & Units
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                Step-by-step competency guidelines, assembly checklists, assessment rubrics, and safe shop protocols.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">COC 1 to COC 4</span>
                <span className="bento-pill">Assembly Rubric</span>
                <span className="bento-pill">OHS & ESD Safety</span>
              </div>
            </Link>

            {/* CARD 7: Glossary & Flashcards */}
            <Link to="/glossary" className="bento-card">
              <div className="bento-card-top">
                <span className="bento-card-code">MOD-06</span>
                <span className="bento-card-badge badge-interactive">Flashcards</span>
              </div>
              <div className="bento-icon-box icon-box-rose">
                <HelpCircle size={24} />
              </div>
              <h3>
                Glossary & Exam Prep
                <ArrowRight size={18} className="bento-arrow-icon" />
              </h3>
              <p>
                35+ key terminology cards with 3D flip card animations, category filters, and timed multiple-choice quiz engine.
              </p>
              <div className="bento-tags">
                <span className="bento-pill">3D Card Flip</span>
                <span className="bento-pill">Practice Quiz</span>
                <span className="bento-pill">35+ Technical Terms</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE WORKBENCH SHOWCASE ─────────────── */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div className="workbench-panel">
            <div className="wb-header">
              <div className="wb-title-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#38bdf8', letterSpacing: '0.08em' }}>
                    QUICK BENCHMARK TOOLS
                  </span>
                </div>
                <h3>Live Workbench Utilities</h3>
                <p>Instant engineering calculators and reference diagrams directly accessible on home.</p>
              </div>

              <div className="wb-tabs-nav">
                <button
                  type="button"
                  onClick={() => setWbTab('cidr')}
                  className={`wb-nav-btn ${wbTab === 'cidr' ? 'active' : ''}`}
                >
                  <Sliders size={14} />
                  CIDR Subnet Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setWbTab('cableMatrix')}
                  className={`wb-nav-btn ${wbTab === 'cableMatrix' ? 'active' : ''}`}
                >
                  <Cable size={14} />
                  Cable Selection Matrix
                </button>
                <button
                  type="button"
                  onClick={() => setWbTab('frontPanel')}
                  className={`wb-nav-btn ${wbTab === 'frontPanel' ? 'active' : ''}`}
                >
                  <Activity size={14} />
                  Front Panel Map
                </button>
              </div>
            </div>

            {/* Workbench Content */}
            <div className="wb-content-area">
              {/* TOOL 1: CIDR Quick Tool */}
              {wbTab === 'cidr' && (
                <div className="cidr-tool-layout">
                  <div className="cidr-controls">
                    <div className="cidr-slider-group">
                      <label>
                        <span>Select Subnet Prefix:</span>
                        <strong style={{ color: '#38bdf8' }}>/{cidrPrefix}</strong>
                      </label>
                      <input
                        type="range"
                        min="24"
                        max="30"
                        value={cidrPrefix}
                        onChange={e => setCidrPrefix(parseInt(e.target.value, 10))}
                        className="cidr-slider"
                      />
                    </div>

                    <div className="cidr-presets">
                      {[24, 26, 28, 30].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCidrPrefix(p)}
                          className={`cidr-preset-btn ${cidrPrefix === p ? 'active' : ''}`}
                        >
                          /{p}
                        </button>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      Move the slider to instantly compute host counts, broadcast boundaries, and subnet mask octets.
                    </div>
                  </div>

                  <div className="cidr-metrics-grid">
                    <div className="cidr-metric-box">
                      <div className="metric-lbl">Subnet Mask</div>
                      <div className="metric-val">{subnetMasks[cidrPrefix]}</div>
                    </div>
                    <div className="cidr-metric-box">
                      <div className="metric-lbl">Usable Hosts</div>
                      <div className="metric-val" style={{ color: '#10b981' }}>{usableHosts.toLocaleString()}</div>
                    </div>
                    <div className="cidr-metric-box">
                      <div className="metric-lbl">Total IP Addresses</div>
                      <div className="metric-val">{totalIps}</div>
                    </div>
                    <div className="cidr-metric-box">
                      <div className="metric-lbl">Network Class</div>
                      <div className="metric-val">Class C (CIDR)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TOOL 2: Cable Matrix */}
              {wbTab === 'cableMatrix' && (
                <div className="cable-matrix-grid">
                  <div className="matrix-type-card">
                    <h5>Straight-Through Cable</h5>
                    <span className="matrix-wiring-tag">Pinout: T568B to T568B (or A to A)</span>
                    <ul className="matrix-uses-list">
                      <li>PC workstation to Network Switch</li>
                      <li>Router Gigabit port to Switch uplink</li>
                      <li>Server NIC to Patch Panel</li>
                    </ul>
                  </div>

                  <div className="matrix-type-card">
                    <h5>Crossover Cable</h5>
                    <span className="matrix-wiring-tag" style={{ color: '#38bdf8', borderColor: '#0284c7' }}>
                      Pinout: T568A to T568B
                    </span>
                    <ul className="matrix-uses-list">
                      <li>Direct PC to PC file transfer</li>
                      <li>Switch to Switch (legacy non-Auto-MDIX)</li>
                      <li>Router to Router direct link</li>
                    </ul>
                  </div>

                  <div className="matrix-type-card">
                    <h5>Rollover / Console Cable</h5>
                    <span className="matrix-wiring-tag" style={{ color: '#eab308', borderColor: '#ca8a04' }}>
                      Pinout: Pin 1 to Pin 8 Inverted
                    </span>
                    <ul className="matrix-uses-list">
                      <li>PC RS-232 COM port to Switch Console</li>
                      <li>Direct serial terminal CLI access</li>
                      <li>Initial headless device configuration</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TOOL 3: Front Panel Header Pinout */}
              {wbTab === 'frontPanel' && (
                <div className="fp-diagram-container">
                  <div className="fp-header-grid">
                    <div className="fp-pin pwr-led">PWR LED+</div>
                    <div className="fp-pin pwr-led">PWR LED-</div>
                    <div className="fp-pin power-sw">PWR SW+</div>
                    <div className="fp-pin power-sw">PWR SW-</div>
                    <div className="fp-pin key-nc">KEY / NC</div>

                    <div className="fp-pin hdd-led">HDD LED+</div>
                    <div className="fp-pin hdd-led">HDD LED-</div>
                    <div className="fp-pin reset-sw">RST SW+</div>
                    <div className="fp-pin reset-sw">RST SW-</div>
                    <div className="fp-pin key-nc">NC</div>
                  </div>

                  <div className="fp-legend-list">
                    <div className="fp-legend-row">
                      <span style={{ color: '#38bdf8' }}>POWER SW (Pins 6-8):</span>
                      <span>Momentary switch (No polarity)</span>
                    </div>
                    <div className="fp-legend-row">
                      <span style={{ color: '#f43f5e' }}>RESET SW (Pins 5-7):</span>
                      <span>Momentary switch (No polarity)</span>
                    </div>
                    <div className="fp-legend-row">
                      <span style={{ color: '#22c55e' }}>POWER LED (Pins 2-4):</span>
                      <span>Polarity sensitive (+ / -)</span>
                    </div>
                    <div className="fp-legend-row">
                      <span style={{ color: '#eab308' }}>HDD LED (Pins 1-3):</span>
                      <span>Polarity sensitive (+ / -)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESDA CSS NC-II QUALIFICATION ROADMAP ──────── */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div className="home-section-head">
            <div className="section-eyebrow">TESDA CURRICULUM ROADMAP</div>
            <h2 className="section-main-title">Certificates of Competency (COC 1 - 4)</h2>
            <p className="section-subtitle">
              The national assessment framework comprises four core competency evaluations. Master each milestone
              to prepare for institutional and national qualification.
            </p>
          </div>

          <div className="competency-timeline">
            <div className="competency-card">
              <span className="coc-tag">COC 1</span>
              <h4>Assemble Computer Hardware</h4>
              <p>
                Disassemble and assemble personal computer hardware, verify compatibility, configure BIOS/UEFI settings, and perform safety procedures.
              </p>
              <Link to="/hardware" className="coc-module-link">
                Hardware Module <ChevronRight size={13} />
              </Link>
            </div>

            <div className="competency-card">
              <span className="coc-tag">COC 2</span>
              <h4>Install Operating System & Software</h4>
              <p>
                Create bootable media, partition storage drives, install Windows/Linux OS, deploy device drivers, and configure application suites.
              </p>
              <Link to="/lessons" className="coc-module-link">
                Lesson Syllabus <ChevronRight size={13} />
              </Link>
            </div>

            <div className="competency-card">
              <span className="coc-tag">COC 3</span>
              <h4>Setup Computer Networks</h4>
              <p>
                Terminate UTP patch cables (T568A/B), punch down 110 keystone jacks, configure router/switch LAN ports, and test packet continuity.
              </p>
              <Link to="/cable-lab" className="coc-module-link">
                Cable Lab Workbench <ChevronRight size={13} />
              </Link>
            </div>

            <div className="competency-card">
              <span className="coc-tag">COC 4</span>
              <h4>Setup Computer Servers</h4>
              <p>
                Configure network operating system (Windows Server), manage Active Directory Domain Services, configure DHCP scopes, and DNS forwarders.
              </p>
              <Link to="/networking" className="coc-module-link">
                Networking Suite <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. INDUSTRY STANDARDS & COMPLIANCE RIBBON ─────── */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div className="standards-banner">
            <div className="standards-info">
              <div className="standards-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="standards-text">
                <h4>Engineered to Global Industry Standards</h4>
                <p>Curriculum references aligned with telecommunication, safety, and electrical standards.</p>
              </div>
            </div>

            <div className="standards-badges">
              <span className="standard-badge">ANSI/TIA-568.2-D</span>
              <span className="standard-badge">IEEE 802.3ab (1000BASE-T)</span>
              <span className="standard-badge">Intel ATX12V 3.0</span>
              <span className="standard-badge">IEC 61340-5-1 ESD</span>
              <span className="standard-badge">ISO/IEC 11801</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
