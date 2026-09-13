export interface QuizQuestion {
  id: number
  question: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export const hardwareQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Alin sa mga sumusunod ang UNANG dapat gawin bago magsimula ng pag-disassemble ng isang desktop PC?",
    choices: [
      "Alisin agad ang CPU cooler",
      "I-off ang computer at i-unplug ang power cord mula sa outlet",
      "Buksan ang side panel ng casing",
      "Tanggalin ang RAM modules"
    ],
    correctIndex: 1,
    explanation: "Ayon sa TESDA CSS NC II at ESD Safety Standards, laging kailangang i-power off at i-disconnect ang lahat ng power sources bago hawakan ang anumang internal na bahagi ng PC para maiwasan ang electrical shock at pinsala sa mga komponente."
  },
  {
    id: 2,
    question: "Ano ang pangunahing layunin ng ESD (Electrostatic Discharge) wrist strap habang nagtatrabaho sa loob ng PC?",
    choices: [
      "Para masubaybayan ang iyong heart rate",
      "Para maprotektahan ang mga PC components mula sa static electricity mula sa iyong katawan",
      "Para maiwasang madulas ang iyong kamay",
      "Para makilala ka bilang isang certified technician"
    ],
    correctIndex: 1,
    explanation: "Ang ESD wrist strap ay nagko-connect sa iyong pulso papunta sa isang grounded na ibabaw. Ito ay nagbibigay ng landas para sa static electricity sa iyong katawan para madischarge nang ligtas at hindi mapinsala ang mga sensitibong semiconductor components."
  },
  {
    id: 3,
    question: "Sa tamang pagkakasunod-sunod ng pag-assemble ng PC, kailan dapat i-install ang CPU?",
    choices: [
      "Huling-huli, pagkatapos ng lahat ng components",
      "Bago i-install ang Power Supply Unit (PSU)",
      "Pagkatapos i-mount ang motherboard sa loob ng casing",
      "Bago i-install ang motherboard sa loob ng casing, habang nasa labas pa ito"
    ],
    correctIndex: 3,
    explanation: "Ang pinakamabuting practice ay i-install muna ang CPU, CPU Cooler, at RAM sa motherboard habang nasa malapad at maliwanag na ibabaw pa ito. Mas madaling i-access ang mga socket at mas mababa ang panganib na makasira sa motherboard."
  },
  {
    id: 4,
    question: "Alin sa mga sumusunod ang TAMA na paraan ng paghawak sa isang motherboard?",
    choices: [
      "Hawakan sa gitna para sa mas matibay na grip",
      "Hawakan sa mga edges (gilid) at iwasan ang direktang paghawak sa mga circuit traces at chips",
      "Mahawakan ang mga PCIe slots para masiguro na malinis ito",
      "Maaari itong hawakan kahit saan basta naka-suot ang gloves"
    ],
    correctIndex: 1,
    explanation: "Ang motherboard ay naglalaman ng napakaraming sensitibong circuit traces, capacitors, at chips. Palaging hawakan ito sa mga gilid (edges) para maiwasan ang direktang ESD contact sa mga bahagi nito."
  },
  {
    id: 5,
    question: "Ano ang tamang mounting procedure para sa CPU cooler screws?",
    choices: [
      "I-tighten ng sabay-sabay ang lahat ng screws mula kaliwa papunta kanan",
      "I-tighten ang mga screws sa diagonal na pattern (cross-pattern) para maging pantay ang pressure",
      "I-tighten muna ang isang screw ng buo bago pumunta sa susunod",
      "Kahit aling order ay okay basta ma-secure ang cooler"
    ],
    correctIndex: 1,
    explanation: "Ang cross-pattern (diagonal) na tightening ay standard na practice para sa lahat ng heatsink at cooler installations. Ito ay tinitiyak na ang thermal paste ay pantay na naipapamigay at ang pressure ay uniform sa buong CPU die."
  },
  {
    id: 6,
    question: "Aling connector ang ginagamit para sa pangunahing power ng motherboard mula sa PSU?",
    choices: [
      "4-pin Molex connector",
      "6-pin PCIe power connector",
      "24-pin ATX main power connector",
      "SATA power connector"
    ],
    correctIndex: 2,
    explanation: "Ang 24-pin ATX connector ang pangunahing power connector ng motherboard. Nagbibigay ito ng +3.3V, +5V, at +12V na supply sa lahat ng subsystems ng motherboard."
  },
  {
    id: 7,
    question: "Para sa dual-channel RAM configuration, saan dapat ilagay ang dalawang RAM sticks?",
    choices: [
      "Sa magkasamang magkadikit na slots (e.g., Slot 1 at Slot 2)",
      "Sa alternating na slots na parehong kulay ayon sa manual (e.g., Slot A2 at B2)",
      "Kahit saan, wala itong pakialam sa performance",
      "Sa pinakamalayo at pinakamalapit na slot sa CPU"
    ],
    correctIndex: 1,
    explanation: "Para maging aktibo ang dual-channel mode, kailangang ilagay ang dalawang RAM sticks sa magkatugmang slot pairs. Karamihan sa mga motherboard manual ay nagtuturo na gamitin ang Slot A2 at B2 para sa dual-channel configuration."
  },
  {
    id: 8,
    question: "Pagkatapos makumpleto ang pag-assemble ng PC, ano ang UNANG dapat gawin bago i-on?",
    choices: [
      "I-install agad ang Operating System",
      "I-connect muna ang monitor at keyboard",
      "Suriin nang muli ang lahat ng power connectors, data cables, at siguraduhing walang floating screws sa loob ng casing",
      "I-set up agad ang BIOS settings"
    ],
    correctIndex: 2,
    explanation: "Bago i-power on ang bagong assembled na PC, mandatory ang visual inspection: suriin ang lahat ng power connectors, data cables, at siguraduhing walang naiwan na screwdriver o metallic object sa loob ng case. Ito ay isang safety step na iniaatas ng TESDA CSS NC II protokol."
  },
  {
    id: 9,
    question: "Ano ang tawag sa phenomenon na maaaring mangyari kapag ang isang static-charged na technician ay humawak sa mga PC components nang walang proper grounding?",
    choices: [
      "Thermal Throttling",
      "Electrostatic Discharge (ESD)",
      "Electromagnetic Interference (EMI)",
      "Power Surge"
    ],
    correctIndex: 1,
    explanation: "Ang Electrostatic Discharge (ESD) ay ang biglang agos ng kuryente sa pagitan ng dalawang bagay na may magkaibang electric charge. Ang katawan ng tao ay maaaring magdala ng hanggang 35,000 volts ng static electricity na sapat para permanenteng mapinsala ang mga semiconductor components."
  },
  {
    id: 10,
    question: "Ano ang dapat gawin sa lumang thermal paste sa CPU bago mag-install ng bagong cooler?",
    choices: [
      "Hayaan na lang ito at lagyan ng bagong thermal paste sa ibabaw",
      "Linisin ito gamit ang isang tuyong tela",
      "Tanggalin nang lubusan gamit ang isopropyl alcohol at lint-free cloth, tapos mag-apply ng bagong thermal paste",
      "Gamitin ang toothpaste bilang kapalit"
    ],
    correctIndex: 2,
    explanation: "Ang tamang proseso: (1) Alisin ang cooler, (2) Punasan ang lumang thermal paste gamit ang isopropyl alcohol at lint-free cloth sa parehong CPU die at cooler base, (3) Mag-apply ng maliit na halaga (rice-grain size) ng bagong thermal paste sa gitna ng CPU die."
  }
]
