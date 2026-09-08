import { Link } from 'react-router-dom'

const syllabus = [
  {
    module: 'MOD-01',
    title: 'Computer Hardware',
    topics: ['Component identification', 'Motherboard anatomy', 'Assembly procedure', 'Disassembly procedure', 'ESD safety & tools'],
    hours: '12 hrs',
    to: '/hardware',
  },
  {
    module: 'MOD-02',
    title: 'PC Parts Explorer',
    topics: ['Motherboard', 'CPU', 'RAM', 'GPU', 'PSU', 'Storage', 'Cooling'],
    hours: '8 hrs',
    to: '/pc-parts',
  },
  {
    module: 'MOD-03',
    title: 'Networking Fundamentals',
    topics: ['Network topologies', 'OSI model', 'IP addressing / subnetting', 'Cable standards (Cat5e, Cat6)', 'Network devices (Router, Switch, Hub)'],
    hours: '14 hrs',
    to: '/networking',
  },
  {
    module: 'MOD-04',
    title: 'Troubleshooting & Maintenance',
    topics: ['Diagnostic methodology', 'POST sequence', 'Beep codes', 'Software tools', 'Preventive maintenance schedule'],
    hours: '10 hrs',
    to: '/troubleshooting',
  },
]

export default function Lessons() {
  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <div className="section">
          <span className="label" style={{ display: 'block', marginBottom: '8px' }}>TESDA NC II · Course Outline</span>
          <h1>Syllabus</h1>
          <p style={{ marginTop: '12px' }}>
            Four core modules covering the TESDA Computer Systems Servicing NC II competency standard.
            Select a module below to begin studying.
          </p>
        </div>

        <hr className="rule-heavy" />

        {/* Syllabus cards */}
        {syllabus.map((mod, i) => (
          <div key={mod.module} className="section frame" style={{ marginBottom: '24px' }}>
            <div className="frame-inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span className="tag" style={{ marginBottom: '8px' }}>{mod.module}</span>
                  <h2 style={{ marginTop: '8px' }}>{mod.title}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="label">Allocated Time</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>{mod.hours}</div>
                </div>
              </div>

              <span className="label" style={{ display: 'block', marginBottom: '10px' }}>Topics Covered</span>
              <ol className="dim-list">
                {mod.topics.map(t => (
                  <li key={t}><span>{t}</span></li>
                ))}
              </ol>

              <div style={{ marginTop: '20px' }}>
                <Link to={mod.to} className="btn btn-solid" id={`open-mod-${i + 1}`}>
                  Open Module →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Overview table */}
        <div style={{ marginTop: '48px' }}>
          <span className="label" style={{ display: 'block', marginBottom: '12px' }}>Module Overview</span>
          <table className="syllabus-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Title</th>
                <th>Hours</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {syllabus.map(mod => (
                <tr key={mod.module}>
                  <td><span className="mono">{mod.module}</span></td>
                  <td>{mod.title}</td>
                  <td><span className="mono">{mod.hours}</span></td>
                  <td><Link to={mod.to} className="btn" style={{ padding: '4px 10px', fontSize: '0.68rem' }}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
