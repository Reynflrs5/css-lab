import { useState, useCallback } from 'react'
import {
  Search,
  ChevronRight,
  FileText,
  Wrench,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Cpu,
  HardDrive,
  Zap,
  Monitor,
  Box,
  Wind,
  CircuitBoard,
  Server,
  Layers,
} from 'lucide-react'
import PcDiagram from './PcDiagram'
import { pcParts, type PcPart } from '../data/pcParts'
import '../styles/atlas-explorer.css'

interface CategoryMeta {
  label: string
  color: string
  icon: React.ReactNode
  ids: string[]
}

const CATEGORIES: CategoryMeta[] = [
  { label: 'Processing', color: '#ef4444', icon: <Cpu size={14} />, ids: ['cpu'] },
  { label: 'Interconnect', color: '#f97316', icon: <CircuitBoard size={14} />, ids: ['motherboard', 'cmos-battery', 'fpanel'] },
  { label: 'Memory', color: '#a855f7', icon: <Server size={14} />, ids: ['ram'] },
  { label: 'Graphics', color: '#3b82f6', icon: <Monitor size={14} />, ids: ['gpu'] },
  { label: 'Storage', color: '#10b981', icon: <HardDrive size={14} />, ids: ['storage', 'sata-hdd'] },
  { label: 'Thermal', color: '#06b6d4', icon: <Wind size={14} />, ids: ['cooling', 'case-fans'] },
  { label: 'Power', color: '#f59e0b', icon: <Zap size={14} />, ids: ['psu'] },
  { label: 'Enclosure', color: '#6b7280', icon: <Box size={14} />, ids: ['chassis'] },
]

const QUICK_START = ['motherboard', 'cpu', 'gpu', 'ram', 'psu', 'storage']

function getCategoryColor(id: string): string {
  const cat = CATEGORIES.find(c => c.ids.includes(id))
  return cat?.color ?? '#6b7280'
}

export default function AtlasExplorer() {
  const [selectedId, setSelectedId] = useState<string>('motherboard')
  const [activeTab, setActiveTab] = useState<'specs' | 'install' | 'diagnostics'>('specs')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    Interconnect: true,
    Processing: true,
  })
  const [enabledCats, setEnabledCats] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORIES.map(c => [c.label, true]))
  )

  const selected: PcPart = pcParts.find(p => p.id === selectedId) ?? pcParts[1]
  const catColor = getCategoryColor(selectedId)

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setActiveTab('specs')
  }, [])

  const toggleCat = (label: string) => {
    setEnabledCats(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const toggleExpand = (label: string) => {
    setExpandedCats(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const filteredParts = searchQuery.trim()
    ? pcParts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="atlas-explorer">
      {/* Top Navigation Bar */}
      <header className="atlas-topbar">
        <div className="atlas-brand">
          <Layers size={18} className="atlas-brand-icon" style={{ color: '#3b82f6' }} />
          <span className="atlas-brand-name">CSS <strong>Hardware Atlas</strong></span>
        </div>
        <nav className="atlas-tabs-nav" aria-label="Atlas modes">
          <button className="atlas-nav-tab active" type="button">Explore</button>
          <button className="atlas-nav-tab" type="button" onClick={() => setActiveTab('diagnostics')}>Review</button>
        </nav>
        <div className="atlas-topbar-right">
          <span className="atlas-meta-tag">TESDA CSS NC II</span>
          <span className="atlas-meta-tag">Interactive 3D</span>
        </div>
      </header>

      {/* Main 3-Column Atlas Grid */}
      <div className="atlas-columns">

        {/* ── LEFT: Hierarchical Subsystems Sidebar ── */}
        <aside className="atlas-sidebar" aria-label="PC Component Groups">
          <div className="sidebar-section-label">EXPLORE</div>
          <h2 className="sidebar-title">PC Systems</h2>

          <div className="sidebar-model-selector">
            <span className="model-label">Reference model</span>
            <div className="model-chip">
              <span>Mid-Tower ATX</span>
              <ChevronRight size={13} />
            </div>
            <button type="button" className="model-meta">Open-Frame Diagnostic Bench</button>
          </div>

          <div className="sidebar-search">
            <Search size={13} className="sidebar-search-icon" aria-hidden="true" />
            <input
              className="sidebar-search-input"
              type="search"
              placeholder="Find a component..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search components"
            />
          </div>

          {searchQuery.trim() && (
            <div className="sidebar-search-results">
              {filteredParts.length === 0 ? (
                <div className="sidebar-no-results">No components found</div>
              ) : (
                filteredParts.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`sidebar-search-item${p.id === selectedId ? ' active' : ''}`}
                    onClick={() => handleSelect(p.id)}
                  >
                    <span className="sidebar-dot" style={{ background: getCategoryColor(p.id) }} />
                    {p.shortName}
                  </button>
                ))
              )}
            </div>
          )}

          {!searchQuery.trim() && (
            <>
              <div className="sidebar-count-row">
                <span className="sidebar-count-label">
                  {Object.values(enabledCats).filter(Boolean).length} of {CATEGORIES.length} groups on
                </span>
                <button
                  type="button"
                  className="sidebar-show-all"
                  onClick={() => setEnabledCats(Object.fromEntries(CATEGORIES.map(c => [c.label, true])))}
                >
                  Show all
                </button>
                <button
                  type="button"
                  className="sidebar-show-all"
                  onClick={() => setEnabledCats(Object.fromEntries(CATEGORIES.map(c => [c.label, false])))}
                >
                  Clear
                </button>
              </div>

              <ul className="sidebar-category-list" role="list">
                {CATEGORIES.map(cat => {
                  const isExpanded = expandedCats[cat.label]
                  const isEnabled = enabledCats[cat.label]
                  return (
                    <li key={cat.label} className="sidebar-category-item">
                      <div className={`sidebar-category-row${isEnabled ? ' enabled' : ' dimmed'}`}>
                        <input
                          type="checkbox"
                          id={`cat-toggle-${cat.label}`}
                          className="sidebar-checkbox"
                          checked={isEnabled}
                          onChange={() => toggleCat(cat.label)}
                          style={{ accentColor: cat.color }}
                          aria-label={`Toggle ${cat.label}`}
                        />
                        <span className="sidebar-dot large" style={{ background: cat.color }} />
                        <button
                          type="button"
                          className="sidebar-cat-name"
                          onClick={() => { const first = cat.ids[0]; if (first) handleSelect(first) }}
                        >
                          {cat.label}
                        </button>
                        <span className="sidebar-cat-count">{cat.ids.length}</span>
                        <button
                          type="button"
                          className={`sidebar-expand-btn${isExpanded ? ' open' : ''}`}
                          onClick={() => toggleExpand(cat.label)}
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>

                      {isExpanded && (
                        <ul className="sidebar-sub-list" role="list">
                          {cat.ids.map(id => {
                            const part = pcParts.find(p => p.id === id)
                            if (!part) return null
                            return (
                              <li key={id}>
                                <button
                                  type="button"
                                  className={`sidebar-sub-item${id === selectedId ? ' active' : ''}`}
                                  onClick={() => handleSelect(id)}
                                  style={id === selectedId ? { color: cat.color, fontWeight: 600 } : {}}
                                >
                                  {part.shortName}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="sidebar-footer">
                <div className="sidebar-footer-label">12 component subsystems</div>
                <div className="sidebar-footer-sub">TESDA CSS NC II Core Competency</div>
              </div>
            </>
          )}
        </aside>

        {/* ── CENTER: 3D Viewport Column ── */}
        <main className="atlas-viewport-wrapper" aria-label="3D PC Model Viewer">
          <div className="atlas-viewport-header">
            <span className="atlas-viewport-label">3D ANATOMICAL REFERENCE</span>
            <h1 className="atlas-viewport-title">Desktop PC Hardware Anatomy</h1>
            <div className="atlas-viewport-sub">{pcParts.length} / {pcParts.length} component structures loaded &bull; 360&deg; Orbit</div>
          </div>

          <div className="atlas-3d-frame">
            <PcDiagram selectedId={selectedId} onSelect={handleSelect} atlasMode={true} />
          </div>
        </main>

        {/* ── RIGHT: Details & Diagnosis Panel ── */}
        <aside className="atlas-details-panel" aria-label="Component Details">
          <div className="details-section-label">DETAILS</div>

          <div className="details-search">
            <Search size={13} className="details-search-icon" aria-hidden="true" />
            <input
              className="details-search-input"
              type="search"
              placeholder="Search and focus..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search components"
            />
          </div>

          <div className="details-selected">
            <div
              className="details-cat-badge"
              style={{ background: catColor + '18', borderColor: catColor + '44', color: catColor }}
            >
              <span className="details-cat-dot" style={{ background: catColor }} />
              {selected.category}
            </div>

            <h2 className="details-component-name">{selected.name}</h2>

            <div className="details-pills">
              <span className="details-pill power">
                <Zap size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                {selected.powerDraw}
              </span>
              <span className="details-pill temp">
                <Activity size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                {selected.temperature}
              </span>
            </div>

            <p className="details-summary">{selected.body}</p>

            <div className="details-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'specs'}
                className={`details-tab${activeTab === 'specs' ? ' active' : ''}`}
                onClick={() => setActiveTab('specs')}
                style={activeTab === 'specs' ? { borderBottomColor: catColor, color: catColor } : {}}
              >
                <FileText size={12} /> Specs
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'install'}
                className={`details-tab${activeTab === 'install' ? ' active' : ''}`}
                onClick={() => setActiveTab('install')}
                style={activeTab === 'install' ? { borderBottomColor: catColor, color: catColor } : {}}
              >
                <Wrench size={12} /> Install
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'diagnostics'}
                className={`details-tab${activeTab === 'diagnostics' ? ' active' : ''}`}
                onClick={() => setActiveTab('diagnostics')}
                style={activeTab === 'diagnostics' ? { borderBottomColor: catColor, color: catColor } : {}}
              >
                <Activity size={12} /> Diagnose
              </button>
            </div>

            <div className="details-tab-body">
              {activeTab === 'specs' && (
                <div className="details-specs-list">
                  {selected.specs.map(s => (
                    <div key={s.label} className="details-spec-row">
                      <div className="details-spec-key">{s.label}</div>
                      <div className="details-spec-val">{s.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'install' && (
                <div className="details-install-list">
                  {selected.installGuide.map((step, i) => (
                    <div key={i} className="details-step">
                      <div className="details-step-num" style={{ color: catColor }}>{i + 1}</div>
                      <div className="details-step-text">{step}</div>
                    </div>
                  ))}
                  <div className="details-safety">
                    <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <span>Wear ESD wrist strap. Disconnect AC power before servicing.</span>
                  </div>
                </div>
              )}
              {activeTab === 'diagnostics' && (
                <div className="details-diag-list">
                  {selected.troubleshootingTips.map((tip, i) => (
                    <div key={i} className="details-fault">
                      <div className="details-fault-label">Fault #{i + 1}</div>
                      <div className="details-fault-text">{tip}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="details-start-with">
            <div className="details-start-label">START WITH</div>
            {QUICK_START.map(id => {
              const part = pcParts.find(p => p.id === id)
              if (!part) return null
              return (
                <button
                  key={id}
                  type="button"
                  className={`details-start-item${id === selectedId ? ' active' : ''}`}
                  onClick={() => handleSelect(id)}
                  style={id === selectedId ? { color: getCategoryColor(id) } : {}}
                >
                  {part.shortName}
                  <ArrowUpRight size={13} className="start-item-arrow" />
                </button>
              )
            })}
          </div>
        </aside>

      </div>
    </div>
  )
}
