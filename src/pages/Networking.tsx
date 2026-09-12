import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Network,
  Layers,
  Cable,
  Server,
  ArrowRight,
  Sliders,
} from 'lucide-react'
import '../styles/tech-pages.css'

const topologies = [
  {
    name: 'Star Topology',
    badge: 'Enterprise Standard',
    desc: 'All nodes connect point-to-point to a central switch or hub. Disconnection of any single cable does not disrupt adjacent nodes. The central switch represents the sole single point of failure (SPOF).',
    pros: 'Easy to expand, simple fault isolation, high performance with dedicated switch backplane.',
    cons: 'Failure of central switch downs entire segment; requires substantial cable runs.',
  },
  {
    name: 'Mesh Topology (Full & Partial)',
    badge: 'Critical Redundancy',
    desc: 'Every node interconnects with multiple redundant links. Utilized across wide-area enterprise cores, ISP carrier backbones, and mission-critical server clusters.',
    pros: 'Maximum fault tolerance; failure of individual paths instantly reroutes via dynamic routing.',
    cons: 'Extremely high cabling expense; formula for links is n(n-1)/2 for full mesh.',
  },
  {
    name: 'Tree / Hierarchical Star',
    badge: 'Campus Backbone',
    desc: 'Multi-tier star architecture with Core, Distribution, and Access layers. Standard topology for campus networks and large corporate environments.',
    pros: 'Highly scalable, structured broadcast domain segmentation with VLANs.',
    cons: 'Core switch failure affects downstream distribution blocks.',
  },
  {
    name: 'Bus Topology',
    badge: 'Legacy Coaxial',
    desc: 'All hosts tap into a single shared coaxial backbone terminated by 50-ohm resistors. Uses CSMA/CD collision detection. Obsolete in modern Ethernet LANs.',
    pros: 'Minimal cable needed for simple linear installations.',
    cons: 'Cable break partitions entire network; frequent packet collisions.',
  },
  {
    name: 'Ring Topology',
    badge: 'Token / FDDI',
    desc: 'Nodes connected in a closed ring loop where packets circulate in a predetermined direction using a token passing mechanism. Seen in FDDI and SONET rings.',
    pros: 'Deterministic packet latency, no collisions.',
    cons: 'Single break can collapse unidirectional rings; difficult reconfiguration.',
  },
]

const osiLayers = [
  {
    layer: '7',
    name: 'Application',
    pdu: 'User Data',
    protocols: 'HTTP, HTTPS, DNS, DHCP, SSH, FTP, SMTP',
    purpose: 'Provides network services directly to end-user software applications and processes.',
    color: '#818cf8',
  },
  {
    layer: '6',
    name: 'Presentation',
    pdu: 'Formatted Data',
    protocols: 'TLS/SSL, JPEG, ASCII, PNG, MPEG',
    purpose: 'Data syntax formatting, character conversion, compression, and end-to-end encryption.',
    color: '#a78bfa',
  },
  {
    layer: '5',
    name: 'Session',
    pdu: 'Session Data',
    protocols: 'NetBIOS, RPC, PPTP, Sockets',
    purpose: 'Establishes, manages, checkpoints, and terminates duplex communication dialogues between applications.',
    color: '#c084fc',
  },
  {
    layer: '4',
    name: 'Transport',
    pdu: 'Segments (TCP) / Datagrams (UDP)',
    protocols: 'TCP, UDP, SCTP, Port Numbers (1-65535)',
    purpose: 'End-to-end host-to-host transmission, connection handshakes (SYN-ACK), flow control, and error recovery.',
    color: '#38bdf8',
  },
  {
    layer: '3',
    name: 'Network',
    pdu: 'Packets',
    protocols: 'IPv4, IPv6, ICMP, ARP, OSPF, BGP, Routers',
    purpose: 'Logical IP addressing, route calculation across disparate networks, fragmentation, and packet forwarding.',
    color: '#34d399',
  },
  {
    layer: '2',
    name: 'Data Link',
    pdu: 'Frames',
    protocols: 'Ethernet 802.3, Wi-Fi 802.11, MAC, Switches, VLAN 802.1Q',
    purpose: 'Physical MAC address framing, node-to-node hop forwarding, and error detection via CRC FCS.',
    color: '#f59e0b',
  },
  {
    layer: '1',
    name: 'Physical',
    pdu: 'Bits (0s & 1s)',
    protocols: 'Cat5e/Cat6 UTP, Fiber Optic, RJ-45, Transceivers, Hubs',
    purpose: 'Electrical voltages, radio frequencies, or optical pulses across physical transmission media.',
    color: '#ef4444',
  },
]

const ipClasses = [
  { cls: 'Class A', range: '1.0.0.0 – 126.255.255.255', mask: '/8 (255.0.0.0)', hosts: '16,777,214 hosts' },
  { cls: 'Class B', range: '128.0.0.0 – 191.255.255.255', mask: '/16 (255.255.0.0)', hosts: '65,534 hosts' },
  { cls: 'Class C', range: '192.0.0.0 – 223.255.255.255', mask: '/24 (255.255.255.0)', hosts: '254 hosts' },
]

const privateRanges = [
  { range: '10.0.0.0 /8', mask: '255.0.0.0', usage: 'Large enterprise internal intranets' },
  { range: '172.16.0.0 – 172.31.255.255 /12', mask: '255.240.0.0', usage: 'Medium institutional networks' },
  { range: '192.168.0.0 /16', mask: '255.255.0.0', usage: 'Home & SOHO LAN deployments' },
  { range: '127.0.0.1 (127.0.0.0/8)', mask: 'Loopback', usage: 'Internal host TCP/IP stack self-test' },
  { range: '169.254.0.0 /16 (APIPA)', mask: 'Link-Local', usage: 'Auto-assigned when DHCP server unreachable' },
]

const cableStandards = [
  { cat: 'Cat 5', speed: '100 Mbps', freq: '100 MHz', maxLen: '100 m', use: 'Legacy 100BASE-TX Fast Ethernet' },
  { cat: 'Cat 5e', speed: '1 Gbps (1000 Mbps)', freq: '100 MHz', maxLen: '100 m', use: 'Commercial standard LAN cabling (most prevalent)' },
  { cat: 'Cat 6', speed: '1 Gbps (10G to 55m)', freq: '250 MHz', maxLen: '100 m', use: 'High-speed gigabit LAN with internal spline separator' },
  { cat: 'Cat 6A', speed: '10 Gbps', freq: '500 MHz', maxLen: '100 m', use: 'Full 10GBASE-T up to 100 meters, shielded pairs' },
  { cat: 'Cat 7', speed: '10 Gbps', freq: '600 MHz', maxLen: '100 m', use: 'Fully shielded S/FTP for data center server racks' },
  { cat: 'Fiber Optic', speed: '10G - 100G+', freq: 'Light wavelength', maxLen: 'Up to 40 km', use: 'Single-mode / Multi-mode ISP and backbone lines' },
]

const devices = [
  {
    name: 'Network Switch',
    layer: 'Layer 2 (Data Link)',
    role: 'Frames Forwarding',
    desc: 'Maintains an internal MAC address forwarding table (CAM). Forwards unicast frames directly to destination switchport rather than broadcasting, eliminating collisions.',
  },
  {
    name: 'Hardware Router',
    layer: 'Layer 3 (Network)',
    role: 'Packet Routing & NAT',
    desc: 'Examines destination IP addresses to route packets across disparate subnets and WAN links. Provides NAT translation between private RFC 1918 and public Internet.',
  },
  {
    name: 'Hardware Firewall',
    layer: 'Layer 3 to Layer 7',
    role: 'Stateful Packet Inspection',
    desc: 'Applies access control lists (ACLs) and stateful deep packet inspection to block unauthorized ingress connections while permitting established egress sessions.',
  },
  {
    name: 'Wireless Access Point (AP)',
    layer: 'Layer 2 (Data Link)',
    role: '802.11 RF Bridge',
    desc: 'Translates wireless 802.11 radio frames into wired 802.3 Ethernet frames, broadcasting SSIDs with WPA2/WPA3 enterprise authentication.',
  },
  {
    name: 'Legacy Hub',
    layer: 'Layer 1 (Physical)',
    role: 'Multi-port Repeater',
    desc: 'Replicates incoming electrical bit signals across all other ports blindly. Single collision domain shared across all connected devices; fully obsolete.',
  },
]

export default function Networking() {
  const [activeTab, setActiveTab] = useState<'topologies' | 'osi' | 'ip' | 'cabling' | 'devices'>('topologies')
  const [selectedLayer, setSelectedLayer] = useState<string>('3')

  // Quick subnet state
  const [testPrefix, setTestPrefix] = useState<number>(24)

  const activeOsi = osiLayers.find(l => l.layer === selectedLayer) || osiLayers[4]

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-indigo" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>NETWORK TELEMETRY // MODULE 03 // TESDA COC 3 INFRASTRUCTURE</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-indigo">Networking Protocols &amp; Subnetting</span>
          </h1>

          <p className="tech-page-desc">
            Industrial networking concepts including Star/Mesh topologies, OSI 7-Layer protocol breakdown,
            IPv4 Classful &amp; CIDR calculations, TIA/EIA cable categories, and enterprise device functions.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <Network size={14} color="#818cf8" />
              <span>OSI Model: <strong>7 Layers (L1 - L7)</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Sliders size={14} color="#38bdf8" />
              <span>Addressing: <strong>IPv4 Classful &amp; CIDR</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Link to="/cable-lab" style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Cable size={14} />
                <span>Launch RJ45 Cable Lab →</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Tabs */}
        <div className="tech-tab-strip">
          <button
            type="button"
            onClick={() => setActiveTab('topologies')}
            className={`tech-tab-btn ${activeTab === 'topologies' ? 'active-blue' : ''}`}
          >
            <Network size={15} />
            1. Network Topologies
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('osi')}
            className={`tech-tab-btn ${activeTab === 'osi' ? 'active-blue' : ''}`}
          >
            <Layers size={15} />
            2. OSI 7-Layer Model
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ip')}
            className={`tech-tab-btn ${activeTab === 'ip' ? 'active-blue' : ''}`}
          >
            <Sliders size={15} />
            3. IP Addressing &amp; Subnets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cabling')}
            className={`tech-tab-btn ${activeTab === 'cabling' ? 'active-blue' : ''}`}
          >
            <Cable size={15} />
            4. Cable Standards (Cat5e–Cat7)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`tech-tab-btn ${activeTab === 'devices' ? 'active-blue' : ''}`}
          >
            <Server size={15} />
            5. Network Hardware Devices
          </button>
        </div>

        {/* TAB 1: Topologies */}
        {activeTab === 'topologies' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {topologies.map(t => (
              <div key={t.name} className="tech-card">
                <div className="tech-card-header">
                  <span className="tech-card-title">{t.name}</span>
                  <span className="tech-badge tech-badge-indigo">{t.badge}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px', lineHeight: 1.55 }}>
                  {t.desc}
                </p>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                  <div style={{ color: '#16a34a', marginBottom: '4px' }}>
                    <strong>Advantage:</strong> {t.pros}
                  </div>
                  <div style={{ color: '#dc2626' }}>
                    <strong>Limitation:</strong> {t.cons}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: OSI Model */}
        {activeTab === 'osi' && (
          <div>
            <div className="tech-callout indigo">
              <div className="tech-callout-text">
                <strong>Standard Mnemonic:</strong> "<strong>P</strong>lease <strong>D</strong>o <strong>N</strong>ot 
                <strong> T</strong>hrow <strong>S</strong>ausage <strong>P</strong>izza <strong>A</strong>way"
                (Physical → Data Link → Network → Transport → Session → Presentation → Application).
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {osiLayers.map(l => {
                  const isSelected = selectedLayer === l.layer
                  return (
                    <div
                      key={l.layer}
                      onClick={() => setSelectedLayer(l.layer)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        borderRadius: 6,
                        border: isSelected ? `2px solid ${l.color}` : '1px solid #e2e8f0',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: l.color,
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: 3
                        }}>
                          Layer {l.layer}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{l.name}</strong>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b' }}>
                        PDU: {l.pdu}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Selected Layer Inspector */}
              <div className="tech-card-dark">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeOsi.color }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                    LAYER {activeOsi.layer} TELEMETRY INSPECTOR
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '12px' }}>
                  {activeOsi.name} Layer
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Protocol Data Unit (PDU)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#38bdf8', fontWeight: 600 }}>
                    {activeOsi.pdu}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Standard Protocols &amp; Technologies
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#cbd5e1', background: '#090b10', padding: '8px 12px', borderRadius: 4, border: '1px solid #1e2230' }}>
                    {activeOsi.protocols}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Primary Function
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>
                    {activeOsi.purpose}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IP Addressing & Subnets */}
        {activeTab === 'ip' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>
                    Classful IPv4 Boundaries
                  </h3>
                </div>
                <div className="tech-table-container">
                  <table className="tech-table">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Range</th>
                        <th>Default Mask</th>
                        <th>Host Capacity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipClasses.map(c => (
                        <tr key={c.cls}>
                          <td><strong>{c.cls}</strong></td>
                          <td><code style={{ fontSize: '0.72rem' }}>{c.range}</code></td>
                          <td><span style={{ fontFamily: 'var(--font-mono)' }}>{c.mask}</span></td>
                          <td>{c.hosts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>
                    Private IP Ranges (RFC 1918)
                  </h3>
                </div>
                <div className="tech-table-container">
                  <table className="tech-table">
                    <thead>
                      <tr>
                        <th>Subnet</th>
                        <th>Mask</th>
                        <th>Deployment Scope</th>
                      </tr>
                    </thead>
                    <tbody>
                      {privateRanges.map(r => (
                        <tr key={r.range}>
                          <td><code style={{ fontSize: '0.75rem' }}>{r.range}</code></td>
                          <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{r.mask}</span></td>
                          <td style={{ fontSize: '0.82rem' }}>{r.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Interactive Subnet Engine */}
            <div className="tech-card-dark" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', margin: 0 }}>
                    Interactive IPv4 CIDR Prefix Calculator
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                    Formula: Usable Hosts = 2^(32 - prefix) - 2
                  </p>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#38bdf8', fontWeight: 700 }}>
                  /{testPrefix} Prefix
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="30"
                value={testPrefix}
                onChange={e => setTestPrefix(parseInt(e.target.value, 10))}
                style={{ width: '100%', marginBottom: '16px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#090b10', padding: '10px 14px', borderRadius: 4, border: '1px solid #1e2230' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#64748b' }}>TOTAL IPS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>
                    {Math.pow(2, 32 - testPrefix).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#090b10', padding: '10px 14px', borderRadius: 4, border: '1px solid #1e2230' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#64748b' }}>USABLE HOSTS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#34d399', fontWeight: 600 }}>
                    {(Math.pow(2, 32 - testPrefix) - 2).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#090b10', padding: '10px 14px', borderRadius: 4, border: '1px solid #1e2230' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#64748b' }}>HOST BITS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#38bdf8', fontWeight: 600 }}>
                    {32 - testPrefix} bits
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Cabling Standards */}
        {activeTab === 'cabling' && (
          <div>
            <div className="tech-table-container" style={{ marginBottom: '24px' }}>
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Max Data Rate</th>
                    <th>Bandwidth Freq</th>
                    <th>Max Channel Length</th>
                    <th>Standard Application</th>
                  </tr>
                </thead>
                <tbody>
                  {cableStandards.map(c => (
                    <tr key={c.cat}>
                      <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{c.cat}</strong></td>
                      <td><span className="tech-badge tech-badge-blue">{c.speed}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{c.freq}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{c.maxLen}</td>
                      <td>{c.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tech-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0 0 4px' }}>
                  Looking for the Interactive Pinout &amp; Crimper Simulator?
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  Test T568A/B wire sequencing, crimping animations, and the dual-unit LED continuity tester in Lab 01.
                </p>
              </div>
              <Link to="/cable-lab" className="btn-tech-primary" style={{ fontSize: '0.78rem' }}>
                Launch RJ45 Cable Lab
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 5: Devices */}
        {activeTab === 'devices' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {devices.map(d => (
              <div key={d.name} className="tech-card">
                <div className="tech-card-header">
                  <span className="tech-card-title">{d.name}</span>
                  <span className="tech-badge tech-badge-indigo">{d.layer}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginBottom: '8px' }}>
                  {d.role}
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
