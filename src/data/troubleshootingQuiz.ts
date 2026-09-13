import { type QuizQuestion } from './hardwareQuiz'
export { type QuizQuestion }

export const troubleshootingQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Kapag na-boot ang PC at nagsimulang mag-beep ng paulit-ulit na maikli (1 short beep paulit-ulit), anong karaniwang hardware problem ang isinasaad nito sa AMI BIOS?",
    choices: [
      "RAM failure o hindi naka-detect na RAM",
      "Sira ang CPU",
      "Walang power ang PSU",
      "Overheating ng CPU"
    ],
    correctIndex: 0,
    explanation: "Sa AMI BIOS, ang paulit-ulit na short beeps ay kadalasang nagpapahiwatig ng RAM problem. Ang 1 short beep ay normal POST (system OK). Ang iba: 2 short = parity error (RAM), 3 short = base 64K RAM failure, 7 short = processor exception. Ang unang dapat subukan: i-reseat ang RAM modules, linisin ang gold contacts gamit ang eraser, at subukan ang iba't ibang RAM slot."
  },
  {
    id: 2,
    question: "Alin sa mga sumusunod ang UNANG hakbang sa systematic troubleshooting ng isang PC na hindi nag-a-on?",
    choices: [
      "Palitan agad ang PSU",
      "I-format ang hard drive at i-reinstall ang OS",
      "I-verify na may kuryente ang power outlet at lahat ng power cables ay firmly connected",
      "Tanggalin ang RAM at GPU at subukang i-on muli"
    ],
    correctIndex: 2,
    explanation: "Ang unang prinsipyo ng systematic troubleshooting ay ang pinakasimple at pinaka-obvious na dahilan muna. Bago baguhin ang anumang hardware: (1) Suriin ang power outlet gamit ang ibang device. (2) I-check ang power cable. (3) Siguraduhing naka-on ang PSU switch (sa likod). (4) I-check ang front panel power switch connector sa motherboard. Ito ay tinatawag na 'Level 0' troubleshooting."
  },
  {
    id: 3,
    question: "Ano ang POST sa konteksto ng PC troubleshooting?",
    choices: [
      "Power On Self Test — isang diagnostic sequence na isinasagawa ng BIOS/UEFI bago mag-load ang operating system",
      "Pre-Operating System Tool — software na ginagamit para mag-diagnose ng hardware",
      "Peripheral Output Scan Test — proseso ng pag-check ng mga connected peripherals",
      "Power Output Stability Test — test ng PSU voltage rails"
    ],
    correctIndex: 0,
    explanation: "Ang POST (Power On Self Test) ay isang built-in diagnostic program na naka-store sa BIOS/UEFI chip. Awtomatikong nagtatakbo ito sa bawat boot. Sinusuri nito ang CPU, RAM, GPU, keyboard controller, at iba pang kritikal na hardware. Kung may nakitang problema, nagbibigay ito ng error signal sa pamamagitan ng beep codes, POST code LED, o error message sa screen bago mag-proceed sa OS boot."
  },
  {
    id: 4,
    question: "Kapag gumamit ng multimeter para subukin ang ATX PSU, ano ang dapat maging voltage sa isang healthy +12V rail (Yellow wire)?",
    choices: [
      "Eksaktong 12.000V",
      "Sa pagitan ng 11.4V at 12.6V (+/-5% tolerance)",
      "Sa pagitan ng 10V at 14V",
      "Kahit anong positive voltage ay okay"
    ],
    correctIndex: 1,
    explanation: "Ayon sa ATX specification, ang acceptable tolerance para sa lahat ng PSU voltage rails ay +/-5%. Para sa +12V rail: minimum 11.4V, maximum 12.6V. Para sa +5V: 4.75V – 5.25V. Para sa +3.3V: 3.135V – 3.465V. Ang labas sa tolerance range ay nagpapahiwatig ng failing PSU na maaaring magdulot ng system instability, data corruption, o hardware damage."
  },
  {
    id: 5,
    question: "Ano ang karaniwang dahilan ng BSOD (Blue Screen of Death) na may stop code na IRQL_NOT_LESS_OR_EQUAL?",
    choices: [
      "Sira ang hard drive",
      "Driver conflict, faulty RAM, o hardware incompatibility — isang program o driver ay nag-access ng memory sa hindi wastong privilege level",
      "Kulang ang storage space sa C: drive",
      "Overheating ng GPU"
    ],
    correctIndex: 1,
    explanation: "Ang IRQL_NOT_LESS_OR_EQUAL (0x0000000A) na BSOD ay nangyayari kapag ang isang driver o kernel-mode code ay nagtangkang mag-access ng pagode ng memory gamit ang masyadong mataas na IRQL (Interrupt Request Level). Karaniwang dahilan: bagong na-install na driver na may bug, faulty RAM (subukan sa Windows Memory Diagnostic o MemTest86), o incompatible hardware. Ang solusyon: i-check ang recently installed drivers, mag-run ng RAM test."
  },
  {
    id: 6,
    question: "Kapag nag-troubleshoot ng 'No Display' issue sa isang PC, anong order ng mga hakbang ang dapat sundin?",
    choices: [
      "Palitan agad ang monitor, video card, at motherboard",
      "I-check ang monitor cable at power, i-reseat ang GPU, i-test sa integrated graphics, i-reseat ang RAM, at i-check ang BIOS",
      "I-format agad ang OS at i-reinstall",
      "I-replace ang CPU thermal paste"
    ],
    correctIndex: 1,
    explanation: "Para sa 'No Display' troubleshooting: (1) Suriin ang monitor cable (HDMI/DisplayPort/VGA) at monitor power. (2) Subukang ibang cable at ibang video output port. (3) Kung may iGPU ang CPU, i-disconnect ang discrete GPU at gamitin ang onboard video. (4) I-reseat ang RAM at GPU. (5) I-clear ang CMOS (remove battery). (6) Subukan ang isa-isang RAM stick. Gamitin ang pag-isolate ng components bilang pangunahing diskarte."
  },
  {
    id: 7,
    question: "Ano ang preventive maintenance schedule na inirerekomenda para sa regular na paglilinis ng PC tower?",
    choices: [
      "Araw-araw",
      "Linggu-linggo",
      "Buwanan",
      "Bawat 3-6 buwan, depende sa kapaligiran"
    ],
    correctIndex: 3,
    explanation: "Ang karaniwang inirerekomenda ng TESDA CSS NC II at ng mga manufacturer ay ang paglilinis ng PC tower bawat 3-6 buwan. Sa mas marumi o dusty na kapaligiran (tulad ng workshop o construction area), maaaring kailanganin ito bawat 1-3 buwan. Ang pagtitipon ng alikabok sa heatsink at fans ay nagdudulot ng overheating at mas mataas na operating temperatures."
  },
  {
    id: 8,
    question: "Ang isang PC ay nag-a-on ngunit hindi nag-a-load ang OS at may error na 'Boot Device Not Found'. Ano ang pinaka-malamang na dahilan?",
    choices: [
      "Sira ang monitor",
      "Nasira ang RAM",
      "Ang hard drive o SSD ay hindi naka-detect ng BIOS, o mali ang boot order sa BIOS settings",
      "Sira ang CPU"
    ],
    correctIndex: 2,
    explanation: "Ang 'Boot Device Not Found' error ay nagpapahiwatig na hindi mahanap ng BIOS ang bootable device. Mga posibleng dahilan: (1) Ang HDD/SSD ay hindi naka-detect — subukan ang iba pang SATA cable at power connector. (2) Mali ang boot order sa BIOS/UEFI — i-set ang storage drive bilang first boot device. (3) Nasira o corrupted ang Master Boot Record (MBR) o EFI boot partition. (4) Physically sira ang HDD/SSD."
  },
  {
    id: 9,
    question: "Sa preventive maintenance, bakit hindi dapat gamitin ang ordinary na basang basahan para linisin ang internal na bahagi ng PC?",
    choices: [
      "Maaaring magdulot ng kalmot sa plastic components",
      "Ang tubig ay nagco-conduct ng kuryente at maaaring mag-cause ng short circuit at permanenteng pinsala sa motherboard at ibang components",
      "Masyadong mahal ang regular na basahan",
      "Mas epektibo ang compressed air para sa lahat ng cases"
    ],
    correctIndex: 1,
    explanation: "Ang tubig ay isang electrical conductor. Kahit maliit na halaga ng tubig na naiwan sa motherboard ay maaaring mag-cause ng short circuit na masisira ang mahalagang at mahal na components. Para sa internal cleaning: gamitin ang compressed air para sa alikabok, at isopropyl alcohol (90%+) na may lint-free cloth para sa stubborn na dumi sa mga connector contacts. Hintayin na tumigas ang alkohol bago i-on."
  },
  {
    id: 10,
    question: "Kapag nag-diagnose ng intermittent freezing o random restart ng PC, ano ang pinaka-epektibong paraan para matukoy kung ang RAM ang dahilan?",
    choices: [
      "Tingnan ang kulay ng RAM sticks",
      "I-run ang MemTest86 (bootable RAM testing tool) para sa minimum na 2 full passes",
      "Baguhin ang wallpaper ng desktop",
      "I-update ang Windows Update"
    ],
    correctIndex: 1,
    explanation: "Ang MemTest86 ay isang bootable, OS-independent na RAM testing tool. Ito ay nagtatakbo ng maraming uri ng memory tests (walking bit, MOVSB, at iba pa) na nakaka-detect ng: faulty memory cells, timing issues, at instability sa mataas na temperature. Ang minimum na 2 full passes (mas maganda ang 4-8 passes) ay inirerekomenda. Kung may error, i-test ang bawat stick nang isa-isa para matukoy kung aling module ang sira."
  }
]
