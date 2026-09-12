import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Network,
  Cable,
  Wrench,
} from 'lucide-react'
import '../styles/tech-pages.css'

interface SyllabusModule {
  module: string
  coc: string
  title: string
  desc: string
  icon: typeof Cpu
  topics: string[]
  hours: string
  to: string
  isLab?: boolean
}

const syllabus: SyllabusModule[] = [
  {
    module: 'MOD-01',
    coc: 'COC 1',
    title: 'Computer Hardware Architecture',
    desc: 'Internal architecture, motherboard anatomy, LGA/PGA CPU sockets, assembly order, and ESD safe handling.',
    icon: Cpu,
    topics: ['Component identification', 'Motherboard anatomy', 'Assembly procedure', 'Disassembly procedure', 'ESD safety & tools'],
    hours: '12 hrs',
    to: '/hardware',
  },
  {
    module: 'MOD-02',
    coc: 'COC 1',
    title: 'PC Parts 3D Atlas & Chassis',
    desc: 'Interactive 3D model and exploded chassis diagrams, front-panel pinouts, and expansion slot specifications.',
    icon: Layers,
    topics: ['Motherboard', 'CPU Sockets', 'RAM DDR5', 'GPU PCIe x16', 'PSU Rails', 'Storage M.2', 'Cooling PWM'],
    hours: '8 hrs',
    to: '/pc-parts',
  },
  {
    module: 'MOD-03',
    coc: 'COC 3',
    title: 'Networking & IP Subnetting',
    desc: 'LAN/WAN topologies, OSI 7-layer architecture, IPv4 Classful/CIDR subnet calculations, and Ethernet cable categories.',
    icon: Network,
    topics: ['Network topologies', 'OSI 7-Layer model', 'IPv4 Subnetting & CIDR', 'Cable standards (Cat5e–Cat7)', 'Routing & Switch devices'],
    hours: '14 hrs',
    to: '/networking',
  },
  {
    module: 'LAB-01',
    coc: 'COC 3',
    title: 'RJ45 Cable Crimping & Testing Lab',
    desc: 'Hands-on virtual crimping bench, continuity LED sequencer, 110 keystone punchdown, and T568A/B standards.',
    icon: Cable,
    topics: ['T-568A vs T-568B pinout standards', 'Straight-Through vs Crossover cabling', 'Interactive wire arranging workbench', 'Dual-unit LAN continuity tester sweep', 'Crimping SOP & fault diagnostics'],
    hours: '6 hrs',
    to: '/cable-lab',
    isLab: true,
  },
  {
    module: 'MOD-04',
    coc: 'COC 1 & 4',
    title: 'Troubleshooting & Diagnostics',
    desc: 'Methodical diagnostic flowcharts, synthesized BIOS POST beep code decoder, BSOD stop-codes, and multimeter rail testing.',
    icon: Wrench,
    topics: ['Diagnostic methodology', 'POST sequence', 'Beep codes (AMI/Award/Phoenix)', 'Multimeter PSU testing', 'Preventive maintenance schedule'],
    hours: '10 hrs',
    to: '/troubleshooting',
  },
]

export default function Lessons() {
  const [selectedCoc, setSelectedCoc] = useState<string>('ALL')

  const filteredSyllabus = selectedCoc === 'ALL'
    ? syllabus
    : syllabus.filter(m => m.coc.includes(selectedCoc))

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-purple" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>CURRICULUM ARCHITECTURE // TESDA CSS NC-II // TRAINING REGULATIONS</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-purple">Course Outline &amp; Syllabus</span>
          </h1>

          <p className="tech-page-desc">
            Core theory modules, competency standards, and hands-on laboratory simulators mapped to the TESDA Computer
            Systems Servicing National Certificate II qualification framework.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <BookOpen size={14} color="#c084fc" />
              <span>Total Units: <strong>5 Core Modules</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Clock size={14} color="#38bdf8" />
              <span>Total Hours: <strong>50 Training Hours</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Sparkles size={14} color="#34d399" />
              <span>Assessment: <strong>COC 1 to COC 4</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'COC 1', 'COC 3', 'COC 4'].map(coc => (
              <button
                key={coc}
                type="button"
                onClick={() => setSelectedCoc(coc)}
                className={`tech-tab-btn ${selectedCoc === coc ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '6px 14px' }}
              >
                {coc === 'ALL' ? 'All Units' : coc}
              </button>
            ))}
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
            Showing {filteredSyllabus.length} module{filteredSyllabus.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Module Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
          {filteredSyllabus.map((mod, i) => {
            const Icon = mod.icon
            return (
              <div key={mod.module} className="tech-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      background: mod.isLab ? '#ecfdf5' : '#f1f5f9',
                      color: mod.isLab ? '#059669' : '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="tech-badge tech-badge-indigo">{mod.module}</span>
                        <span className="tech-badge tech-badge-emerald">{mod.coc}</span>
                        {mod.isLab && <span className="tech-badge tech-badge-amber">Interactive Simulator</span>}
                      </div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '4px 0' }}>
                        {mod.title}
                      </h2>
                      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Allocated Duration
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                      {mod.hours}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 4, border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Core Learning Competencies
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {mod.topics.map(t => (
                      <span key={t} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        padding: '4px 10px',
                        borderRadius: 3,
                        fontSize: '0.78rem',
                        color: '#334155'
                      }}>
                        <CheckCircle2 size={12} color="#10b981" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    to={mod.to}
                    id={`open-mod-${i + 1}`}
                    className="btn-tech-primary"
                    style={{ fontSize: '0.78rem', padding: '9px 18px' }}
                  >
                    Open Module Workbench
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Overview Spec Table */}
        <div style={{ marginTop: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              // CURRICULUM SPECIFICATION MATRIX
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', margin: '4px 0' }}>
              Module Summary &amp; Direct Access
            </h3>
          </div>

          <div className="tech-table-container">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Competency Unit</th>
                  <th>Module Title</th>
                  <th>Hours</th>
                  <th>Direct Launch</th>
                </tr>
              </thead>
              <tbody>
                {syllabus.map(m => (
                  <tr key={m.module}>
                    <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{m.module}</strong></td>
                    <td><span className="tech-badge tech-badge-indigo">{m.coc}</span></td>
                    <td>{m.title}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{m.hours}</td>
                    <td>
                      <Link to={m.to} style={{ color: '#2563eb', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Launch <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
