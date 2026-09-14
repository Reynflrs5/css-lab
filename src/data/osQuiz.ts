export const osQuiz = [
  {
    id: 'os1',
    question: 'Ano ang unang hakbang bago mag-install ng Operating System sa isang bagong computer?',
    options: [
      'Mag-install ng Antivirus',
      'Pumasok sa BIOS/UEFI at i-set ang boot priority',
      'I-format agad ang Hard Drive sa Windows',
      'Mag-download ng MS Office'
    ],
    correctAnswer: 1,
    explanation: 'Bago mag-install, kailangan i-set sa BIOS o UEFI ang boot priority papunta sa iyong bootable USB o DVD para mabasa ang installer.'
  },
  {
    id: 'os2',
    question: 'Anong software tool ang madalas ginagamit para gumawa ng bootable USB flash drive mula sa isang ISO file?',
    options: [
      'Rufus',
      'WinRAR',
      'VLC Media Player',
      'Adobe Reader'
    ],
    correctAnswer: 0,
    explanation: 'Ang Rufus ay isang sikat at libreng utility na ginagamit para mag-format at gumawa ng bootable USB flash drives.'
  },
  {
    id: 'os3',
    question: 'Ano ang dalawang karaniwang partition style para sa mga hard drive?',
    options: [
      'FAT32 at NTFS',
      'MBR at GPT',
      'IDE at SATA',
      'RAM at ROM'
    ],
    correctAnswer: 1,
    explanation: 'Ang MBR (Master Boot Record) ay luma at may 2TB limit, habang ang GPT (GUID Partition Table) ay ang mas bagong standard para sa UEFI systems.'
  },
  {
    id: 'os4',
    question: 'Habang nag-i-install ng Windows, tinanong ka kung saan i-i-install ang OS. Ano ang gagawin mo kapag hindi pa naka-partition ang drive?',
    options: [
      'I-click ang "Load Driver"',
      'I-click ang "Format"',
      'I-click ang "New" para gumawa ng bagong partition',
      'I-cancel ang installation'
    ],
    correctAnswer: 2,
    explanation: 'Kailangan i-click ang "New" para makagawa ng partition mula sa unallocated space kung saan i-i-install ang Windows.'
  },
  {
    id: 'os5',
    question: 'Ano ang tawag sa maliliit na software programs na nagbibigay-daan sa operating system na maka-usap ang hardware components (e.g. video card, printer)?',
    options: [
      'Device Drivers',
      'Applications',
      'Malware',
      'Plugins'
    ],
    correctAnswer: 0,
    explanation: 'Ang Device Drivers ay nagsisilbing tulay o translator para maintindihan ng OS kung paano paganahin ang specific hardware components.'
  },
  {
    id: 'os6',
    question: 'Bakit kailangan ang Product Key habang o pagkatapos mag-install ng Windows?',
    options: [
      'Para magkaroon ng internet',
      'Para ma-activate ang Windows at mapatunayan na legal ang kopya nito',
      'Para bumilis ang computer',
      'Para hindi ma-virus'
    ],
    correctAnswer: 1,
    explanation: 'Ang Product Key ay ginagamit para sa Software Activation, na sumisiguro na ang kopya ng Windows ay lehitimo at hindi ginagamit sa mas maraming PCs kaysa sa pinapayagan.'
  },
  {
    id: 'os7',
    question: 'Ano ang pinakamagandang file system na gamitin kapag nagfo-format ng drive para sa installation ng Windows 10/11?',
    options: [
      'FAT16',
      'FAT32',
      'exFAT',
      'NTFS'
    ],
    correctAnswer: 3,
    explanation: 'Ang NTFS (New Technology File System) ay ang standard file system ng Windows NT operating systems, na may suporta para sa malalaking files at security permissions.'
  },
  {
    id: 'os8',
    question: 'Ano ang ibig sabihin ng BIOS?',
    options: [
      'Basic Input Output System',
      'Base Information Operating System',
      'Basic Internet Object System',
      'Binary Input Output Software'
    ],
    correctAnswer: 0,
    explanation: 'Ang BIOS (Basic Input/Output System) ay firmware na unang nagra-run kapag binuksan ang PC para i-initialize ang hardware at simulan ang pag-load ng OS.'
  },
  {
    id: 'os9',
    question: 'Ano ang mas modernong pamalit sa BIOS na nag-aalok ng mas mabilis na boot times at mouse support?',
    options: [
      'CMOS',
      'UEFI',
      'MBR',
      'VGA'
    ],
    correctAnswer: 1,
    explanation: 'Ang UEFI (Unified Extensible Firmware Interface) ang mas modernong standard na pumapalit sa legacy BIOS.'
  },
  {
    id: 'os10',
    question: 'Pagkatapos mag-install ng OS at Drivers, ano ang susunod na mahalagang hakbang?',
    options: [
      'Patayin ang computer at itago',
      'Mag-install ng mga Application Software at Antivirus',
      'Tanggalin ang RAM',
      'I-format ulit'
    ],
    correctAnswer: 1,
    explanation: 'Pagkatapos ng OS at Drivers, kinakailangan i-install ang Application Software (tulad ng MS Office, browsers) at Antivirus para magamit ng maayos ang PC.'
  }
]
