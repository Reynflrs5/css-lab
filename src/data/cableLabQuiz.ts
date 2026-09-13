import { type QuizQuestion } from './hardwareQuiz'
export { type QuizQuestion }

export const cableLabQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Sa T568B wiring standard, ano ang tamang pin order ng mga wire colors?",
    choices: [
      "White-Green, Green, White-Orange, Blue, White-Blue, Orange, White-Brown, Brown",
      "White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown",
      "White-Blue, Blue, White-Orange, Orange, White-Green, Green, White-Brown, Brown",
      "White-Brown, Brown, White-Orange, Orange, White-Blue, Blue, White-Green, Green"
    ],
    correctIndex: 1,
    explanation: "Ang T568B standard (pinakakaraniwang gamit sa US at Pilipinas): Pin 1-White/Orange, Pin 2-Orange, Pin 3-White/Green, Pin 4-Blue, Pin 5-White/Blue, Pin 6-Green, Pin 7-White/Brown, Pin 8-Brown. Ito ang pinakakaraniwang ginagamit sa enterprise at residential installations."
  },
  {
    id: 2,
    question: "Ano ang pagkakaiba ng Straight-Through cable at Crossover cable?",
    choices: [
      "Parehong may T568A sa dalawang dulo",
      "Ang Straight-Through ay may T568A sa isang dulo at T568B sa kabilang dulo; ang Crossover ay may T568B sa dalawang dulo",
      "Ang Straight-Through ay may parehong standard sa dalawang dulo; ang Crossover ay may T568A sa isang dulo at T568B sa kabilang dulo",
      "Walang pagkakaiba, parehong uri ay pwedeng gamitin sa lahat ng koneksyon"
    ],
    correctIndex: 2,
    explanation: "Ang Straight-Through cable ay may parehong wiring standard (T568A-T568A o T568B-T568B) sa dalawang dulo. Ginagamit para sa iba't ibang klase ng devices (PC to Switch, Router to Switch). Ang Crossover cable ay may T568A sa isang dulo at T568B sa kabilang dulo — ginagamit para sa parehong klase ng devices (PC to PC, Switch to Switch)."
  },
  {
    id: 3,
    question: "Ano ang tawag sa proseso ng pag-terminate ng network cable sa isang RJ45 connector gamit ang crimping tool?",
    choices: [
      "Punchdown",
      "Splicing",
      "Crimping",
      "Termination"
    ],
    correctIndex: 2,
    explanation: "Ang Crimping ay ang proseso ng pag-attach ng RJ45 connector sa dulo ng twisted pair cable gamit ang crimping tool. Ang crimping tool ay nagsu-squeeze sa copper contacts ng RJ45 connector pababa sa mga individual na wire conductors para makagawa ng mabuting electrical connection."
  },
  {
    id: 4,
    question: "Para saan ginagamit ang 110 Punchdown tool?",
    choices: [
      "Para mag-crimp ng RJ45 connector",
      "Para mag-strip ng insulation mula sa outer jacket ng cable",
      "Para mag-terminate ng individual wires sa 110-type patch panel o keystone jack",
      "Para mag-test ng continuity ng finished cable"
    ],
    correctIndex: 2,
    explanation: "Ang 110 Punchdown tool ay ginagamit para mag-terminate ng individual wires sa 110-type connecting blocks na makikita sa patch panels, keystone jacks, at wall outlets. Tinutulak nito ang wire papasok sa IDC (Insulation Displacement Contact) slot at sabay na pumuputol ng sobrang wire — isang hakbang lang para sa dalawang gawain."
  },
  {
    id: 5,
    question: "Sa T568A wiring standard, ano ang wire color sa Pin 1?",
    choices: [
      "White/Orange",
      "White/Green",
      "White/Blue",
      "Orange"
    ],
    correctIndex: 1,
    explanation: "Sa T568A standard: Pin 1-White/Green, Pin 2-Green, Pin 3-White/Orange, Pin 4-Blue, Pin 5-White/Blue, Pin 6-Orange, Pin 7-White/Brown, Pin 8-Brown. Pansinin na ang pagkakaiba ng T568A at T568B: ang Orange at Green pairs ay napalitan ang posisyon."
  },
  {
    id: 6,
    question: "Anong uri ng cable ang dapat gamitin para ikonekta ang isang PC nang direkta sa isa pang PC (walang switch)?",
    choices: [
      "Straight-Through Cable (T568B-T568B)",
      "Crossover Cable (T568A-T568B)",
      "Rollover Cable",
      "Coaxial Cable"
    ],
    correctIndex: 1,
    explanation: "Para direktang ikonekta ang dalawang magkaparehong klase ng device (PC to PC, Switch to Switch, Router to Router), kailangan ng Crossover Cable. Ang Crossover cable ay nagpapalit (crosses over) ng Transmit pins papuntang Receive pins ng kabilang dulo. Ngayon, maraming modern NICs ay may Auto-MDI/MDI-X capability na awtomatikong nag-a-adjust, ngunit sa formal na testing (tulad ng TESDA), ang Crossover cable pa rin ang tinanong."
  },
  {
    id: 7,
    question: "Ano ang maximum na haba ng UTP cable run para sa standard Ethernet (100BASE-TX o 1000BASE-T) bago mag-degrade ang signal?",
    choices: [
      "50 meters",
      "75 meters",
      "100 meters",
      "150 meters"
    ],
    correctIndex: 2,
    explanation: "Ayon sa TIA/EIA-568 standard, ang maximum horizontal cable run (mula sa patch panel hanggang sa wall outlet) ay 90 meters, at kasama ang mga patch cables, ang buong channel ay dapat hindi lalampas sa 100 meters para sa 100BASE-TX at 1000BASE-T Ethernet. Ito ay upang mapanatili ang signal integrity at maiwasan ang excessive attenuation."
  },
  {
    id: 8,
    question: "Kapag nag-crimp ng RJ45, anong mahalagang hakbang ang dapat gawin BAGO ilagay ang connector?",
    choices: [
      "Ilagay agad ang mga wire sa RJ45 connector",
      "I-strip ang outer jacket ng cable, mag-untwist at mag-arrange ng mga wire sa tamang kulay-ayon sa standard",
      "Gumamit ng punchdown tool para i-terminate ang mga wire",
      "I-test muna ng continuity bago mag-crimp"
    ],
    correctIndex: 1,
    explanation: "Ang tamang crimping procedure: (1) I-strip ang outer jacket ng 1-1.5 inches gamit ang cable stripper. (2) Mag-untwist at mag-arrange ng 8 wires sa tamang kulay-order ayon sa T568A o T568B standard. (3) I-trim ang mga wire ng pantay sa 0.5 inches mula sa jacket. (4) Ipasok ang mga wire sa RJ45 connector (siguraduhing dumarating lahat sa dulo ng connector). (5) I-crimp gamit ang crimping tool. (6) I-test gamit ang cable tester."
  },
  {
    id: 9,
    question: "Alin sa mga sumusunod ang HINDI isang dahilan ng cable failure pagkatapos ng crimping?",
    choices: [
      "Hindi pantay ang haba ng mga wire na ipinasok sa RJ45 connector",
      "Mali ang pagkakasunod-sunod ng wire colors",
      "Masyadong matagal bago gamitin ang cable pagkatapos ng crimping",
      "Hindi bumalik ang lock tab ng RJ45 connector"
    ],
    correctIndex: 2,
    explanation: "Ang oras o tagal bago gamitin ang cable ay HINDI nakakaapekto sa cable performance. Ang mga karaniwang dahilan ng cable failure: (1) Mali ang pin order ng wire colors. (2) Hindi dumarating ang ilang wire sa dulo ng RJ45 (open circuit). (3) Crossed wires (short circuit). (4) Hindi nabunot ang cable jacket sa loob ng connector strain relief. (5) Sira o hindi nakapaglock ang RJ45 boot."
  },
  {
    id: 10,
    question: "Ano ang sinusubok ng cable continuity tester?",
    choices: [
      "Sinusubok nito ang bandwidth ng cable",
      "Sinusubok nito kung ang bawat pin (1-8) sa isang dulo ay konektado sa tamang katumbas na pin sa kabilang dulo",
      "Sinusubok nito ang resistance ng cable jacket",
      "Sinusubok nito kung Cat5e o Cat6 ang cable"
    ],
    correctIndex: 1,
    explanation: "Ang basic cable continuity tester (LED sequencer type) ay nagpapatunay na ang bawat isa sa 8 pins sa isang dulo ay konektado sa wastong pin sa kabilang dulo — tinutukoy ang mga open circuits (disconnected wire) at shorts (dalawang wire na nakakonekta sa iisa). Ang advanced cable testers (tulad ng Fluke) ay kayang subukin pa ang bandwidth, crosstalk (NEXT/FEXT), at cable impedance."
  }
]
