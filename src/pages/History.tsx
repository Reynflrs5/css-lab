import { useState } from 'react'
import { History as HistoryIcon, Monitor, Clock, ShieldCheck, Zap } from 'lucide-react'
import '../styles/tech-pages.css'

export default function History() {
  const [activeTab, setActiveTab] = useState<'computers' | 'network' | 'ohs'>('computers')

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-pink" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 60%)' }} />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" style={{ background: '#ec4899', boxShadow: '0 0 10px #ec4899' }} />
            <span>MOD-00 // CORE COMPETENCY FUNDAMENTALS</span>
          </div>
          
          <h1 className="tech-page-title">
            <span style={{ 
              background: 'linear-gradient(to right, #ffffff, #f9a8d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Fundamentals & History</span>
          </h1>
          
          <p className="tech-page-desc">
            Understand the evolution of computing, the dawn of the internet, basic IT concepts, and the crucial Occupational Health and Safety (OHS) standards.
          </p>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button 
            className={`tech-tab-btn ${activeTab === 'computers' ? 'active' : ''}`}
            onClick={() => setActiveTab('computers')}
            style={activeTab === 'computers' ? { borderColor: '#ec4899', color: '#ec4899', background: 'rgba(236,72,153,0.05)' } : {}}
          >
            <Monitor size={16} /> History of Computers
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
            style={activeTab === 'network' ? { borderColor: '#ec4899', color: '#ec4899', background: 'rgba(236,72,153,0.05)' } : {}}
          >
            <HistoryIcon size={16} /> History of Networking
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'ohs' ? 'active' : ''}`}
            onClick={() => setActiveTab('ohs')}
            style={activeTab === 'ohs' ? { borderColor: '#ec4899', color: '#ec4899', background: 'rgba(236,72,153,0.05)' } : {}}
          >
            <ShieldCheck size={16} /> OHS & Basics
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'computers' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>The Generations of Computers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '16px' }}>
                <h3 style={{ color: '#ec4899', fontSize: '1.2rem', marginBottom: '8px' }}>First Generation (1940-1956): Vacuum Tubes</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>The earliest computers used vacuum tubes for circuitry and magnetic drums for memory. They were enormous, taking up entire rooms, and generated a lot of heat. (Example: ENIAC, UNIVAC)</p>
              </div>
              <div style={{ borderLeft: '3px solid #db2777', paddingLeft: '16px' }}>
                <h3 style={{ color: '#db2777', fontSize: '1.2rem', marginBottom: '8px' }}>Second Generation (1956-1963): Transistors</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>Transistors replaced vacuum tubes, making computers smaller, faster, cheaper, and more energy-efficient. They still relied on punched cards for input.</p>
              </div>
              <div style={{ borderLeft: '3px solid #be185d', paddingLeft: '16px' }}>
                <h3 style={{ color: '#be185d', fontSize: '1.2rem', marginBottom: '8px' }}>Third Generation (1964-1971): Integrated Circuits</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>Transistors were miniaturized and placed on silicon chips (semiconductors). This drastically increased speed and efficiency, and introduced keyboards and monitors.</p>
              </div>
              <div style={{ borderLeft: '3px solid #9d174d', paddingLeft: '16px' }}>
                <h3 style={{ color: '#9d174d', fontSize: '1.2rem', marginBottom: '8px' }}>Fourth Generation (1971-Present): Microprocessors</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>The microprocessor brought thousands of integrated circuits onto a single silicon chip. What filled a room now fit in the palm of the hand.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>How the World Got Connected</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#ec4899"/> 1960s - The ARPANET
                </h3>
                <p style={{ color: '#64748b' }}>Funded by the U.S. Department of Defense, ARPANET was the first wide-area packet-switched network with distributed control and the first to implement the TCP/IP protocol suite.</p>
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#ec4899"/> 1983 - TCP/IP Standard
                </h3>
                <p style={{ color: '#64748b' }}>ARPANET transitioned to the TCP/IP protocol, establishing a standard that allowed different computer networks to communicate with each other, forming the modern Internet.</p>
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#ec4899"/> 1989 - World Wide Web
                </h3>
                <p style={{ color: '#64748b' }}>Tim Berners-Lee invented the World Wide Web, creating a system of interlinked hypertext documents accessed via the Internet, making it accessible to the public.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ohs' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>Occupational Health and Safety (OHS)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', background: '#fce7f3', borderRadius: '50%', color: '#db2777' }}><Zap size={20} /></div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>ESD Prevention</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Electrostatic Discharge (ESD) can instantly destroy sensitive PC components. Always use an Anti-static wrist strap, work on an anti-static mat, and touch an unpainted metal part of the case before touching components.</p>
              </div>
              
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', background: '#fce7f3', borderRadius: '50%', color: '#db2777' }}><ShieldCheck size={20} /></div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>The 5S Methodology</h3>
                </div>
                <ul style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
                  <li><strong>Seiri (Sort):</strong> Remove unnecessary items.</li>
                  <li><strong>Seiton (Set in order):</strong> Arrange tools properly.</li>
                  <li><strong>Seiso (Shine):</strong> Keep the workplace clean.</li>
                  <li><strong>Seiketsu (Standardize):</strong> Maintain high standards.</li>
                  <li><strong>Shitsuke (Sustain):</strong> Make it a habit.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
