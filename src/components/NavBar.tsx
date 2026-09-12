import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface NavItem {
  to: string
  code: string
  label: string
  desc: string
}

interface SearchItem {
  title: string
  category: string
  to: string
  code: string
}

const links: NavItem[] = [
  { to: '/',                code: '00', label: 'Home',         desc: 'Overview & Course Syllabus' },
  { to: '/lessons',         code: '01', label: 'Lessons',      desc: 'TESDA Core Competencies' },
  { to: '/hardware',        code: '02', label: 'Hardware',     desc: 'Motherboard, CPU, RAM & Storage' },
  { to: '/pc-parts',        code: '03', label: 'PC Parts',     desc: 'Interactive 3D Component Atlas' },
  { to: '/networking',      code: '04', label: 'Networking',   desc: 'Topologies, Subnetting & OSI' },
  { to: '/cable-lab',       code: '05', label: 'Cable Lab',    desc: 'T568A/B Pinouts & Punchdown' },
  { to: '/troubleshooting', code: '06', label: 'Troubleshoot', desc: 'POST Beeps, BSOD & Power Issues' },
  { to: '/glossary',        code: '07', label: 'Glossary',     desc: 'Flashcard Deck & Quiz Simulator' },
]

const searchCatalog: SearchItem[] = [
  { title: 'System Overview & Syllabus', category: 'General', to: '/', code: 'MOD-00' },
  { title: 'TESDA Core Competency Modules', category: 'Curriculum', to: '/lessons', code: 'MOD-01' },
  { title: 'Motherboard Form Factors (ATX / Micro-ATX / Mini-ITX)', category: 'Hardware', to: '/hardware', code: 'MOD-02' },
  { title: 'CPU Sockets (LGA vs PGA) & Architecture', category: 'Hardware', to: '/hardware', code: 'MOD-02' },
  { title: 'RAM Standards & Bandwidth (DDR3 / DDR4 / DDR5)', category: 'Hardware', to: '/hardware', code: 'MOD-02' },
  { title: 'Storage Buses & Form Factors (NVMe M.2 / SATA III)', category: 'Hardware', to: '/hardware', code: 'MOD-02' },
  { title: 'PC Parts Atlas & Exploded Chassis Explorer', category: 'Interactive', to: '/pc-parts', code: 'MOD-03' },
  { title: 'Interactive Motherboard Pinout & IO Map', category: 'Interactive', to: '/pc-parts', code: 'MOD-03' },
  { title: 'Networking Fundamentals & OSI 7-Layer Model', category: 'Networking', to: '/networking', code: 'MOD-04' },
  { title: 'IPv4 Classful & CIDR Subnetting Calculator', category: 'Networking', to: '/networking', code: 'MOD-04' },
  { title: 'Network Topologies: Star, Mesh, Bus, Hybrid', category: 'Networking', to: '/networking', code: 'MOD-04' },
  { title: 'T-568B vs T-568A Color Standards & Pinouts', category: 'Cable Lab', to: '/cable-lab', code: 'MOD-05' },
  { title: 'RJ-45 Crimping Procedure & Gold Pin Seating', category: 'Cable Lab', to: '/cable-lab', code: 'MOD-05' },
  { title: '110 IDC Keystone Jack Punchdown Guide', category: 'Cable Lab', to: '/cable-lab', code: 'MOD-05' },
  { title: 'Cable Selection Matrix: Straight vs Crossover vs Rollover', category: 'Cable Lab', to: '/cable-lab', code: 'MOD-05' },
  { title: 'POST Beep Code Decoder (AMI, Award, Phoenix BIOS)', category: 'Troubleshoot', to: '/troubleshooting', code: 'MOD-06' },
  { title: 'BSOD Stop Code Reference (IRQL, PAGE_FAULT, CRITICAL)', category: 'Troubleshoot', to: '/troubleshooting', code: 'MOD-06' },
  { title: 'No Display / No Power Hardware Diagnosis Flowchart', category: 'Troubleshoot', to: '/troubleshooting', code: 'MOD-06' },
  { title: 'Multimeter Testing for ATX 24-Pin PSU Voltages', category: 'Troubleshoot', to: '/troubleshooting', code: 'MOD-06' },
  { title: 'Terminology Flashcard Review Deck (35+ Terms)', category: 'Glossary', to: '/glossary', code: 'MOD-07' },
  { title: 'Knowledge Quiz Simulator & Scorecard', category: 'Glossary', to: '/glossary', code: 'MOD-07' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )

  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Real-time system clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K / Slash to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      } else if (e.key === '/' && !searchOpen) {
        const target = e.target as HTMLElement
        if (target && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          e.preventDefault()
          setSearchOpen(true)
        }
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Focus search input on open
  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  // Filter search results
  const filteredResults = searchCatalog.filter(item => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    )
  })

  // Keyboard navigation inside search palette
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % (filteredResults.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + filteredResults.length) % (filteredResults.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredResults[selectedIndex]) {
        navigate(filteredResults[selectedIndex].to)
        setSearchOpen(false)
      }
    }
  }

  const handleSelectResult = (to: string) => {
    navigate(to)
    setSearchOpen(false)
  }

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        {/* UPPER TELEMETRY HUD BAR */}
        <div className="nav-telemetry">
          <div className="nav-container">
            <div className="nav-telemetry-left">
              <div className="tele-tag">
                <span className="tele-dot" />
                <span>SYS_ID // TESDA-CSS-NCII</span>
              </div>
              <span className="tele-divider">|</span>
              <span className="tele-meta">SPEC: TIA-568.2-D</span>
              <span className="tele-divider">|</span>
              <span className="tele-meta tele-hide-mobile">GATEWAY: 192.168.1.1/24</span>
            </div>

            <div className="nav-telemetry-right">
              <span className="tele-status">
                <span className="status-indicator-led" />
                STATUS: READY
              </span>
              <span className="tele-divider">|</span>
              <span className="tele-clock">
                <span className="clock-label">SYS_CLK</span> {time}
              </span>
            </div>
          </div>
        </div>

        {/* PRIMARY TECH NAVIGATION BAR */}
        <div className="nav-main">
          <div className="nav-container">
            {/* BRANDING */}
            <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
              <div className="nav-brand-chip">
                {/* Schematic Chip Mark with crosshairs */}
                <svg className="chip-svg" viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="5" y="5" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <rect x="9.5" y="9.5" width="13" height="13" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1" />
                  {/* Pin Traces */}
                  <line x1="1" y1="11" x2="5" y2="11" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="1" y1="16" x2="5" y2="16" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="1" y1="21" x2="5" y2="21" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="27" y1="11" x2="31" y2="11" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="27" y1="16" x2="31" y2="16" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="27" y1="21" x2="31" y2="21" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="16" y1="1" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="21" y1="1" x2="21" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="11" y1="27" x2="11" y2="31" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="16" y1="27" x2="16" y2="31" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="21" y1="27" x2="21" y2="31" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className="chip-label">CS</span>
              </div>
              <div className="nav-brand-info">
                <div className="brand-head">
                  <span className="brand-name">CSS_LAB</span>
                  <span className="brand-badge">NC-II</span>
                </div>
                <span className="brand-sub">COMPUTER SYSTEMS SERVICING</span>
              </div>
            </NavLink>

            {/* DESKTOP NAV LINKS */}
            <div className={`nav-links${open ? ' open' : ''}`}>
              {links.map(({ to, code, label, desc }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setOpen(false)}
                  title={desc}
                >
                  <span className="nav-link-code">{code}</span>
                  <span className="nav-link-text">{label}</span>
                  <span className="nav-link-glow" />
                </NavLink>
              ))}
            </div>

            {/* RIGHT CONTROLS: QUICK SEARCH & MOBILE TOGGLE */}
            <div className="nav-controls">
              <button
                type="button"
                className="nav-search-trigger"
                onClick={() => setSearchOpen(true)}
                title="Search topics & tools (Ctrl+K or /)"
                aria-label="Open command palette"
              >
                <svg className="search-icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.2" fill="none">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
                <span className="search-text">QUICK JUMP</span>
                <kbd className="search-kbd">⌘K</kbd>
              </button>

              <button
                type="button"
                className={`nav-toggle${open ? ' open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label="Toggle navigation"
                aria-expanded={open}
              >
                <span className="toggle-line" />
                <span className="toggle-line" />
                <span className="toggle-line" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT TECH DRAWER */}
        <div className={`nav-mobile-drawer${open ? ' open' : ''}`}>
          <div className="drawer-header">
            <span className="drawer-title">// STATION NAVIGATION INDEX</span>
            <span className="drawer-count">8 MODULES LOADED</span>
          </div>
          <div className="drawer-items">
            {links.map(({ to, code, label, desc }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <div className="drawer-link-prefix">
                  <span className="drawer-code">{code}</span>
                  <span className="drawer-marker">&gt;</span>
                </div>
                <div className="drawer-link-body">
                  <div className="drawer-label">{label}</div>
                  <div className="drawer-desc">{desc}</div>
                </div>
              </NavLink>
            ))}
          </div>
          <div className="drawer-footer">
            <button
              className="drawer-search-btn"
              onClick={() => {
                setOpen(false)
                setSearchOpen(true)
              }}
            >
              <span>OPEN COMMAND PALETTE</span>
              <kbd>⌘K</kbd>
            </button>
          </div>
        </div>
      </nav>

      {/* QUICK JUMP COMMAND PALETTE MODAL */}
      {searchOpen && (
        <div className="cmd-overlay" onClick={() => setSearchOpen(false)}>
          <div
            className="cmd-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Quick jump search"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="cmd-header">
              <div className="cmd-input-wrap">
                <span className="cmd-prompt">&gt;</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="cmd-input"
                  placeholder="Search modules, pinouts, diagnostics, glossary..."
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value)
                    setSelectedIndex(0)
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              <button
                className="cmd-close-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            {/* Sub-bar hint */}
            <div className="cmd-toolbar">
              <span className="cmd-results-count">
                {filteredResults.length} RECORD{filteredResults.length === 1 ? '' : 'S'} FOUND
              </span>
              <span className="cmd-hint">
                <kbd>↑</kbd> <kbd>↓</kbd> NAVIGATE <kbd>↵</kbd> SELECT <kbd>ESC</kbd> CLOSE
              </span>
            </div>

            {/* Results list */}
            <div className="cmd-list">
              {filteredResults.length === 0 ? (
                <div className="cmd-empty">
                  <span className="cmd-empty-code">[ERR: NO_MATCH]</span>
                  <p>No documentation or lab modules matching "{query}"</p>
                </div>
              ) : (
                filteredResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex
                  return (
                    <div
                      key={item.title + item.to}
                      className={`cmd-item${isSelected ? ' selected' : ''}`}
                      onClick={() => handleSelectResult(item.to)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="cmd-item-left">
                        <span className="cmd-item-code">{item.code}</span>
                        <div className="cmd-item-text">
                          <span className="cmd-item-title">{item.title}</span>
                          <span className="cmd-item-cat">{item.category}</span>
                        </div>
                      </div>
                      <div className="cmd-item-right">
                        <span className="cmd-item-jump">JUMP ➔</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="cmd-footer">
              <span>CSS_LAB TECHNICAL SYSTEM v2.4</span>
              <span>TESDA COMPUTER SYSTEMS SERVICING NC II</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
