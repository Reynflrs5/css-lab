import { type QuizQuestion } from './hardwareQuiz'

export const historyQuiz: QuizQuestion[] = [
  {
    id: 'h1',
    question: 'Ano ang unang henerasyon ng mga computer at ano ang pangunahing component na ginamit dito?',
    choices: [
      'First Generation - Transistors',
      'First Generation - Vacuum Tubes',
      'First Generation - Microprocessors',
      'First Generation - Integrated Circuits'
    ],
    correctIndex: 1,
    explanation: 'Ang First Generation ng computers (1940-1956) ay gumamit ng Vacuum Tubes para sa circuitry at magnetic drums para sa memory.'
  },
  {
    id: 'h2',
    question: 'Sino ang kinikilala bilang "Father of the Computer"?',
    choices: [
      'Alan Turing',
      'Bill Gates',
      'Charles Babbage',
      'Steve Jobs'
    ],
    correctIndex: 2,
    explanation: 'Si Charles Babbage ay isang English polymath na nag-imbento ng unang mechanical computer na tinawag na Analytical Engine.'
  },
  {
    id: 'h3',
    question: 'Ano ang ibig sabihin ng OHS sa konteksto ng pag-aayos ng computer?',
    choices: [
      'Occupational Health and Safety',
      'Operational Hardware System',
      'Office Hardware Service',
      'Organized Help System'
    ],
    correctIndex: 0,
    explanation: 'Ang OHS (Occupational Health and Safety) ay mga panuntunan para masigurong ligtas ang technician at ang kagamitan habang nagtatrabaho.'
  },
  {
    id: 'h4',
    question: 'Alin sa mga sumusunod ang unang malawakang network na naging basehan ng modernong Internet?',
    choices: [
      'Ethernet',
      'Intranet',
      'NSFNET',
      'ARPANET'
    ],
    correctIndex: 3,
    explanation: 'Ang ARPANET (Advanced Research Projects Agency Network) na pinondohan ng U.S. Department of Defense ang naging precursor ng Internet.'
  },
  {
    id: 'h5',
    question: 'Ano ang pinakamagandang gawin para maiwasan ang ESD (Electrostatic Discharge) kapag humahawak ng computer parts?',
    choices: [
      'Magsuot ng rubber gloves',
      'Gumamit ng Anti-static wrist strap',
      'Gumamit ng magnet para tanggalin ang kuryente',
      'Basain ang kamay bago humawak'
    ],
    correctIndex: 1,
    explanation: 'Ang Anti-static wrist strap ay pumuprotekta sa mga sensitive electronic components mula sa static electricity ng iyong katawan.'
  },
  {
    id: 'h6',
    question: 'Sa anong henerasyon ng computer naimbento at unang ginamit ang Transistors?',
    choices: [
      'First Generation',
      'Second Generation',
      'Third Generation',
      'Fourth Generation'
    ],
    correctIndex: 1,
    explanation: 'Ang Second Generation (1956-1963) ay gumamit ng mga Transistors na mas maliit, mabilis, at mas matipid sa kuryente kaysa sa vacuum tubes.'
  },
  {
    id: 'h7',
    question: 'Ano ang isa sa mga pangunahing batas o konsepto sa 5S methodology?',
    choices: [
      'Sort (Seiri)',
      'Sleep (Suimin)',
      'Scream (Sakebu)',
      'Stand (Tatsu)'
    ],
    correctIndex: 0,
    explanation: 'Ang 5S ay Sort (Seiri), Set in order (Seiton), Shine (Seiso), Standardize (Seiketsu), at Sustain (Shitsuke).'
  },
  {
    id: 'h8',
    question: 'Sino ang itinuturing na unang computer programmer sa kasaysayan?',
    choices: [
      'Grace Hopper',
      'Ada Lovelace',
      'Margaret Hamilton',
      'Alan Turing'
    ],
    correctIndex: 1,
    explanation: 'Si Ada Lovelace ay gumawa ng unang algorithm na idinisenyo para i-process ng machine ni Charles Babbage, kaya siya ang unang programmer.'
  },
  {
    id: 'h9',
    question: 'Ano ang pangunahing pagkakaiba ng Data at Information?',
    choices: [
      'Pareho lang sila',
      'Ang Data ay processed na, ang Information ay raw facts',
      'Ang Data ay raw facts at figures, ang Information ay processed data na may kahulugan',
      'Ang Data ay hardware, ang Information ay software'
    ],
    correctIndex: 2,
    explanation: 'Data ang tawag sa raw input. Kapag ito ay prinoseso, inayos, at binigyan ng kahulugan, nagiging Information ito.'
  },
  {
    id: 'h10',
    question: 'Bakit mahalaga ang pagsusuot ng PPE (Personal Protective Equipment) gaya ng safety goggles at sapatos sa computer servicing?',
    choices: [
      'Para mas maging mukhang propesyonal',
      'Para maprotektahan ang sarili mula sa mga hazard tulad ng alikabok, sharp edges, at nahuhulog na gamit',
      'Para tumaas ang presyo ng singil sa kliyente',
      'Dahil required ito ng DTI'
    ],
    correctIndex: 1,
    explanation: 'Ang PPE ay kinakailangan para sa kaligtasan ng technician laban sa anumang physical hazards habang nag-aayos ng computer.'
  }
]
