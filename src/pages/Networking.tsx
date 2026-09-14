import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Network,
  Cable,
  Server,
  ArrowRight,
  Sliders,
  Monitor,
  Terminal,
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
  { cls: 'Class A', range: '1.0.0.0 â€“ 126.255.255.255', mask: '/8 (255.0.0.0)', hosts: '16,777,214 hosts' },
  { cls: 'Class B', range: '128.0.0.0 â€“ 191.255.255.255', mask: '/16 (255.255.0.0)', hosts: '65,534 hosts' },
  { cls: 'Class C', range: '192.0.0.0 â€“ 223.255.255.255', mask: '/24 (255.255.255.0)', hosts: '254 hosts' },
]

const privateRanges = [
  { range: '10.0.0.0 /8', mask: '255.0.0.0', usage: 'Large enterprise internal intranets' },
  { range: '172.16.0.0 â€“ 172.31.255.255 /12', mask: '255.240.0.0', usage: 'Medium institutional networks' },
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

const commonPorts = [
  { port: 20, protocol: 'FTP', type: 'TCP', name: 'File Transfer Protocol (Data)', desc: 'Transfers actual files between client and server.' },
  { port: 21, protocol: 'FTP', type: 'TCP', name: 'File Transfer Protocol (Control)', desc: 'Handles commands and control messages.' },
  { port: 22, protocol: 'SSH', type: 'TCP', name: 'Secure Shell', desc: 'Cryptographic network protocol for secure remote login.' },
  { port: 23, protocol: 'Telnet', type: 'TCP', name: 'Telnet', desc: 'Unencrypted remote command-line login (obsolete/insecure).' },
  { port: 25, protocol: 'SMTP', type: 'TCP', name: 'Simple Mail Transfer Protocol', desc: 'Used for sending emails between servers.' },
  { port: 53, protocol: 'DNS', type: 'TCP/UDP', name: 'Domain Name System', desc: 'Resolves human-readable hostnames to IP addresses.' },
  { port: 67, protocol: 'DHCP', type: 'UDP', name: 'DHCP (Server)', desc: 'Dynamically assigns IP addresses to clients.' },
  { port: 80, protocol: 'HTTP', type: 'TCP', name: 'Hypertext Transfer Protocol', desc: 'Transmits unencrypted web page data.' },
  { port: 110, protocol: 'POP3', type: 'TCP', name: 'Post Office Protocol v3', desc: 'Retrieves emails (usually downloads and deletes from server).' },
  { port: 143, protocol: 'IMAP', type: 'TCP', name: 'Internet Message Access Protocol', desc: 'Retrieves emails while keeping them synced on the server.' },
  { port: 443, protocol: 'HTTPS', type: 'TCP', name: 'HTTP Secure', desc: 'Transmits encrypted web page data (TLS/SSL).' },
  { port: 3389, protocol: 'RDP', type: 'TCP', name: 'Remote Desktop Protocol', desc: 'Proprietary protocol for remote GUI control (Windows).' },
]

export default function Networking() {
  const [activeTab, setActiveTab] = useState<'topologies' | 'osi' | 'ip' | 'cabling' | 'devices' | 'ports' | 'journey' | 'cli'>('topologies')
  const [selectedLayer, setSelectedLayer] = useState<string>('3')
  const [selectedTopology, setSelectedTopology] = useState<string>('Star Topology')

  // CLI State
  const [cliHistory, setCliHistory] = useState<{cmd: string, output: string[]}[]>([
    { cmd: '', output: ['Microsoft Windows [Version 10.0.19045.3324]', '(c) Microsoft Corporation. All rights reserved.', ''] }
  ]);
  const [cliInput, setCliInput] = useState('');
  const cliEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'cli') {
      cliEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cliHistory, activeTab]);

  const handleCliCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;
    
    let output: string[] = [];
    const args = cmd.toLowerCase().split(' ');
    
    if (args[0] === 'ping') {
      const target = args[1];
      if (!target) {
        output = ['Ping request could not find host. Please check the name and try again.'];
      } else {
        output = [
          `Pinging ${target} with 32 bytes of data:`,
          `Reply from ${target}: bytes=32 time=12ms TTL=115`,
          `Reply from ${target}: bytes=32 time=14ms TTL=115`,
          `Reply from ${target}: bytes=32 time=11ms TTL=115`,
          `Reply from ${target}: bytes=32 time=13ms TTL=115`,
          '',
          `Ping statistics for ${target}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 11ms, Maximum = 14ms, Average = 12ms`
        ];
      }
    } else if (args[0] === 'ipconfig') {
      output = [
        'Windows IP Configuration',
        '',
        'Ethernet adapter Ethernet0:',
        '',
        '   Connection-specific DNS Suffix  . : localdomain',
        '   IPv4 Address. . . . . . . . . . . : 192.168.1.5',
        '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
        '   Default Gateway . . . . . . . . . : 192.168.1.1'
      ];
    } else if (args[0] === 'help') {
      output = [
        'For more information on a specific command, type HELP command-name',
        'PING           Verifies IP-level connectivity to another TCP/IP computer.',
        'IPCONFIG       Displays all current TCP/IP network configuration values.',
        'CLEAR / CLS    Clears the screen.',
        'HELP           Provides Help information for Windows commands.'
      ];
    } else if (args[0] === 'clear' || args[0] === 'cls') {
      setCliHistory([{ cmd: '', output: [] }]);
      setCliInput('');
      return;
    } else {
      output = [`'${args[0]}' is not recognized as an internal or external command,`, 'operable program or batch file.'];
    }

    setCliHistory(prev => [...prev, { cmd: `C:\\Users\\Admin> ${cmd}`, output }]);
    setCliInput('');
  };

  // Quick subnet state
  const [testPrefix, setTestPrefix] = useState<number>(24)

  // Quiz State
  const [quizIp, setQuizIp] = useState('192.168.1.55')
  const [quizPrefix, setQuizPrefix] = useState(26)
  const [userAnswers, setUserAnswers] = useState({ network: '', first: '', last: '', broadcast: '' })
  const [quizStatus, setQuizStatus] = useState<'idle' | 'checking' | 'correct' | 'incorrect' | 'incomplete'>('idle')
  const [quizSolution, setQuizSolution] = useState({ network: '', first: '', last: '', broadcast: '' })

  // Flashcard State
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const toggleFlip = (portNum: number) => {
    setFlippedCards(prev => ({ ...prev, [portNum]: !prev[portNum] }))
  }

  // Packet Journey Simulator State
  const journeySteps = [
    { id: 0, label: 'Layer 7  -  Application', detail: 'HTTP GET request created by browser (google.com)', color: '#818cf8', device: 'PC', pdu: 'Data' },
    { id: 1, label: 'Layer 4  -  Transport', detail: 'TCP SYN segment created, Dst Port: 80, Src Port: 49152', color: '#38bdf8', device: 'PC', pdu: 'Segment' },
    { id: 2, label: 'Layer 3  -  Network', detail: 'IP Packet formed. Src: 192.168.1.5  -  Dst: 8.8.8.8', color: '#34d399', device: 'PC', pdu: 'Packet' },
    { id: 3, label: 'Layer 2  -  Data Link', detail: 'Ethernet Frame: Src MAC  -  Switch MAC via ARP lookup', color: '#f59e0b', device: 'PC', pdu: 'Frame' },
    { id: 4, label: 'Switch  -  Layer 2 Forwarding', detail: 'Switch reads Dst MAC from CAM table, forwards to Router port', color: '#f59e0b', device: 'Switch', pdu: 'Frame' },
    { id: 5, label: 'Router  -  Layer 3 Routing', detail: 'Router reads Dst IP 8.8.8.8, checks routing table, performs NAT', color: '#34d399', device: 'Router', pdu: 'Packet' },
    { id: 6, label: 'ISP  -  WAN Transmission', detail: 'Packet exits LAN, travels across ISP backbone via BGP routes', color: '#a78bfa', device: 'Internet', pdu: 'Packet' },
    { id: 7, label: 'Server  -  Response Received', detail: 'Web server at 8.8.8.8 receives request, sends HTTP 200 OK reply', color: '#f472b6', device: 'Server', pdu: 'Data' },
  ]
  const [journeyStep, setJourneyStep] = useState(-1)
  const [journeyRunning, setJourneyRunning] = useState(false)
  const journeyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runJourney = () => {
    if (journeyRunning) return
    setJourneyStep(-1)
    setJourneyRunning(true)
  }

  const resetJourney = () => {
    if (journeyTimer.current) clearTimeout(journeyTimer.current)
    setJourneyStep(-1)
    setJourneyRunning(false)
  }

  useEffect(() => {
    if (!journeyRunning) return
    if (journeyStep >= journeySteps.length - 1) {
      setJourneyRunning(false)
      return
    }
    journeyTimer.current = setTimeout(() => {
      setJourneyStep(prev => prev + 1)
    }, 900)
    return () => { if (journeyTimer.current) clearTimeout(journeyTimer.current) }
  }, [journeyRunning, journeyStep])

  const generateQuiz = () => {
    const octet1 = [10, 172, 192][Math.floor(Math.random() * 3)];
    const octet2 = octet1 === 172 ? 16 + Math.floor(Math.random() * 16) : octet1 === 192 ? 168 : Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
    const prefix = 24 + Math.floor(Math.random() * 7); // /24 to /30
    
    setQuizIp(`${octet1}.${octet2}.${octet3}.${octet4}`);
    setQuizPrefix(prefix);
    setUserAnswers({ network: '', first: '', last: '', broadcast: '' });
    setQuizStatus('idle');
  }

  const checkQuiz = () => {
    if (!userAnswers.network.trim() || !userAnswers.first.trim() || !userAnswers.last.trim() || !userAnswers.broadcast.trim()) {
      setQuizStatus('incomplete');
      return;
    }

    const magicNumber = Math.pow(2, 32 - quizPrefix);
    const ipParts = quizIp.split('.').map(Number);
    const net4 = Math.floor(ipParts[3] / magicNumber) * magicNumber;
    const bcast4 = net4 + magicNumber - 1;

    const correctNetwork = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${net4}`;
    const correctFirst = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${net4 + 1}`;
    const correctLast = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${bcast4 - 1}`;
    const correctBroadcast = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${bcast4}`;

    setQuizSolution({ network: correctNetwork, first: correctFirst, last: correctLast, broadcast: correctBroadcast });
    
    if (
      userAnswers.network.trim() === correctNetwork &&
      userAnswers.first.trim() === correctFirst &&
      userAnswers.last.trim() === correctLast &&
      userAnswers.broadcast.trim() === correctBroadcast
    ) {
      setQuizStatus('correct');
    } else {
      setQuizStatus('incorrect');
    }
  }

  const activeOsi = osiLayers.find(l => l.layer === selectedLayer) || osiLayers[4]

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* â”€â”€ COMMAND DECK HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                <span>Launch RJ45 Cable Lab â†’</span>
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
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="tech-dropdown"
          >
            <option value="topologies">1. Network Topologies</option>
            <option value="osi">2. OSI 7-Layer Model</option>
            <option value="ip">3. IP Addressing & Subnets</option>
            <option value="cabling">4. Cable Standards (Cat5eâ€“Cat7)</option>
            <option value="devices">5. Network Hardware Devices</option>
            <option value="ports">6. Common Ports (Flashcards)</option>
            <option value="journey">7. Packet Journey Simulator</option>
            <option value="cli">8. Command Line Simulator</option>
          </select>
        </div>

        {/* TAB 1: Topologies */}
        {activeTab === 'topologies' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topologies.map(t => {
                const isSelected = selectedTopology === t.name;
                return (
                  <div 
                    key={t.name} 
                    onClick={() => setSelectedTopology(t.name)}
                    className="tech-card"
                    style={{ 
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                      background: isSelected ? '#f8fafc' : '#ffffff',
                      boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none',
                      padding: '16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div className="tech-card-header" style={{ marginBottom: '8px' }}>
                      <span className="tech-card-title">{t.name}</span>
                      <span className="tech-badge tech-badge-indigo">{t.badge}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      {t.desc}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="tech-card-dark" style={{ position: 'sticky', top: '24px', alignSelf: 'start', padding: '24px' }}>
              {topologies.filter(t => t.name === selectedTopology).map(t => (
                <div key={t.name + '-detail'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                      TOPOLOGY VISUALIZATION
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '24px' }}>
                    {t.name}
                  </h3>
                  
                  {/* DIAGRAM AREA */}
                  <div style={{ background: '#090b10', border: '1px solid #1e293b', borderRadius: '8px', height: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', width: 200, height: 200 }}>
                      {t.name === 'Star Topology' && (
                        <>
                          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <line x1="100" y1="100" x2="100" y2="30" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                            <line x1="100" y1="100" x2="165" y2="75" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                            <line x1="100" y1="100" x2="140" y2="155" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                            <line x1="100" y1="100" x2="60" y2="155" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                            <line x1="100" y1="100" x2="35" y2="75" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                          </svg>
                          <div style={{ position: 'absolute', top: 88, left: 88, background: '#090b10', padding: 2, borderRadius: '50%' }}><Server size={24} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 20, left: 90 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 65, left: 155 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 145, left: 130 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 145, left: 50 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 65, left: 25 }}><Monitor size={20} color="#94a3b8" /></div>
                        </>
                      )}
                      {t.name === 'Mesh Topology (Full & Partial)' && (
                        <>
                          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <path d="M100 40 L160 100 M100 40 L130 160 M100 40 L70 160 M100 40 L40 100 M160 100 L130 160 M160 100 L70 160 M160 100 L40 100 M130 160 L70 160 M130 160 L40 100 M70 160 L40 100" stroke="#475569" strokeWidth="2" fill="none" opacity="0.6"/>
                          </svg>
                          <div style={{ position: 'absolute', top: 30, left: 90, background: '#090b10', padding: 2 }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 150, background: '#090b10', padding: 2 }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 150, left: 120, background: '#090b10', padding: 2 }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 150, left: 60, background: '#090b10', padding: 2 }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 30, background: '#090b10', padding: 2 }}><Server size={20} color="#38bdf8" /></div>
                        </>
                      )}
                      {t.name === 'Tree / Hierarchical Star' && (
                        <>
                          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <line x1="100" y1="40" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
                            <line x1="100" y1="40" x2="140" y2="100" stroke="#475569" strokeWidth="2" />
                            <line x1="60" y1="100" x2="40" y2="160" stroke="#475569" strokeWidth="2" />
                            <line x1="60" y1="100" x2="80" y2="160" stroke="#475569" strokeWidth="2" />
                            <line x1="140" y1="100" x2="120" y2="160" stroke="#475569" strokeWidth="2" />
                            <line x1="140" y1="100" x2="160" y2="160" stroke="#475569" strokeWidth="2" />
                          </svg>
                          <div style={{ position: 'absolute', top: 28, left: 88, background: '#090b10', padding: 2, borderRadius: '4px' }}><Server size={24} color="#f59e0b" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 50, background: '#090b10', padding: 2, borderRadius: '4px' }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 130, background: '#090b10', padding: 2, borderRadius: '4px' }}><Server size={20} color="#38bdf8" /></div>
                          <div style={{ position: 'absolute', top: 152, left: 32, background: '#090b10', padding: 2 }}><Monitor size={16} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 152, left: 72, background: '#090b10', padding: 2 }}><Monitor size={16} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 152, left: 112, background: '#090b10', padding: 2 }}><Monitor size={16} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 152, left: 152, background: '#090b10', padding: 2 }}><Monitor size={16} color="#94a3b8" /></div>
                        </>
                      )}
                      {t.name === 'Bus Topology' && (
                        <>
                          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <line x1="20" y1="100" x2="180" y2="100" stroke="#38bdf8" strokeWidth="4" />
                            <rect x="15" y="95" width="5" height="10" fill="#f59e0b" />
                            <rect x="180" y="95" width="5" height="10" fill="#f59e0b" />
                            <line x1="50" y1="50" x2="50" y2="100" stroke="#475569" strokeWidth="2" />
                            <line x1="100" y1="150" x2="100" y2="100" stroke="#475569" strokeWidth="2" />
                            <line x1="150" y1="50" x2="150" y2="100" stroke="#475569" strokeWidth="2" />
                          </svg>
                          <div style={{ position: 'absolute', top: 40, left: 40, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 140, left: 90, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 40, left: 140, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                        </>
                      )}
                      {t.name === 'Ring Topology' && (
                        <>
                          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <circle cx="100" cy="100" r="60" fill="none" stroke="#38bdf8" strokeWidth="3" />
                          </svg>
                          <div style={{ position: 'absolute', top: 30, left: 90, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 150, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 150, left: 90, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                          <div style={{ position: 'absolute', top: 90, left: 30, background: '#090b10', padding: 2 }}><Monitor size={20} color="#94a3b8" /></div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <div style={{ color: '#34d399', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <strong>Advantage:</strong> {t.pros}
                    </div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                      <strong>Limitation:</strong> {t.cons}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OSI Model */}
        {activeTab === 'osi' && (
          <div>
            <div className="tech-callout indigo">
              <div className="tech-callout-text">
                <strong>Standard Mnemonic:</strong> "<strong>P</strong>lease <strong>D</strong>o <strong>N</strong>ot 
                <strong> T</strong>hrow <strong>S</strong>ausage <strong>P</strong>izza <strong>A</strong>way"
                (Physical -&gt; Data Link -&gt; Network -&gt; Transport -&gt; Session -&gt; Presentation -&gt; Application).
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

            {/* Subnetting Practice Quiz */}
            <div className="tech-card" style={{ border: '2px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Subnetting Challenge</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Calculate the network boundaries for the given IP address.</p>
                </div>
                <button onClick={generateQuiz} className="btn-tech-outline" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  Generate New IP
                </button>
              </div>

              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Target IP Address</span>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700, marginTop: '8px' }}>
                  {quizIp} <span style={{ color: '#34d399' }}>/{quizPrefix}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Network Address</label>
                  <input 
                    type="text" 
                    value={userAnswers.network}
                    onChange={e => setUserAnswers({...userAnswers, network: e.target.value})}
                    placeholder="e.g. 192.168.1.0"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>First Usable IP</label>
                  <input 
                    type="text" 
                    value={userAnswers.first}
                    onChange={e => setUserAnswers({...userAnswers, first: e.target.value})}
                    placeholder="e.g. 192.168.1.1"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Last Usable IP</label>
                  <input 
                    type="text" 
                    value={userAnswers.last}
                    onChange={e => setUserAnswers({...userAnswers, last: e.target.value})}
                    placeholder="e.g. 192.168.1.62"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Broadcast Address</label>
                  <input 
                    type="text" 
                    value={userAnswers.broadcast}
                    onChange={e => setUserAnswers({...userAnswers, broadcast: e.target.value})}
                    placeholder="e.g. 192.168.1.63"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={checkQuiz} className="btn-tech-primary">
                  Check Answers
                </button>
                
                {quizStatus === 'correct' && (
                  <div style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }}></div>
                    Perfect! All answers correct.
                  </div>
                )}
                {quizStatus === 'incomplete' && (
                  <div style={{ color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }}></div>
                    Please fill out all answers first.
                  </div>
                )}
                {quizStatus === 'incorrect' && (
                  <div style={{ color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}></div>
                    Incorrect. Try again or check the solution.
                  </div>
                )}
              </div>

              {quizStatus === 'incorrect' && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px' }}>
                  <h5 style={{ margin: '0 0 12px', color: '#991b1b' }}>Solution Guide:</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#7f1d1d' }}>
                    <div><strong>Network:</strong> {quizSolution.network}</div>
                    <div><strong>First IP:</strong> {quizSolution.first}</div>
                    <div><strong>Last IP:</strong> {quizSolution.last}</div>
                    <div><strong>Broadcast:</strong> {quizSolution.broadcast}</div>
                  </div>
                </div>
              )}
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

        {/* TAB 6: Ports & Protocols Flashcards */}
        {activeTab === 'ports' && (
          <div>
            <div className="tech-callout indigo" style={{ marginBottom: '24px' }}>
              <div className="tech-callout-text">
                <strong>Memory Drill:</strong> Click on any card to flip it and reveal the associated port number. This is essential for TESDA COC 3 and CompTIA Network+ exams.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', perspective: '1000px' }}>
              {commonPorts.map(port => {
                const isFlipped = flippedCards[port.port] || false;
                
                return (
                  <div 
                    key={port.port} 
                    className="tech-flashcard"
                    onClick={() => toggleFlip(port.port)}
                  >
                    <div className={`tech-flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                      {/* FRONT OF CARD (Protocol Name) */}
                      <div className="tech-flashcard-front">
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span className="tech-badge tech-badge-indigo">{port.type}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '16px 0 8px' }}>
                          {port.protocol}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', margin: 0 }}>
                          Tap to reveal port number
                        </p>
                      </div>

                      {/* BACK OF CARD (Port Number) */}
                      <div className="tech-flashcard-back">
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Port Number
                        </div>
                        <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', margin: '4px 0 12px', lineHeight: 1 }}>
                          {port.port}
                        </h2>
                        <div style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}>
                          {port.name}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                          {port.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 7: Packet Journey Simulator */}
        {activeTab === 'journey' && (() => {
          const deviceForStep: Record<string, number> = { 'PC': 0, 'Switch': 1, 'Router': 2, 'Internet': 3, 'Server': 4 }
          const activeNodeIdx = journeyStep >= 0 ? deviceForStep[journeySteps[journeyStep]?.device] ?? -1 : -1
          const currentStep = journeyStep >= 0 ? journeySteps[journeyStep] : null
          const cables = [
            { x1: 108, y1: 130, x2: 237, y2: 130 },
            { x1: 293, y1: 130, x2: 407, y2: 130 },
            { x1: 463, y1: 130, x2: 577, y2: 130 },
            { x1: 633, y1: 130, x2: 747, y2: 130 },
          ]
          const nodeX = [80, 265, 435, 605, 775]
          const nodeY = 130
          const nodeColors = ['#38bdf8','#f59e0b','#34d399','#a78bfa','#f472b6']
          const nodeLabels = ['PC-1','SW-1','RT-1','ISP','SRV-1']
          const nodeSub   = ['192.168.1.5','FA 0/1','Gi 0/0','WAN Cloud','8.8.8.8']
          const pktCable  = activeNodeIdx >= 0 && activeNodeIdx < cables.length ? cables[activeNodeIdx] : null

          return (
            <div style={{ background: '#070a10', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'stretch' }}>
                {/* ── CANVAS ── */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  {/* Toolbar */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#0f172a', border:'1px solid #1e293b', borderBottom:'none', borderRadius:'8px 8px 0 0', padding:'10px 16px' }}>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#ef4444' }}/>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }}/>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#34d399' }}/>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'#475569', marginLeft:8 }}>PACKET TRACER — Logical Workspace</span>
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={runJourney} disabled={journeyRunning}
                        style={{ padding:'5px 14px', fontSize:'0.75rem', fontWeight:700, background: journeyRunning ? '#1e293b':'#38bdf8', color: journeyRunning ? '#475569':'#0f172a', border:'none', borderRadius:'4px', cursor: journeyRunning ? 'not-allowed':'pointer' }}>
                        {journeyRunning ? '● Simulating…' : journeyStep >= 0 ? '▶ Replay' : '▶ Send Ping'}
                      </button>
                      <button onClick={resetJourney}
                        style={{ padding:'5px 12px', fontSize:'0.75rem', background:'transparent', color:'#64748b', border:'1px solid #334155', borderRadius:'4px', cursor:'pointer' }}>
                        Reset
                      </button>
                    </div>
                  </div>
                  {/* SVG Canvas */}
                  <div style={{ background:'#070a10', border:'1px solid #1e293b', borderRadius:'0 0 8px 8px', overflow:'hidden', flex: 1 }}>
                    <svg viewBox="0 0 860 260" width="100%" style={{ display:'block' }}>
                      <defs>
                        <pattern id="ptGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#0d1625" strokeWidth="0.8"/>
                        </pattern>
                      </defs>
                      <rect width="860" height="260" fill="url(#ptGrid)"/>

                      {/* Cables */}
                      {cables.map((c, i) => (
                        <g key={i}>
                          <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#192840" strokeWidth="4" strokeLinecap="round"/>
                          {activeNodeIdx > i && <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={nodeColors[i]} strokeWidth="3" strokeLinecap="round" style={{ filter:`drop-shadow(0 0 5px ${nodeColors[i]})` }}/>}
                          <circle cx={c.x1} cy={c.y1} r={4} fill={activeNodeIdx >= i ? nodeColors[i] : '#1e293b'}/>
                          <circle cx={c.x2} cy={c.y2} r={4} fill={activeNodeIdx > i ? nodeColors[i+1] : '#1e293b'}/>
                        </g>
                      ))}

                      {/* Devices */}
                      {nodeX.map((x, i) => {
                        const isActive = activeNodeIdx === i
                        const isPast   = activeNodeIdx > i
                        const col      = nodeColors[i]
                        const stk      = isActive ? col : isPast ? `${col}66` : '#1e3a5f'
                        return (
                          <g key={i}>
                            {isActive && (
                              <circle cx={x} cy={nodeY} r={36} fill="none" stroke={col} strokeWidth="1.5" opacity="0.35">
                                <animate attributeName="r" values="33;42;33" dur="1.2s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.35;0.08;0.35" dur="1.2s" repeatCount="indefinite"/>
                              </circle>
                            )}
                            <rect x={x-27} y={nodeY-27} width={54} height={54} rx="7"
                              fill={isActive ? `${col}1a` : isPast ? `${col}0d` : '#0c1525'}
                              stroke={isActive ? col : isPast ? `${col}55` : '#1e3a5f'}
                              strokeWidth={isActive ? 2 : 1.5}
                              style={{ filter: isActive ? `drop-shadow(0 0 14px ${col}77)` : 'none', transition:'all 0.4s' }}/>
                            {i === 0 && <g stroke={stk} strokeWidth="1.5" fill="none"><rect x={x-14} y={nodeY-16} width={28} height={20} rx="2"/><line x1={x} y1={nodeY+4} x2={x} y2={nodeY+12}/><line x1={x-7} y1={nodeY+12} x2={x+7} y2={nodeY+12}/></g>}
                            {i === 1 && <g stroke={stk} strokeWidth="1.5" fill="none"><rect x={x-15} y={nodeY-8} width={30} height={16} rx="2"/>{[-9,-4,0,4,9].map(px=><line key={px} x1={x+px} y1={nodeY-18} x2={x+px} y2={nodeY-8}/>)}</g>}
                            {i === 2 && <g stroke={stk} strokeWidth="1.5" fill="none"><circle cx={x} cy={nodeY} r={15}/><ellipse cx={x} cy={nodeY} rx={8} ry={15}/><line x1={x-15} y1={nodeY} x2={x+15} y2={nodeY}/></g>}
                            {i === 3 && <g stroke={stk} strokeWidth="1.5" fill="none"><ellipse cx={x} cy={nodeY+4} rx={17} ry={11}/><ellipse cx={x-9} cy={nodeY-3} rx={10} ry={10}/><ellipse cx={x+9} cy={nodeY-3} rx={10} ry={10}/><ellipse cx={x} cy={nodeY-8} rx={10} ry={10}/></g>}
                            {i === 4 && <g stroke={stk} strokeWidth="1.5" fill="none"><rect x={x-13} y={nodeY-16} width={26} height={9} rx="1"/><rect x={x-13} y={nodeY-5} width={26} height={9} rx="1"/><rect x={x-13} y={nodeY+6} width={26} height={9} rx="1"/><circle cx={x+9} cy={nodeY-11} r={2} fill={stk} stroke="none"/><circle cx={x+9} cy={nodeY} r={2} fill={stk} stroke="none"/><circle cx={x+9} cy={nodeY+11} r={2} fill={stk} stroke="none"/></g>}
                            <text x={x} y={nodeY+42} textAnchor="middle" fill={isActive ? col : isPast ? `${col}88` : '#2d4a6a'} fontSize="10" fontFamily="monospace" fontWeight="700">{nodeLabels[i]}</text>
                            <text x={x} y={nodeY+55} textAnchor="middle" fill="#253550" fontSize="9" fontFamily="monospace">{nodeSub[i]}</text>
                          </g>
                        )
                      })}

                      {/* Animated Packet */}
                      {pktCable && (
                        <g>
                          <circle cy={nodeY} r={14} fill="none" stroke={currentStep?.color ?? '#38bdf8'} strokeWidth="1.5" opacity="0.3">
                            <animate attributeName="cx" from={pktCable.x1} to={pktCable.x2} dur="0.9s" repeatCount="indefinite"/>
                            <animate attributeName="r" values="8;18;8" dur="0.9s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.3;0.05;0.3" dur="0.9s" repeatCount="indefinite"/>
                          </circle>
                          <circle cy={nodeY} r={7} fill={currentStep?.color ?? '#38bdf8'} style={{ filter:`drop-shadow(0 0 10px ${currentStep?.color ?? '#38bdf8'})` }}>
                            <animate attributeName="cx" from={pktCable.x1} to={pktCable.x2} dur="0.9s" repeatCount="indefinite"/>
                          </circle>
                          <text cy={nodeY - 16} textAnchor="middle" fill={currentStep?.color ?? '#38bdf8'} fontSize="9" fontFamily="monospace" fontWeight="700">
                            <animate attributeName="x" from={pktCable.x1} to={pktCable.x2} dur="0.9s" repeatCount="indefinite"/>
                            {currentStep?.pdu}
                          </text>
                        </g>
                      )}

                      {/* Status bar */}
                      <rect x={0} y={242} width={860} height={18} fill="#080c14"/>
                      <circle cx={14} cy={251} r={4} fill={journeyRunning ? '#34d399' : journeyStep >= journeySteps.length-1 ? '#38bdf8' : '#475569'}/>
                      <text x={26} y={255} fill="#2d4060" fontSize="9" fontFamily="monospace">
                        {journeyRunning
                          ? `SIMULATING  Step ${journeyStep+1}/${journeySteps.length}: ${currentStep?.label}`
                          : journeyStep < 0
                            ? 'IDLE  Press Send Ping to begin simulation'
                            : journeyStep >= journeySteps.length-1
                              ? 'COMPLETE  HTTP/1.1 200 OK received from 8.8.8.8'
                              : `PAUSED  Step ${journeyStep+1}`}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* ── EVENT LOG ── */}
                <div style={{ background:'#070a10', border:'1px solid #1e293b', borderRadius:'8px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
                  <div style={{ background:'#0f172a', borderBottom:'1px solid #1e293b', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'#94a3b8', fontWeight:700 }}>PDU EVENT LOG</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'#334155' }}>{Math.max(0,journeyStep+1)}/{journeySteps.length}</span>
                  </div>
                  <div style={{ overflowY:'auto', flex:1, maxHeight:380 }}>
                    {journeySteps.map((step, i) => {
                      const isDone    = journeyStep >= i
                      const isCurrent = journeyStep === i
                      return (
                        <div key={step.id} style={{
                          padding:'10px 14px', borderBottom:'1px solid #0c1525',
                          background: isCurrent ? `${step.color}10` : 'transparent',
                          borderLeft:`3px solid ${isCurrent ? step.color : isDone ? `${step.color}44` : '#1e293b'}`,
                          transition:'all 0.3s', opacity: isDone ? 1 : 0.28,
                        }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.68rem', color: isCurrent ? step.color : isDone ? '#94a3b8' : '#2d4060', fontWeight:700 }}>{step.label}</span>
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', padding:'1px 6px', borderRadius:3, background: isDone ? `${step.color}22` : '#0f172a', color: isDone ? step.color : '#2d4060' }}>{step.pdu}</span>
                          </div>
                          <p style={{ margin:0, fontSize:'0.67rem', color: isDone ? '#4a6a8a':'#192840', fontFamily:'var(--font-mono)', lineHeight:1.55 }}>{step.detail}</p>
                        </div>
                      )
                    })}
                  </div>
                  {journeyStep >= journeySteps.length-1 && (
                    <div style={{ padding:'10px 14px', background:'#0d1f18', borderTop:'1px solid #16a34a44', display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#34d399', boxShadow:'0 0 6px #34d399', flexShrink:0 }}/>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'#34d399' }}>HTTP/1.1 200 OK — Connection established</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current step info bar */}
              {currentStep && (
                <div style={{ marginTop:14, background:'#0f172a', border:`1px solid ${currentStep.color}44`, borderRadius:8, padding:'12px 20px', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:currentStep.color, boxShadow:`0 0 8px ${currentStep.color}` }}/>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', color:currentStep.color, fontWeight:700 }}>{currentStep.label}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'#64748b' }}><span style={{ color:'#94a3b8' }}>PDU: </span>{currentStep.pdu}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'#64748b' }}><span style={{ color:'#94a3b8' }}>Device: </span>{currentStep.device}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'#4a6a8a', flex:1 }}>{currentStep.detail}</div>
                </div>
              )}
            </div>
          )
        })()}

        {/* TAB 8: Command Line Simulator */}
        {activeTab === 'cli' && (
          <div className="tech-card-dark" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Terminal size={24} color="#38bdf8" />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>Command Prompt Simulator</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0' }}>Practice basic network troubleshooting commands (try 'help', 'ping 8.8.8.8', 'ipconfig').</p>
              </div>
            </div>

            <div style={{ 
              background: '#000000', 
              border: '1px solid #1e293b', 
              borderRadius: '6px', 
              padding: '16px', 
              fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
              color: '#cccccc', 
              minHeight: '400px', 
              maxHeight: '500px', 
              overflowY: 'auto',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
            }}>
              {cliHistory.map((entry, idx) => (
                <div key={idx} style={{ marginBottom: entry.cmd ? '12px' : '0' }}>
                  {entry.cmd && <div style={{ color: '#ffffff', marginBottom: '4px' }}>{entry.cmd}</div>}
                  {entry.output.map((line, i) => (
                    <div key={i} style={{ minHeight: '1em' }}>{line}</div>
                  ))}
                </div>
              ))}
              <form onSubmit={handleCliCommand} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ffffff', marginRight: '8px' }}>C:\Users\Admin&gt;</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    outline: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    flex: 1,
                    width: '100%'
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>
              <div ref={cliEndRef} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
