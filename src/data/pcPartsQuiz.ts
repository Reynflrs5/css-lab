import { type QuizQuestion } from './hardwareQuiz'
export { type QuizQuestion }

export const pcPartsQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Ano ang pangunahing pagkakaiba ng LGA (Land Grid Array) at PGA (Pin Grid Array) CPU socket?",
    choices: [
      "Ang LGA ay para lamang sa AMD processors habang ang PGA ay para sa Intel",
      "Sa LGA socket, ang pins ay nasa motherboard; sa PGA socket, ang pins ay nasa CPU",
      "Sa LGA socket, ang pins ay nasa CPU; sa PGA socket, ang pins ay nasa motherboard",
      "Walang pagkakaiba, parehong uri ay compatible sa lahat ng CPUs"
    ],
    correctIndex: 1,
    explanation: "Sa LGA (Land Grid Array): ang pins ay nasa socket ng motherboard at ang CPU ay may flat contact pads lang — ginagamit ng Intel (LGA 1200, LGA 1700, LGA 1851). Sa PGA (Pin Grid Array): ang pins ay nasa ilalim ng CPU at ang socket ng motherboard ay may holes — dating ginagamit ng AMD (AM4). Ang bagong AMD AM5 socket ay lumipat na sa LGA-style din."
  },
  {
    id: 2,
    question: "Ano ang PCIe x16 slot at para saan ito pangunahin na ginagamit?",
    choices: [
      "Isang 16-pin power connector para sa GPU",
      "Isang high-bandwidth expansion slot na may 16 PCIe lanes, pangunahin para sa dedicated graphics cards (GPU)",
      "Isang storage interface para sa M.2 NVMe SSDs",
      "Isang 16-channel audio interface para sa sound cards"
    ],
    correctIndex: 1,
    explanation: "Ang PCIe (Peripheral Component Interconnect Express) x16 slot ay ang pinakamalapad na PCIe slot na may 16 parallel lanes. Bawat lane ay nagbibigay ng bidirectional bandwidth na ~2 GB/s (PCIe 4.0) o ~4 GB/s (PCIe 5.0). Pangunahin itong ginagamit para sa dedicated GPUs na nangangailangan ng mataas na bandwidth para sa texture streaming at rendering data."
  },
  {
    id: 3,
    question: "Ano ang pagkakaiba ng DDR4 at DDR5 RAM?",
    choices: [
      "Ang DDR5 ay mas mabagal ngunit mas mura kaysa DDR4",
      "Ang DDR5 ay may mas mataas na base frequency, mas mataas na bandwidth, lower voltage (1.1V vs 1.2V), at on-die ECC — ngunit hindi ito backward compatible sa DDR4 slots",
      "Ang DDR4 at DDR5 ay parehong compatible sa lahat ng motherboards",
      "Ang DDR5 ay mas malaki ang laki ng stick kaysa DDR4"
    ],
    correctIndex: 1,
    explanation: "Ang DDR5 vs DDR4 key differences: (1) Frequency: DDR5 starts at 4800 MT/s vs DDR4 na 2133 MT/s. (2) Voltage: DDR5 uses 1.1V vs DDR4 1.2V — mas power efficient. (3) On-die ECC: DDR5 ay may built-in error correction. (4) Dual 32-bit channels per DIMM vs single 64-bit channel sa DDR4. (5) PMIC (Power Management IC) ay nasa DIMM na mismo. HINDI sila backward compatible — ang DDR5 slot ay may notch sa ibang posisyon."
  },
  {
    id: 4,
    question: "Ano ang ATX form factor ng motherboard at ano ang karaniwang dimensions nito?",
    choices: [
      "305mm x 244mm — ang pinakakaraniwang full-size motherboard form factor para sa desktop PCs",
      "170mm x 170mm — ang pinakamaliit na motherboard form factor",
      "244mm x 244mm — isang square motherboard form factor",
      "305mm x 305mm — ang pinakamalaking motherboard form factor"
    ],
    correctIndex: 0,
    explanation: "Ang ATX (Advanced Technology Extended) ay ang pinaka-standard na motherboard form factor para sa desktop PCs: 305mm x 244mm (12 x 9.6 inches). Nagbibigay ito ng maraming expansion slots at connectors. Ang iba pang karaniwang form factors: Micro-ATX (244mm x 244mm), Mini-ITX (170mm x 170mm), at E-ATX (305mm x 330mm para sa high-end workstations)."
  },
  {
    id: 5,
    question: "Ano ang M.2 storage interface at ano ang dalawang pangunahing protocol na ginagamit nito?",
    choices: [
      "Isang uri ng external storage connector; gumagamit ng USB at Thunderbolt",
      "Isang compact, direct-mount storage form factor na gumagamit ng SATA o NVMe (PCIe) protocol — ang NVMe ay mas mabilis",
      "Isang wireless storage solution na gumagamit ng WiFi 6E",
      "Isang legacy storage interface na ginagamit pa lamang sa mga lumang systems"
    ],
    correctIndex: 1,
    explanation: "Ang M.2 ay isang compact form factor na direktang naka-mount sa motherboard. Gumagamit ito ng dalawang protocol: (1) SATA M.2 — parehong bandwidth sa traditional 2.5-inch SATA SSD (~550 MB/s). (2) NVMe M.2 (via PCIe) — drastically mas mabilis: PCIe 3.0 x4 ~3,500 MB/s, PCIe 4.0 x4 ~7,000 MB/s, PCIe 5.0 x4 ~14,000 MB/s. Ang key notch positions ay nagtatakda ng compatibility (M key, B key, B+M key)."
  },
  {
    id: 6,
    question: "Ano ang function ng chipset sa isang motherboard?",
    choices: [
      "Nag-execute ng lahat ng computing instructions tulad ng CPU",
      "Nagsi-serve bilang traffic controller na namamahala ng data flow sa pagitan ng CPU, RAM, storage, at peripheral devices",
      "Nagbibigay ng electrical power sa lahat ng components",
      "Nag-store ng BIOS/UEFI firmware"
    ],
    correctIndex: 1,
    explanation: "Ang chipset (dati ay North Bridge + South Bridge, ngayon ay isa na lang na Platform Controller Hub sa Intel) ay ang 'traffic manager' ng motherboard. Namamahala ito ng komunikasyon sa pagitan ng CPU at ng: PCIe lanes para sa GPU at storage, USB controllers, SATA controllers, audio codec, at network interface. Ang chipset tier (B-series, Z-series, X-series) ay nagtatakda ng features tulad ng CPU overclocking support."
  },
  {
    id: 7,
    question: "Alin sa mga sumusunod ang TAMA na pahayag tungkol sa CPU TDP (Thermal Design Power)?",
    choices: [
      "Ang TDP ay ang maximum na power na kayang gamitin ng CPU",
      "Ang TDP ay ang halaga ng heat sa watts na kailangang ma-dissipate ng cooling solution para mapanatili ang CPU sa loob ng operational temperature limits sa base clock speed",
      "Ang TDP ay isang benchmark score ng CPU performance",
      "Ang TDP ay ang voltage ng CPU"
    ],
    correctIndex: 1,
    explanation: "Ang TDP (Thermal Design Power) ay ang dinisenyon na halaga ng heat output sa Watts na dapat kayang i-dissipate ng cooling solution upang mapanatili ang CPU sa loob ng maximum junction temperature (Tjmax) sa base clock speed. Halimbawa, ang Intel Core i9-14900K ay may 125W TDP — ibig sabihin ang cooler ay dapat kayang mag-dissipate ng minimum 125W. Sa Turbo Boost, ang actual power consumption ay maaaring mas mataas (MTP/PL2)."
  },
  {
    id: 8,
    question: "Ano ang Front Panel Connectors sa motherboard at ano ang mga karaniwang kasama dito?",
    choices: [
      "Ang mga connector para sa external monitors at display devices",
      "Ang mga connector para sa USB 3.0 ports sa front ng casing",
      "Ang mga small pin headers para sa power switch, reset switch, power LED, HDD activity LED, at case speaker",
      "Ang mga connector para sa front panel audio jack ng casing"
    ],
    correctIndex: 2,
    explanation: "Ang Front Panel Connectors (F_PANEL) ay isang grupo ng 2-pin headers sa motherboard na nagko-connect sa casing buttons at LEDs: (1) PWR_SW — Power Switch para i-on ang PC. (2) RESET — Reset button. (3) PWR_LED — Power indicator LED (+/-). (4) HDD_LED — Storage activity LED. (5) SPEAKER — Internal case speaker para sa POST beep codes. Ang maling pagkakasunod-sunod ng mga ito ay isang karaniwang dahilan ng 'PC na hindi nag-a-on' pagkatapos ng assembly."
  },
  {
    id: 9,
    question: "Ano ang PWM (Pulse Width Modulation) fan control at bakit ito ginagamit?",
    choices: [
      "Isang uri ng fan na hindi nag-a-adjust ng speed — laging maximum speed",
      "Isang paraan ng fan speed control kung saan ang BIOS/motherboard ay nagse-send ng on/off pulses sa fan motor para makontrol ang average speed batay sa temperature sensor readings",
      "Isang wireless fan control system",
      "Isang software na gumagawa ng fan animation sa desktop"
    ],
    correctIndex: 1,
    explanation: "Ang PWM (Pulse Width Modulation) fan control ay ginagamit ng 4-pin fan headers sa motherboard. Ang 4th pin ay nagse-send ng PWM signal (25kHz) na nagkokontrol ng fan speed sa pamamagitan ng pagbabago ng duty cycle (0%-100%). Halimbawa: 50% duty cycle = ~50% fan speed. Ang kalamangan: ang fan ay nananatili sa mas mababang speed (mas tahimik) kapag malamig, at awtomatikong nagpapabilis kapag mainit ang CPU/system. Mas mahusay kaysa voltage control na ginagamit ng 3-pin fans."
  },
  {
    id: 10,
    question: "Ano ang 80 PLUS certification para sa Power Supply Units (PSU)?",
    choices: [
      "Certification na ang PSU ay may minimum na 80 watts ng output",
      "Isang efficiency certification na nagpapatunay na ang PSU ay nagko-convert ng minimum 80% ng AC input power papuntang DC output (sa 20%, 50%, at 100% load), na nagpapababa ng wasted heat",
      "Certification na ang PSU ay may 80 degree Celsius na maximum operating temperature",
      "Certification para sa 80-pin power connector ng PSU"
    ],
    correctIndex: 1,
    explanation: "Ang 80 PLUS certification (ng Ecos Consulting) ay nagpapatunay ng PSU energy efficiency. Tiers: 80 PLUS (80% eff.), Bronze (82%), Silver (85%), Gold (87%), Platinum (90%), Titanium (92%). Ang efficiency ay nasusukat sa 20%, 50%, at 100% load. Mas mataas ang efficiency = mas kaunting wasted heat = mas mababang electricity bill at mas malamig na operating temperature. Halimbawa: ang isang 80% efficient 500W PSU ay kumukuha ng ~625W mula sa outlet habang nagde-deliver ng 500W sa components."
  }
]
