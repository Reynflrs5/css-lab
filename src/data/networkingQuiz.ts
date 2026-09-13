import { type QuizQuestion } from './hardwareQuiz'
export { type QuizQuestion }

export const networkingQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Alin sa mga sumusunod ang TAMANG pagkakasunod-sunod ng OSI Model mula sa pinakamataas (Layer 7) hanggang pinakamababa (Layer 1)?",
    choices: [
      "Application, Presentation, Session, Transport, Network, Data Link, Physical",
      "Physical, Data Link, Network, Transport, Session, Presentation, Application",
      "Application, Transport, Network, Session, Presentation, Data Link, Physical",
      "Network, Transport, Application, Physical, Data Link, Session, Presentation"
    ],
    correctIndex: 0,
    explanation: "Ang OSI Model ay may 7 layers. Mula pinakamataas: Layer 7-Application (HTTP, DNS), Layer 6-Presentation (SSL, JPEG), Layer 5-Session (NetBIOS), Layer 4-Transport (TCP/UDP), Layer 3-Network (IP), Layer 2-Data Link (MAC, Ethernet), Layer 1-Physical (cables, signals). Mnemonics: 'All People Seem To Need Data Processing'."
  },
  {
    id: 2,
    question: "Ano ang default subnet mask ng isang Class C IPv4 address?",
    choices: [
      "255.0.0.0",
      "255.255.0.0",
      "255.255.255.0",
      "255.255.255.255"
    ],
    correctIndex: 2,
    explanation: "Ang Class C addresses (192.0.0.0 – 223.255.255.255) ay may default subnet mask na 255.255.255.0 o /24 sa CIDR notation. Ibig sabihin, ang unang 24 bits ang network portion at ang huling 8 bits ang host portion — nagbibigay ng 254 usable hosts per subnet."
  },
  {
    id: 3,
    question: "Sa network topology, ano ang tawag sa uri ng koneksyon kung saan lahat ng devices ay naka-connect sa isang central switch?",
    choices: [
      "Bus Topology",
      "Ring Topology",
      "Star Topology",
      "Mesh Topology"
    ],
    correctIndex: 2,
    explanation: "Ang Star Topology ay ang pinakakaraniwang topology sa mga LAN ngayon. Lahat ng nodes ay nagko-connect point-to-point sa isang central switch. Ang pangunahing kalamangan: madaling mag-troubleshoot at ang pagpalya ng isang cable ay hindi makakaapekto sa ibang devices. Ang kahinaan: ang switch ang single point of failure."
  },
  {
    id: 4,
    question: "Alin sa mga sumusunod ang PRIVATE IP address ayon sa RFC 1918?",
    choices: [
      "172.32.0.1",
      "192.168.10.50",
      "128.100.5.1",
      "200.100.50.25"
    ],
    correctIndex: 1,
    explanation: "Ayon sa RFC 1918, ang tatlong private IP address ranges ay: 10.0.0.0/8 (Class A), 172.16.0.0 – 172.31.255.255/12 (Class B), at 192.168.0.0/16 (Class C). Ang 192.168.10.50 ay nasa 192.168.0.0/16 range kaya ito ay private IP. Hindi ito routable sa public internet."
  },
  {
    id: 5,
    question: "Sa OSI Model, sa aling layer nagtatrabaho ang IP address?",
    choices: [
      "Layer 2 - Data Link Layer",
      "Layer 3 - Network Layer",
      "Layer 4 - Transport Layer",
      "Layer 7 - Application Layer"
    ],
    correctIndex: 1,
    explanation: "Ang IP (Internet Protocol) address ay nagtatrabaho sa Layer 3 (Network Layer) ng OSI Model. Ang Network Layer ay responsable sa logical addressing at routing ng packets sa pagitan ng iba't ibang networks. Ang MAC address naman ay Layer 2 (Data Link Layer)."
  },
  {
    id: 6,
    question: "Ano ang maximum na distance ng isang Cat5e UTP cable para sa 1000BASE-T (Gigabit Ethernet) na koneksyon?",
    choices: [
      "50 meters",
      "100 meters",
      "150 meters",
      "200 meters"
    ],
    correctIndex: 1,
    explanation: "Ang maximum na segment length ng Cat5e (at Cat6/Cat6a) para sa 1000BASE-T Gigabit Ethernet ay 100 meters. Ito ay isang IEEE 802.3 standard. Higit sa 100 meters, may malaking posibilidad na mag-degrade ang signal (attenuation) na nagdudulot ng packet loss at mababang throughput."
  },
  {
    id: 7,
    question: "Ano ang pagkakaiba ng TCP at UDP sa Transport Layer?",
    choices: [
      "Ang TCP ay mas mabilis kaysa UDP dahil walang error checking",
      "Ang UDP ay connection-oriented habang ang TCP ay connectionless",
      "Ang TCP ay connection-oriented at may error correction; ang UDP ay connectionless at walang guaranteed delivery",
      "Walang pagkakaiba, parehong protocol ay gumagamit ng parehong mekanismo"
    ],
    correctIndex: 2,
    explanation: "Ang TCP (Transmission Control Protocol) ay connection-oriented: gumagamit ng 3-way handshake (SYN-SYN/ACK-ACK), may guaranteed delivery, at nag-o-order ng packets. Ginagamit sa HTTP, FTP, email. Ang UDP (User Datagram Protocol) ay connectionless: walang acknowledgment, mas mabilis, ngunit walang guaranteed delivery. Ginagamit sa video streaming, VoIP, at DNS."
  },
  {
    id: 8,
    question: "Sa isang /26 subnet, ilang usable hosts ang available per subnet?",
    choices: [
      "30 hosts",
      "62 hosts",
      "126 hosts",
      "254 hosts"
    ],
    correctIndex: 1,
    explanation: "Sa /26 subnet, ang host bits ay 32 - 26 = 6 bits. Formula: 2^6 - 2 = 64 - 2 = 62 usable hosts. Ang dalawang address na binabawas ay ang Network Address (unang address) at Broadcast Address (huling address). Ang /26 ay katumbas ng subnet mask na 255.255.255.192."
  },
  {
    id: 9,
    question: "Ano ang function ng DNS (Domain Name System)?",
    choices: [
      "Nag-a-assign ng dynamic IP addresses sa mga network devices",
      "Nag-i-translate ng domain names (tulad ng google.com) papuntang IP addresses",
      "Nagpo-provide ng secure encrypted tunnel sa pagitan ng dalawang networks",
      "Nagko-control ng access sa network resources batay sa user credentials"
    ],
    correctIndex: 1,
    explanation: "Ang DNS (Domain Name System) ay ang 'phone book' ng internet. Nag-i-translate ito ng human-readable domain names (e.g., www.tesda.gov.ph) papuntang machine-readable IP addresses (e.g., 203.94.81.66). Nagtatrabaho ito sa Layer 7 (Application Layer) at gumagamit ng UDP port 53 (at TCP port 53 para sa zone transfers)."
  },
  {
    id: 10,
    question: "Alin sa mga sumusunod na devices ang nagtatrabaho sa Layer 3 (Network Layer) ng OSI Model?",
    choices: [
      "Network Hub",
      "Ethernet Switch",
      "Router",
      "Network Bridge"
    ],
    correctIndex: 2,
    explanation: "Ang Router ay nagtatrabaho sa Layer 3 (Network Layer). Ginagamit nito ang IP addresses para mag-forward ng packets sa pagitan ng iba't ibang networks. Ang Hub ay Layer 1 (Physical), ang Switch ay Layer 2 (Data Link — gumagamit ng MAC addresses), at ang Bridge ay Layer 2 din."
  }
]
