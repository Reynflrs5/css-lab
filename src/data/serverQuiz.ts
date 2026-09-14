export const serverQuiz = [
  {
    id: 'srv1',
    question: 'Anong feature ng Windows Server ang nagbibigay ng centralized management para sa mga users, computers, at policies sa isang network?',
    options: [
      'DNS (Domain Name System)',
      'DHCP (Dynamic Host Configuration Protocol)',
      'ADDS (Active Directory Domain Services)',
      'IIS (Internet Information Services)'
    ],
    correctAnswer: 2,
    explanation: 'Ang Active Directory Domain Services (ADDS) ang core component para sa pamamahala ng domain, paggawa ng users, at pag-set ng Group Policies.'
  },
  {
    id: 'srv2',
    question: 'Ano ang role ng DHCP (Dynamic Host Configuration Protocol) sa isang server?',
    options: [
      'Nagta-translate ng domain name papuntang IP address',
      'Awtomatikong nagbibigay ng IP addresses sa mga client computers',
      'Nagba-block ng mga virus at malware',
      'Nagho-host ng mga websites'
    ],
    correctAnswer: 1,
    explanation: 'Ang DHCP ay nag-a-automate sa pag-assign ng IP addresses, subnet masks, at default gateways para hindi na ito gawin ng manual sa bawat PC.'
  },
  {
    id: 'srv3',
    question: 'Kung ang IP address ay 192.168.1.5, at ang DNS server ng network ay may-ari ng domain na "tesda.local", ano ang trabaho ng DNS?',
    options: [
      'Magbigay ng internet connection',
      'I-translate ang hostname tulad ng "pc1.tesda.local" papunta sa IP address na 192.168.1.5',
      'I-share ang mga files sa network',
      'I-remote control ang ibang computer'
    ],
    correctAnswer: 1,
    explanation: 'Ang DNS (Domain Name System) ay gumagana na parang phonebook ng network, nagta-translate ng human-readable names papunta sa IP addresses na naiintindihan ng computer.'
  },
  {
    id: 'srv4',
    question: 'Sa Windows Server Setup, ano ang command na ginagamit para simulan ang promosyon ng isang server para maging Domain Controller (bago ang Windows Server 2012)?',
    options: [
      'ipconfig',
      'dcpromo',
      'ping',
      'tracert'
    ],
    correctAnswer: 1,
    explanation: 'Ang "dcpromo" (Domain Controller Promoter) ay ang classic command para i-promote ang server. (Sa Server 2012+, ginagawa ito via Server Manager GUI).'
  },
  {
    id: 'srv5',
    question: 'Ano ang layunin ng "Folder Redirection" sa Windows Server?',
    options: [
      'Para bumilis ang internet',
      'Para i-save ang mga files ng user (tulad ng Documents at Desktop) sa server imbes na sa local hard drive',
      'Para itago ang mga files sa ibang users',
      'Para i-format ang hard drive'
    ],
    correctAnswer: 1,
    explanation: 'Ang Folder Redirection ay ina-assign ang user folders papunta sa isang shared network location, para kahit saang PC sila mag-login, nandoon ang files nila at mas madali itong i-backup.'
  },
  {
    id: 'srv6',
    question: 'Ano ang GPO sa Active Directory?',
    options: [
      'General Purpose Output',
      'Group Policy Object',
      'Global Point Operation',
      'Graphics Processing Output'
    ],
    correctAnswer: 1,
    explanation: 'Ang Group Policy Object (GPO) ay ginagamit para mag-apply ng rules, security settings, at restrictions (tulad ng pag-disable ng Control Panel) sa mga users o computers sa domain.'
  },
  {
    id: 'srv7',
    question: 'Ano ang default port na ginagamit ng Remote Desktop Protocol (RDP)?',
    options: [
      'Port 80',
      'Port 21',
      'Port 3389',
      'Port 443'
    ],
    correctAnswer: 2,
    explanation: 'Ang RDP (Remote Desktop Protocol) ay by default gumagamit ng TCP port 3389 para payagan ang remote connection papunta sa server o PC.'
  },
  {
    id: 'srv8',
    question: 'Bago ka makapag-install ng Active Directory, ano ang dapat siguraduhin sa network settings ng server?',
    options: [
      'Ang server ay may Static IP Address',
      'Naka-off ang monitor',
      'Ang server ay nakakonekta sa Wi-Fi',
      'Naka-DHCP Client mode ang server'
    ],
    correctAnswer: 0,
    explanation: 'Ang isang server, lalo na ang Domain Controller at DNS server, ay dapat palaging may Static IP address para laging mahanap ng mga clients sa iisang address.'
  },
  {
    id: 'srv9',
    question: 'Anong uri ng account ang may pinakamataas na privilege sa isang Active Directory domain?',
    options: [
      'Local Administrator',
      'Standard User',
      'Guest',
      'Domain Admin'
    ],
    correctAnswer: 3,
    explanation: 'Ang Domain Admin account ay may full control sa buong Active Directory domain, kaya nitong magbago ng settings, magdagdag ng users, at i-manage lahat ng servers at workstations sa domain.'
  },
  {
    id: 'srv10',
    question: 'Ano ang tawag sa computer na sumali at pinamamahalaan ng Active Directory?',
    options: [
      'Workgroup PC',
      'Standalone Server',
      'Domain Member (o Client)',
      'Router'
    ],
    correctAnswer: 2,
    explanation: 'Kapag ang isang PC ay in-add sa domain, nagiging Domain Member ito at susunod na ito sa mga policies na sinetup sa server.'
  }
]
