import { Link } from 'react-router-dom'

const modules = [
  {
    num: 'MOD-01',
    title: 'Computer Hardware',
    desc: 'Component identification, assembly, disassembly, and safety procedures.',
    to: '/hardware',
  },
  {
    num: 'MOD-02',
    title: 'PC Parts Explorer',
    desc: 'Interactive 3D diagram of internal components with full specifications.',
    to: '/pc-parts',
  },
  {
    num: 'MOD-03',
    title: 'Networking',
    desc: 'Topologies, IP addressing, cable standards, and network devices.',
    to: '/networking',
  },
  {
    num: 'LAB-01',
    title: 'RJ45 Cable Lab',
    desc: 'Interactive crimping workbench, continuity tester simulator, and T568A/B standards.',
    to: '/cable-lab',
  },
  {
    num: 'MOD-04',
    title: 'Troubleshooting',
    desc: 'Diagnostic methodology, POST codes, beep codes, and preventive maintenance.',
    to: '/troubleshooting',
  },
  {
    num: 'MOD-06',
    title: 'Glossary & Flashcards',
    desc: '35+ key networking and cabling terms with flip-card review and multiple-choice quiz modes.',
    to: '/glossary',
  },
]

export default function Home() {
  return (
    <main className="page">
      {/* Hero */}
      <section className="hero grid-field" style={{ marginTop: 'calc(var(--nav-h) * -1)', paddingTop: 'var(--nav-h)' }}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">TESDA NC II · Computer Systems Servicing</div>
            <h1 className="hero-title">
              CSS_LAB<br />
              <span style={{ fontWeight: 300, fontSize: '0.6em', color: 'var(--graphite)' }}>Study Reference System</span>
            </h1>
            <p className="hero-desc">
              A technical reference for students taking the Computer Systems Servicing National Certificate II qualification.
              Four modules covering hardware, components, networking, and diagnostics.
            </p>
            <div className="hero-actions">
              <Link to="/lessons" className="btn btn-solid">View Syllabus →</Link>
              <Link to="/hardware" className="btn">Start Module 01</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section style={{ paddingTop: '0' }}>
        <div className="container" style={{ paddingTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span className="label">Course Modules</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--line)' }} />
            <span className="tag">5 Units & Labs</span>
          </div>

          <div className="module-grid">
            {modules.map(m => (
              <Link key={m.num} to={m.to} className="module-card">
                <div className="module-num">{m.num}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <span className="module-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section style={{ marginTop: '64px' }}>
        <div className="container">
          <div className="panel-dark">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
              {[
                { tag: 'Coverage', val: 'CSS NC II — TESDA standard curriculum' },
                { tag: 'Format', val: 'Static reference — no login required' },
                { tag: 'Modules', val: '4 core topics, expandable' },
                { tag: 'Design', val: 'Schematic / drafting-sheet aesthetic' },
              ].map(({ tag, val }) => (
                <div key={tag}>
                  <div className="label" style={{ color: 'var(--mist)', marginBottom: '6px' }}>{tag}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--paper)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
