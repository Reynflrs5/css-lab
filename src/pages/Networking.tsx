const topologies = [
  { name: 'Bus', desc: 'All devices share a single cable (backbone). Simple but a single break disables the entire network. Largely obsolete.' },
  { name: 'Star', desc: 'All devices connect to a central switch/hub. Most common in LANs. Failure of one node does not affect others; hub/switch failure is the single point of failure.' },
  { name: 'Ring', desc: 'Devices connected in a closed loop. Data travels in one direction (or bi-directional in FDDI). A single break can disrupt the network.' },
  { name: 'Mesh', desc: 'Every device connects to every other. Full redundancy — used in WANs and critical infrastructure. High cost and complexity.' },
  { name: 'Tree / Hybrid', desc: 'Hierarchical star topology with a root switch. Combines bus and star characteristics. Common in enterprise and campus networks.' },
]

const osiLayers = [
  { layer: '7', name: 'Application', examples: 'HTTP, FTP, DNS, SMTP' },
  { layer: '6', name: 'Presentation', examples: 'SSL/TLS, JPEG, ASCII' },
  { layer: '5', name: 'Session', examples: 'NetBIOS, RPC' },
  { layer: '4', name: 'Transport', examples: 'TCP, UDP' },
  { layer: '3', name: 'Network', examples: 'IP, ICMP, Router' },
  { layer: '2', name: 'Data Link', examples: 'Ethernet, MAC, Switch' },
  { layer: '1', name: 'Physical', examples: 'Cables, NIC, Hub' },
]

const cableStandards = [
  { cat: 'Cat 5',  speed: '100 Mbps', freq: '100 MHz',  use: 'Legacy Fast Ethernet' },
  { cat: 'Cat 5e', speed: '1 Gbps',   freq: '100 MHz',  use: 'Standard LAN (most common)' },
  { cat: 'Cat 6',  speed: '1 Gbps',   freq: '250 MHz',  use: 'Gigabit LAN, reduced crosstalk' },
  { cat: 'Cat 6A', speed: '10 Gbps',  freq: '500 MHz',  use: '10G Ethernet up to 100 m' },
  { cat: 'Cat 7',  speed: '10 Gbps',  freq: '600 MHz',  use: 'Shielded, data centers' },
  { cat: 'Fiber',  speed: '10+ Gbps', freq: 'N/A',      use: 'Long-distance, ISP backbone' },
]

const devices = [
  { name: 'Hub', layer: 'L1 — Physical', desc: 'Broadcasts all data to all ports. No intelligence. Replaced by switches in modern networks.' },
  { name: 'Switch', layer: 'L2 — Data Link', desc: 'Forwards frames using MAC address table. Sends data only to the destination port. Foundation of modern LANs.' },
  { name: 'Router', layer: 'L3 — Network', desc: 'Routes packets between different networks using IP addresses. Connects LAN to WAN/Internet.' },
  { name: 'Access Point (AP)', layer: 'L2 — Data Link', desc: 'Bridges wired and wireless networks. Broadcasts SSID for Wi-Fi clients to join.' },
  { name: 'Modem', layer: 'L1/L2', desc: 'Modulates/demodulates signals for DSL, cable, or fiber. Converts ISP signal to Ethernet for the router.' },
  { name: 'Firewall', layer: 'L3–L7', desc: 'Filters incoming/outgoing traffic by rules (IP, port, protocol). Hardware or software-based.' },
]

const ipClasses = [
  { cls: 'Class A', range: '1.0.0.0 – 126.255.255.255',   mask: '/8  (255.0.0.0)',     hosts: '~16.7 M' },
  { cls: 'Class B', range: '128.0.0.0 – 191.255.255.255', mask: '/16 (255.255.0.0)',   hosts: '~65,534' },
  { cls: 'Class C', range: '192.0.0.0 – 223.255.255.255', mask: '/24 (255.255.255.0)', hosts: '254' },
]

const privateRanges = [
  { range: '10.0.0.0/8',      usage: 'Large enterprise networks' },
  { range: '172.16.0.0/12',   usage: 'Medium networks' },
  { range: '192.168.0.0/16',  usage: 'Home / SOHO networks' },
]

export default function Networking() {
  return (
    <main className="page">
      <div className="container">
        <span className="tag" style={{ marginBottom: '16px' }}>Module 03</span>
        <h1 style={{ marginTop: '8px', marginBottom: '8px' }}>Networking Fundamentals</h1>
        <p>Topologies, OSI model, IP addressing, cable standards, and network devices.</p>
        <hr className="rule-heavy" />

        {/* Topologies */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>01 — Network Topologies</h2>
          <div className="topology-grid">
            {topologies.map(t => (
              <div key={t.name} className="topology-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--steel)', marginBottom: '6px' }}>TOPOLOGY</div>
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* OSI Model */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>02 — OSI Reference Model</h2>
          <div className="callout" style={{ marginBottom: '16px' }}>
            <span className="label">Mnemonic</span>
            <strong>Please Do Not Throw Sausage Pizza Away</strong> (L1→L7: Physical, Data Link, Network, Transport, Session, Presentation, Application)
          </div>
          <table className="spec-table">
            <thead>
              <tr>
                <th>Layer #</th>
                <th>Layer Name</th>
                <th>Protocols / Devices</th>
              </tr>
            </thead>
            <tbody>
              {osiLayers.map(l => (
                <tr key={l.layer}>
                  <td><span className="mono" style={{ fontWeight: 600 }}>L{l.layer}</span></td>
                  <td>{l.name}</td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--graphite)' }}>{l.examples}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* IP Addressing */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>03 — IP Addressing</h2>
          <div className="grid-2">
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '10px' }}>IP Classes (IPv4)</span>
              <table className="spec-table">
                <thead>
                  <tr><th>Class</th><th>Range</th><th>Subnet Mask</th><th>Hosts</th></tr>
                </thead>
                <tbody>
                  {ipClasses.map(c => (
                    <tr key={c.cls}>
                      <td><span className="mono">{c.cls}</span></td>
                      <td><span className="mono" style={{ fontSize: '0.75rem' }}>{c.range}</span></td>
                      <td><span className="mono" style={{ fontSize: '0.75rem' }}>{c.mask}</span></td>
                      <td>{c.hosts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '10px' }}>Private Address Ranges (RFC 1918)</span>
              <table className="spec-table">
                <thead>
                  <tr><th>Range</th><th>Typical Use</th></tr>
                </thead>
                <tbody>
                  {privateRanges.map(r => (
                    <tr key={r.range}>
                      <td><span className="mono">{r.range}</span></td>
                      <td>{r.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="panel" style={{ marginTop: '12px', fontSize: '0.82rem' }}>
                <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Subnetting Formula</span>
                <code style={{ display: 'block', padding: '8px', marginBottom: '6px' }}>Usable Hosts = 2^(32 - prefix) - 2</code>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Example: /24 → 2^8 - 2 = <strong>254 usable hosts</strong></p>
              </div>
            </div>
          </div>
        </section>

        {/* Cabling */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>04 — Cable Standards</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Max Speed</th>
                <th>Frequency</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              {cableStandards.map(c => (
                <tr key={c.cat}>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{c.cat}</span></td>
                  <td><span className="mono">{c.speed}</span></td>
                  <td><span className="mono">{c.freq}</span></td>
                  <td>{c.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="callout" style={{ marginTop: '16px' }}>
            <span className="label">T-568B Wiring Standard</span>
            Pin order: <code>Orange-W · Orange · Green-W · Blue · Blue-W · Green · Brown-W · Brown</code>
          </div>
        </section>

        {/* Devices */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>05 — Network Devices</h2>
          <ol className="dim-list">
            {devices.map(d => (
              <li key={d.name}>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{d.name}</strong>
                    <span className="tag">{d.layer}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{d.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
