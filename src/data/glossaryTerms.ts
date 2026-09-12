export interface GlossaryTerm {
  id: string
  term: string
  category: string
  definition: string
  example?: string
  distractors?: string[] // wrong answers for quiz mode (3 of them)
}

export const CATEGORIES = [
  'Cabling',
  'Connectors',
  'Standards',
  'Fiber Optic',
  'Network Protocols',
  'Testing & Measurement',
  'Tools & Techniques',
  'Wireless',
] as const

export const glossaryTerms: GlossaryTerm[] = [
  // ── Cabling ───────────────────────────────────────────────────────────────
  {
    id: 'utp',
    term: 'UTP',
    category: 'Cabling',
    definition: 'Unshielded Twisted Pair — the most common LAN cable. Four pairs of copper wires twisted together without any metallic shielding. Susceptible to EMI but cheap and flexible.',
    example: 'Cat 5e UTP is used for standard office Gigabit Ethernet runs.',
    distractors: [
      'Universal Transfer Protocol — a Layer 4 protocol for bulk data transfers',
      'Ultra-Thin Polyethylene — a cable jacket material standard',
      'Unified Trunk Port — a VLAN configuration method on managed switches',
    ],
  },
  {
    id: 'stp',
    term: 'STP',
    category: 'Cabling',
    definition: 'Shielded Twisted Pair — twisted-pair cable that includes a metallic foil or braid shield around each pair or all pairs together. Provides better EMI rejection than UTP; used in industrial or high-interference environments.',
    example: 'Cat 7 STP is often deployed in factory floors near heavy machinery.',
    distractors: [
      'Spanning Tree Protocol — a Layer 2 loop-prevention mechanism',
      'Single-mode Transfer Path — a fiber routing architecture',
      'Standard Transmission Port — an RS-232 serial interface type',
    ],
  },
  {
    id: 'coaxial',
    term: 'Coaxial Cable',
    category: 'Cabling',
    definition: 'A cable with a central conductor surrounded by an insulating layer, a metallic shield, and an outer jacket. Excellent noise immunity. Used for cable TV, CATV, and legacy 10BASE-2/10BASE-5 Ethernet.',
    example: 'RG-6 coaxial cable carries cable TV signals from the wall outlet to a TV set.',
    distractors: [
      'A four-pair cable with each pair coated in aluminum foil',
      'A fiber optic cable with a coated silica core and plastic cladding',
      'A two-conductor flat cable used inside computer cases for IDE drives',
    ],
  },
  {
    id: 'backbone',
    term: 'Backbone Cabling',
    category: 'Cabling',
    definition: 'The inter-building or inter-floor cabling that connects telecommunications rooms, equipment rooms, and entrance facilities. Also called vertical cabling. TIA-568 governs maximum distances.',
    example: 'A fiber run from the main IDF to the MDF on the server floor is backbone cabling.',
    distractors: [
      'Cabling inside a wall cavity connecting outlets to switches on the same floor',
      'Patch cords used to connect workstations to wall jacks',
      'The ground wire that protects cable trays from static discharge',
    ],
  },
  {
    id: 'horizontal',
    term: 'Horizontal Cabling',
    category: 'Cabling',
    definition: 'The cabling segment that runs from the telecommunications room (TR) to each work area outlet (WAO). Maximum 90 m under TIA-568 (plus up to 10 m for patch cords = 100 m channel).',
    example: 'The Cat 6 run from the patch panel to the wall jack in the office is horizontal cabling.',
    distractors: [
      'Cabling that connects multiple buildings across a campus',
      'Any cable installed along the ceiling plenum space regardless of direction',
      'The power-over-Ethernet distribution wiring within a wiring closet',
    ],
  },

  // ── Connectors ───────────────────────────────────────────────────────────
  {
    id: 'rj45',
    term: 'RJ-45',
    category: 'Connectors',
    definition: 'An 8-position 8-contact (8P8C) modular connector used on the end of Ethernet cables. The standard interface for Cat 3 through Cat 6A network connections.',
    example: 'You crimp an RJ-45 plug onto each end of a patch cable using a crimping tool.',
    distractors: [
      'A 6-position 4-contact modular connector used for telephone handsets',
      'A coaxial connector type used for cable TV and RF antenna connections',
      'A fiber optic connector with a 2.5 mm ceramic ferrule',
    ],
  },
  {
    id: 'bnc',
    term: 'BNC Connector',
    category: 'Connectors',
    definition: 'Bayonet Neill-Concelman connector — a quick-connect coaxial connector used in legacy 10BASE-2 (ThinNet) Ethernet, security cameras, and RF test equipment. Locks with a quarter-turn twist.',
    example: 'BNC connectors terminated the coaxial segments in 10BASE-2 bus networks of the 1990s.',
    distractors: [
      'A large modular connector used for thick-net AUI Ethernet links',
      'A fiber optic bayonet connector used in military communications',
      'A snap-in coaxial connector commonly found on home Wi-Fi routers',
    ],
  },
  {
    id: 'idc',
    term: 'IDC',
    category: 'Connectors',
    definition: 'Insulation Displacement Connector — a type of electrical connector that cuts through the wire insulation as it is pressed in, making contact without stripping the wire first. Used in punchdown blocks and keystone jacks.',
    example: 'A 110-block IDC slot grips the wire and cuts its insulation when the punchdown tool strikes.',
    distractors: [
      'Integrated Data Controller — the chipset that manages SATA and IDE storage buses',
      'Independent Direct Current — a power supply configuration for network switches',
      'Internal Data Cable — the ribbon cable connecting a motherboard to storage drives',
    ],
  },
  {
    id: 'keystonejack',
    term: 'Keystone Jack',
    category: 'Connectors',
    definition: 'A modular receptacle that accepts an RJ-45 plug, mounted in a wall plate or patch panel. The back is punched down with solid-core horizontal cable; the front accepts a patch cord.',
    example: 'After punching down Cat 6 to the keystone jack, snap it into the wall plate to create the work area outlet.',
    distractors: [
      'The locking mechanism on an RJ-45 plug that prevents accidental removal',
      'A type of BNC connector used on coaxial cable for CCTV systems',
      'A punch card input device used in legacy mainframe computer rooms',
    ],
  },

  // ── Standards ────────────────────────────────────────────────────────────
  {
    id: 'tia568',
    term: 'TIA-568',
    category: 'Standards',
    definition: 'ANSI/TIA-568 — the US telecommunications cabling standard published by the Telecommunications Industry Association. Defines cable categories, topologies, connectors, distances, and test requirements for structured cabling systems.',
    example: 'TIA-568 specifies that a horizontal cable run must not exceed 90 metres.',
    distractors: [
      'An IEEE standard governing 10 Gigabit Ethernet over copper cabling',
      'An ISO standard for fire-resistant plenum cable jacket materials',
      'An FCC regulation governing radio frequency emissions from network equipment',
    ],
  },
  {
    id: 't568b',
    term: 'T-568B',
    category: 'Standards',
    definition: 'The most widely used wiring scheme for RJ-45 connectors. Pin order: White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown. Both ends identical for a straight-through cable.',
    example: 'Crimp both ends with T-568B to make a straight-through patch cable for a PC-to-switch connection.',
    distractors: [
      'A wiring scheme where pin order is White-Green, Green, White-Orange, Blue, White-Blue, Orange, White-Brown, Brown',
      'A shielding specification for Cat 6A cable requiring foil on all four pairs',
      'The IEEE standard for Power over Ethernet supplying up to 60 W per port',
    ],
  },
  {
    id: 't568a',
    term: 'T-568A',
    category: 'Standards',
    definition: 'An alternative wiring scheme for RJ-45 connectors. Pin order: White-Green, Green, White-Orange, Blue, White-Blue, Orange, White-Brown, Brown. Used with T-568B to create crossover cables.',
    example: 'Wire one end T-568A and one end T-568B to create a crossover cable for connecting two switches without MDI-X.',
    distractors: [
      'The standard wiring scheme used in Australia and some European countries with pin order White-Orange, Orange…',
      'A four-pair partial-connection scheme used for telephone wiring only',
      'A power-plane wiring configuration for Cat 6A PoE deployments',
    ],
  },
  {
    id: 'ieee8023',
    term: 'IEEE 802.3',
    category: 'Standards',
    definition: 'The IEEE standard family that defines Ethernet. Covers physical layer specifications (10BASE-T, 100BASE-TX, 1000BASE-T, 10GBASE-T) and MAC protocols for wired LAN communication.',
    example: 'IEEE 802.3ab defines 1000BASE-T — Gigabit Ethernet over Cat 5e/6 UTP.',
    distractors: [
      'The IEEE standard that governs Wi-Fi (802.11) wireless LAN communications',
      'The IEEE standard that defines Bluetooth short-range radio communication',
      'The IEEE standard for token-ring LAN access method using 4 or 16 Mbps',
    ],
  },
  {
    id: 'ansi',
    term: 'ANSI',
    category: 'Standards',
    definition: 'American National Standards Institute — the US body that coordinates and publishes voluntary standards. Co-publishes the ANSI/TIA-568 structured cabling standard alongside TIA.',
    example: 'ANSI/TIA-568-C.2 is the specific clause covering balanced twisted-pair cabling.',
    distractors: [
      'Automated Network Standards Interface — a software API for network device management',
      'Applied Network Security Index — a vulnerability scoring system for LAN equipment',
      'Advanced Node Switching Infrastructure — a data center fabric architecture by Cisco',
    ],
  },

  // ── Fiber Optic ──────────────────────────────────────────────────────────
  {
    id: 'st',
    term: 'ST Connector',
    category: 'Fiber Optic',
    definition: 'Straight Tip connector — a bayonet-style fiber optic connector with a 2.5 mm ceramic ferrule. Locks with a half-twist. Older style, common in legacy multimode installations.',
    example: 'ST connectors are still found on older multimode fiber in buildings wired in the 1990s.',
    distractors: [
      'A small-form-factor fiber connector with a 1.25 mm ferrule and push-pull latch',
      'A duplex SC-style fiber connector used in CATV distribution networks',
      'A ribbon fiber connector used to terminate 12-strand MPO fiber arrays',
    ],
  },
  {
    id: 'sc',
    term: 'SC Connector',
    category: 'Fiber Optic',
    definition: 'Subscriber Connector (or Square Connector) — a push-pull fiber optic connector with a 2.5 mm ceramic ferrule. Snap-in locking. Common for both singlemode and multimode fiber.',
    example: 'SC connectors are frequently used on FTTH ONT units and fiber patch panels.',
    distractors: [
      'A bayonet-style fiber connector that locks with a quarter-twist motion',
      'A small-form-factor connector with 1.25 mm ferrule used in SFP modules',
      'A coaxial BNC-style connector adapted for fiber optic cables',
    ],
  },
  {
    id: 'lc',
    term: 'LC Connector',
    category: 'Fiber Optic',
    definition: 'Lucent Connector — a small-form-factor fiber optic connector with a 1.25 mm ceramic ferrule and RJ-45-style latch. High-density; the preferred connector for SFP/SFP+ transceivers and data center fiber.',
    example: 'LC duplex connectors terminate the fiber cables on switch SFP+ ports.',
    distractors: [
      'A fiber connector style with a 2.5 mm ferrule and bayonet locking ring',
      'A low-cost screw-type fiber connector used in CATV headend equipment',
      'A liquid-cooled connector variant used in high-power laser-based fiber links',
    ],
  },
  {
    id: 'singlemode',
    term: 'Singlemode Fiber (SMF)',
    category: 'Fiber Optic',
    definition: 'Optical fiber with a very small core (~9 µm) that carries a single light ray (mode). Supports extremely long distances (up to 80 km+) and high bandwidth. Uses laser sources. Yellow jacket by convention.',
    example: 'ISP backbones and inter-building campus runs use singlemode fiber to avoid signal loss.',
    distractors: [
      'Fiber with a large 50 µm or 62.5 µm core that supports multiple light paths simultaneously',
      'A fiber type with a plastic core used for short-range consumer audio (TOSLINK)',
      'A copper-clad fiber hybrid cable carrying both power and data over long distances',
    ],
  },
  {
    id: 'multimode',
    term: 'Multimode Fiber (MMF)',
    category: 'Fiber Optic',
    definition: 'Optical fiber with a larger core (50 µm or 62.5 µm) that allows multiple light modes to propagate. Shorter maximum distances than SMF (up to ~550 m for OM3/OM4 at 10 Gbps). Uses LED or VCSEL sources. Orange or aqua jacket.',
    example: 'OM4 multimode fiber connects server racks within the same data center floor.',
    distractors: [
      'Fiber with a 9 µm core that supports only a single light ray for long-distance runs',
      'A multi-strand copper cable twisted with plastic optical fiber for hybrid cabling',
      'A fiber type using multiple wavelengths of light over a single singlemode core',
    ],
  },
  {
    id: 'otdr',
    term: 'OTDR',
    category: 'Testing & Measurement',
    definition: 'Optical Time-Domain Reflectometer — a test instrument that injects light pulses into a fiber and measures the reflections over time to locate faults, splices, connectors, and end-of-fiber. Displays a trace showing loss vs distance.',
    example: 'An OTDR trace revealed a fusion splice with 0.8 dB loss at the 340 m mark.',
    distractors: [
      'Optical Trunk Data Router — a Layer 3 device that routes WDM fiber channels',
      'Output Transmit Data Register — a CPU register that buffers serial output data',
      'Optical Transport Data Relay — a WAN protocol for carrying Ethernet over SONET',
    ],
  },
  {
    id: 'db-attenuation',
    term: 'dB Attenuation',
    category: 'Testing & Measurement',
    definition: 'Signal loss measured in decibels (dB) as light or electrical energy travels through a cable, connector, or splice. Lower dB means less loss. Calculated as: dB = 10 × log₁₀(P_out / P_in).',
    example: 'A fiber connector typically introduces 0.5 dB of insertion loss; a full link budget allows 3 dB max.',
    distractors: [
      'Signal amplification expressed in decibels, where higher dB means stronger output',
      'The frequency range in decibels across which a cable carries data without distortion',
      'A measure of cable impedance mismatch expressed as a negative decibel value',
    ],
  },
  {
    id: 'insertion-loss',
    term: 'Insertion Loss',
    category: 'Testing & Measurement',
    definition: 'The reduction in signal power (in dB) caused by inserting a component (connector, splice, or cable segment) into a transmission path. A key pass/fail parameter in structured cabling certification.',
    example: 'TIA-568 requires Cat 6 insertion loss ≤ 21.3 dB at 100 MHz for a 90 m horizontal run.',
    distractors: [
      'The signal noise introduced when a cable is bent beyond its minimum bend radius',
      'The power gain added by an inline amplifier to compensate for cable attenuation',
      'The voltage drop across a connector when carrying PoE current',
    ],
  },
  {
    id: 'next',
    term: 'NEXT',
    category: 'Testing & Measurement',
    definition: 'Near-End Crosstalk — unwanted signal coupling from one wire pair to an adjacent pair, measured at the same end where the signal is injected. High NEXT (more dB) is better — it means less interference.',
    example: 'A fluke tester showing 42 dB NEXT at 100 MHz indicates excellent pair isolation for Cat 6.',
    distractors: [
      'Far-end crosstalk — signal leakage measured at the opposite end of the cable from the source',
      'Near-End Termination eXchange — the process of punching wires at the near-end keystone jack',
      'Network Exterior Transfer — a method of sending data between adjacent VLANs without routing',
    ],
  },

  // ── Network Protocols ────────────────────────────────────────────────────
  {
    id: 'tcp',
    term: 'TCP',
    category: 'Network Protocols',
    definition: 'Transmission Control Protocol — a Layer 4 connection-oriented protocol that provides reliable, ordered, error-checked delivery of data between applications. Uses a three-way handshake (SYN, SYN-ACK, ACK).',
    example: 'HTTP, FTP, and SSH all use TCP to ensure data arrives intact and in order.',
    distractors: [
      'Token Control Protocol — a Layer 2 protocol for token-ring LAN access control',
      'Transfer Cache Protocol — a Layer 3 mechanism for routing cached web content',
      'Tunnel Control Protocol — a VPN encapsulation protocol for private WAN connections',
    ],
  },
  {
    id: 'udp',
    term: 'UDP',
    category: 'Network Protocols',
    definition: 'User Datagram Protocol — a Layer 4 connectionless protocol. Sends datagrams without establishing a connection or guaranteeing delivery. Low overhead; used for real-time applications where speed beats reliability.',
    example: 'DNS queries, VoIP, video streaming, and online gaming use UDP to minimize latency.',
    distractors: [
      'Universal Data Protocol — a Layer 3 protocol for broadcasting data across subnets',
      'Unified Delivery Protocol — a guaranteed-delivery protocol used in cable TV systems',
      'User Defined Packet — a custom Layer 7 application data encapsulation format',
    ],
  },
  {
    id: 'dhcp',
    term: 'DHCP',
    category: 'Network Protocols',
    definition: 'Dynamic Host Configuration Protocol — automatically assigns IP addresses, subnet masks, default gateways, and DNS server addresses to network clients. Uses the DORA process: Discover, Offer, Request, Acknowledge.',
    example: 'When you plug a laptop into the LAN, DHCP assigns it an IP address automatically.',
    distractors: [
      'Dynamic Hardware Control Protocol — a protocol for remotely managing NIC firmware',
      'Distributed Host Caching Protocol — a CDN protocol for distributing web content',
      'Direct HTTP Connection Protocol — a tunneling protocol for HTTP over UDP',
    ],
  },
  {
    id: 'dns',
    term: 'DNS',
    category: 'Network Protocols',
    definition: 'Domain Name System — translates human-readable domain names (e.g., www.example.com) into IP addresses. Operates using a hierarchy of root, TLD, and authoritative name servers.',
    example: 'When you type "google.com" in a browser, DNS resolves it to 142.250.x.x.',
    distractors: [
      'Dynamic Network Switch — a managed switch that auto-configures VLANs based on MAC addresses',
      'Data Numbering System — the binary/hexadecimal notation used in IP address calculations',
      'Distributed Node System — a mesh networking protocol for ad-hoc wireless LANs',
    ],
  },

  // ── Tools & Techniques ───────────────────────────────────────────────────
  {
    id: 'punchdown',
    term: 'Punchdown Tool',
    category: 'Tools & Techniques',
    definition: 'A spring-loaded hand tool used to press individual wire conductors into IDC slots on 110-blocks, BIX blocks, or keystone jacks. The blade simultaneously seats and trims the excess wire. Blade type must match the block (110 or BIX).',
    example: 'Use the 110-blade punchdown tool at a 90° angle to the block when terminating Cat 6.',
    distractors: [
      'A crimping tool used to attach RJ-45 plugs to the ends of patch cables',
      'A cable stripper that removes the outer jacket and pair insulation simultaneously',
      'A wire-pulling fish tape used to route cables through wall cavities',
    ],
  },
  {
    id: '110-block',
    term: '110 Block',
    category: 'Tools & Techniques',
    definition: 'A type of wiring block (IDC) commonly used in structured cabling systems. Horizontal cable wires are punched down in rows; connecting blocks then link them to patch panels or other termination points. Designed for 24 AWG solid conductors.',
    example: 'Horizontal cable from each office outlet is terminated on the 110 block in the IDF.',
    distractors: [
      'A legacy wiring block used in telephone systems, larger than modern IDC types',
      'A 110-port Ethernet switch designed for high-density server room deployments',
      'A power distribution block that supplies 110 V AC to multiple network devices',
    ],
  },
  {
    id: 'bix-block',
    term: 'BIX Block',
    category: 'Tools & Techniques',
    definition: 'Building Industry Cross-connect — an IDC wiring block system developed by Nortel. Uses a unique BIX-blade punchdown tool. Common in Canadian telecom installations. Wires terminate in angled IDC slots rather than the vertical 110 orientation.',
    example: 'BIX blocks require the BIX-specific blade; using a 110 blade will damage the block.',
    distractors: [
      'A fiber optic cross-connect panel used in data center main distribution frames',
      'A patch panel standard where cables are pre-terminated with RJ-45 connectors',
      'A shielded wiring block used exclusively with STP Cat 7 cable terminations',
    ],
  },
  {
    id: 'cable-tester',
    term: 'Cable Tester',
    category: 'Tools & Techniques',
    definition: 'A device that verifies cable wiring, continuity, and pin mapping. Basic testers check for opens, shorts, and miswires. Certifiers (e.g., Fluke DSX) perform full TIA-568 performance tests including insertion loss and NEXT.',
    example: 'A simple continuity tester caught a split-pair wiring error in a newly punched keystone jack.',
    distractors: [
      'A device that measures the resistance of the cable jacket to protect against ground faults',
      'A tool used to verify the impedance matching between network cards and switches',
      'A voltage meter used to test PoE power levels at each port of a network switch',
    ],
  },
  {
    id: 'fish-tape',
    term: 'Fish Tape',
    category: 'Tools & Techniques',
    definition: 'A long, flexible steel or fiberglass tape coiled in a reel, used to route (fish) cables through walls, conduits, and ceiling spaces. The cable is attached to the end of the tape and pulled back through.',
    example: 'Thread the fish tape from the drop ceiling to the wall plate opening, then tape Cat 6 to its hook and pull through.',
    distractors: [
      'A self-adhesive label tape used to mark cable runs with port and circuit information',
      'A braided steel wire mesh used as an outer shield on armored outdoor cables',
      'A colour-coded insulation tape used to identify wire pairs before punchdown',
    ],
  },

  // ── Wireless ────────────────────────────────────────────────────────────
  {
    id: 'ssid',
    term: 'SSID',
    category: 'Wireless',
    definition: 'Service Set Identifier — the name of a wireless LAN broadcast by an access point so that clients can discover and connect to it. Can be hidden (not broadcast) for minimal security obscurity.',
    example: 'The AP broadcasts SSID "OfficeNet-5GHz" so laptops can find and join the corporate Wi-Fi.',
    distractors: [
      'Subnet Selector and Interface Driver — the software module that selects subnets for VLANs',
      'Secure Socket Identification Directory — a PKI certificate database on RADIUS servers',
      'Static Switch IP Database — the ARP table maintained by a Layer 3 switch',
    ],
  },
  {
    id: 'wpawpa2',
    term: 'WPA2',
    category: 'Wireless',
    definition: 'Wi-Fi Protected Access 2 — the widely deployed wireless security standard using AES-CCMP encryption. Supports Personal (pre-shared key) and Enterprise (802.1X/RADIUS) authentication modes.',
    example: 'Corporate Wi-Fi uses WPA2-Enterprise with RADIUS authentication to validate user certificates.',
    distractors: [
      'A wireless protocol that uses RC4 encryption with a 40-bit key — now considered insecure',
      'A VLAN-based wireless isolation standard preventing AP-to-AP communication',
      'A power management mode where APs reduce transmit power during off-peak hours',
    ],
  },
  {
    id: 'ieee80211',
    term: 'IEEE 802.11',
    category: 'Wireless',
    definition: 'The IEEE standard family governing Wi-Fi wireless LAN communications. Key amendments include 802.11a/b/g/n/ac/ax (Wi-Fi 6). Operates in 2.4 GHz, 5 GHz, and 6 GHz (Wi-Fi 6E) bands.',
    example: '802.11ax (Wi-Fi 6) achieves up to 9.6 Gbps theoretical throughput using OFDMA.',
    distractors: [
      'The IEEE standard governing wired Ethernet MAC and physical layer specifications',
      'The IEEE standard for Bluetooth personal area network radio communications',
      'The IEEE standard for Power over Ethernet supplying DC power through Cat 5e+',
    ],
  },

  // ── Extra / Mixed ────────────────────────────────────────────────────────
  {
    id: 'poe',
    term: 'PoE',
    category: 'Standards',
    definition: 'Power over Ethernet — delivers DC electrical power along with data over standard Cat 5e+ cable. IEEE 802.3af supplies up to 15.4 W per port; 802.3at (PoE+) up to 30 W; 802.3bt (PoE++) up to 90 W.',
    example: 'IP cameras and wireless APs are powered over the same Cat 6 cable that carries data.',
    distractors: [
      'Protocol over Ethernet — a Layer 2 encapsulation for routing proprietary protocols',
      'Port over Ethernet — the ability to use a single switch port for multiple VLANs simultaneously',
      'Pair over Ethernet — a bonding technique that combines two Cat 5e cables into one logical link',
    ],
  },
  {
    id: 'vlan',
    term: 'VLAN',
    category: 'Network Protocols',
    definition: 'Virtual LAN — a logical partition of a Layer 2 network created by configuring switch ports. Devices in the same VLAN communicate as if on the same physical segment, even if on different switches. Defined by IEEE 802.1Q.',
    example: 'A school separates student and staff traffic by placing them in VLAN 10 and VLAN 20.',
    distractors: [
      'Virtual Link Access Node — a Layer 3 routing technique for connecting remote branches',
      'Variable Length Allocation Network — a subnetting scheme using CIDR notation',
      'Vectored LAN — a DSL bonding technique that eliminates crosstalk on copper pairs',
    ],
  },
  {
    id: 'mac',
    term: 'MAC Address',
    category: 'Network Protocols',
    definition: 'Media Access Control address — a unique 48-bit hardware identifier assigned to every NIC, expressed as six hex octets (e.g., 00:1A:2B:3C:4D:5E). Used by Layer 2 switches to forward Ethernet frames to the correct port.',
    example: 'A switch learns that port 3 connects the device with MAC 00:1A:2B:3C:4D:5E and only sends frames destined for that MAC to port 3.',
    distractors: [
      'Maximum Allowed Capacity — the peak throughput rating of a network interface card',
      'Managed Access Controller — the authentication server in an 802.1X deployment',
      'Multi-Access Channel — a radio frequency assignment for cellular base stations',
    ],
  },
  {
    id: 'plenum',
    term: 'Plenum Cable',
    category: 'Cabling',
    definition: 'Cable with a special flame-retardant, low-smoke jacket (CMP-rated) approved for installation in plenum air spaces (spaces used for air circulation, like drop ceilings and raised floors). Required by NEC in these environments.',
    example: 'Cat 6 CMP plenum cable must be used in the drop ceiling above the office to meet fire code.',
    distractors: [
      'A heavily armored outdoor cable rated for direct burial in soil or conduit',
      'A cable with a gel-filled jacket that prevents water ingress in wet locations',
      'A flat cable designed to run under carpets in residential and small office settings',
    ],
  },
]
