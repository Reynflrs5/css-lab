export interface WireColor {
  id: string
  name: string
  shortName: string
  primaryColor: string
  stripeColor?: string
  textColor: string
}

export const WIRE_COLORS: WireColor[] = [
  { id: 'wo', name: 'White / Orange', shortName: 'W-OR', primaryColor: '#ffffff', stripeColor: '#f97316', textColor: '#c2410c' },
  { id: 'o',  name: 'Solid Orange',    shortName: 'OR',   primaryColor: '#ea580c', stripeColor: undefined, textColor: '#ffffff' },
  { id: 'wg', name: 'White / Green',  shortName: 'W-GR', primaryColor: '#ffffff', stripeColor: '#22c55e', textColor: '#15803d' },
  { id: 'bl', name: 'Solid Blue',     shortName: 'BL',   primaryColor: '#2563eb', stripeColor: undefined, textColor: '#ffffff' },
  { id: 'wb', name: 'White / Blue',   shortName: 'W-BL', primaryColor: '#ffffff', stripeColor: '#3b82f6', textColor: '#1d4ed8' },
  { id: 'g',  name: 'Solid Green',    shortName: 'GR',   primaryColor: '#16a34a', stripeColor: undefined, textColor: '#ffffff' },
  { id: 'wbr',name: 'White / Brown',  shortName: 'W-BR', primaryColor: '#ffffff', stripeColor: '#92400e', textColor: '#78350f' },
  { id: 'br', name: 'Solid Brown',    shortName: 'BR',   primaryColor: '#78350f', stripeColor: undefined, textColor: '#ffffff' },
]

export const T568B_PINOUT = ['wo', 'o', 'wg', 'bl', 'wb', 'g', 'wbr', 'br']
export const T568A_PINOUT = ['wg', 'g', 'wo', 'bl', 'wb', 'o', 'wbr', 'br']

export interface PinFunction {
  pin: number
  role100BaseT: string
  role1000BaseT: string
  description: string
  isPoE: boolean
}

export const PIN_FUNCTIONS: PinFunction[] = [
  { pin: 1, role100BaseT: 'TX+ (Transmit +)', role1000BaseT: 'BI_DA+ (Bi-directional A+)', description: 'Transmits data in 10/100 Mbps; Pair 2 or 3', isPoE: true },
  { pin: 2, role100BaseT: 'TX- (Transmit -)', role1000BaseT: 'BI_DA- (Bi-directional A-)', description: 'Transmits data in 10/100 Mbps; Pair 2 or 3', isPoE: true },
  { pin: 3, role100BaseT: 'RX+ (Receive +)',  role1000BaseT: 'BI_DB+ (Bi-directional B+)', description: 'Receives data in 10/100 Mbps; Pair 3 or 2', isPoE: true },
  { pin: 4, role100BaseT: 'Unused / PoE',     role1000BaseT: 'BI_DC+ (Bi-directional C+)', description: 'Carries DC power in PoE Mode B; 1Gbps data Pair 1', isPoE: true },
  { pin: 5, role100BaseT: 'Unused / PoE',     role1000BaseT: 'BI_DC- (Bi-directional C-)', description: 'Carries DC power in PoE Mode B; 1Gbps data Pair 1', isPoE: true },
  { pin: 6, role100BaseT: 'RX- (Receive -)',  role1000BaseT: 'BI_DB- (Bi-directional B-)', description: 'Receives data in 10/100 Mbps; Pair 3 or 2', isPoE: true },
  { pin: 7, role100BaseT: 'Unused / PoE',     role1000BaseT: 'BI_DD+ (Bi-directional D+)', description: 'Carries DC ground in PoE Mode B; 1Gbps data Pair 4', isPoE: true },
  { pin: 8, role100BaseT: 'Unused / PoE',     role1000BaseT: 'BI_DD- (Bi-directional D-)', description: 'Carries DC ground in PoE Mode B; 1Gbps data Pair 4', isPoE: true },
]

export interface CableStandardGuide {
  id: string
  title: string
  endA: string
  endB: string
  useCases: string[]
  examNote: string
}

export const CABLE_STANDARDS: CableStandardGuide[] = [
  {
    id: 'straight-through',
    title: 'Straight-Through Cable',
    endA: 'T-568B',
    endB: 'T-568B',
    useCases: [
      'PC to Switch or Hub',
      'Router to Switch or Hub',
      'Server to Switch',
      'Wireless AP to Switch',
    ],
    examNote: 'Connects DISSIMILAR (unlike) devices. Standard default cable used in over 95% of modern structured cabling.',
  },
  {
    id: 'crossover',
    title: 'Crossover Cable',
    endA: 'T-568A',
    endB: 'T-568B',
    useCases: [
      'PC to PC directly (direct file transfer)',
      'Switch to Switch (legacy without Auto-MDIX)',
      'Router to Router / Router to PC',
      'Hub to Hub / Switch to Hub',
    ],
    examNote: 'Connects SIMILAR (like) devices. Swaps Transmit (TX) and Receive (RX) pairs so one device transmits directly into the other’s receiver.',
  },
  {
    id: 'rollover',
    title: 'Rollover / Console Cable',
    endA: 'T-568B (1 to 8)',
    endB: 'Reversed (8 to 1)',
    useCases: [
      'PC COM / USB serial port to Cisco Router/Switch CONSOLE port',
      'Initial headless hardware out-of-band management',
    ],
    examNote: 'Not used for Ethernet data transfer; exclusively used for terminal console configuration.',
  },
]

export interface CrimpingStep {
  step: number
  title: string
  action: string
  keyTip: string
  warning?: string
}

export const CRIMPING_PROCEDURE: CrimpingStep[] = [
  {
    step: 1,
    title: 'Strip Outer Sheath',
    action: 'Score and remove approximately 1 to 1.5 inches (25–38 mm) of the external PVC cable jacket using the stripper blade on your crimping tool.',
    keyTip: 'Rotate the stripper gently 360 degrees. Do not press too hard or you will score the individual wire insulators.',
    warning: 'Nicked conductor insulation will cause shorts or high-frequency crosstalk failure.'
  },
  {
    step: 2,
    title: 'Untwist Pairs & Straighten',
    action: 'Separate the 4 twisted pairs (Orange, Green, Blue, Brown) and untwist them down to the edge of the jacket.',
    keyTip: 'Use your thumb and the edge of a screwdriver shaft or your fingers to pull and straighten each wire so they lie completely flat and smooth.',
  },
  {
    step: 3,
    title: 'Order Wires to Standard',
    action: 'Align the 8 wires side-by-side in exact standard order (typically T-568B: W-OR, OR, W-GR, BL, W-BL, GR, W-BR, BR).',
    keyTip: 'Hold the wires firmly between your thumb and forefinger and wiggle them gently back and forth to keep them in a flat, tight ribbon.',
  },
  {
    step: 4,
    title: 'Cut Flush Across Tips',
    action: 'Use the cutting blade of your crimping tool or flush cutters to trim the aligned wires in a single, straight 90-degree cut, leaving ~0.5 inches (12.7 mm) exposed from the jacket.',
    keyTip: 'All 8 conductors must be exactly the same length so every copper tip hits the back of the RJ45 pins simultaneously.',
  },
  {
    step: 5,
    title: 'Insert Into RJ45 Connector',
    action: 'Hold the RJ45 modular plug with the gold contact pins facing UP (plastic locking clip facing DOWN). Slide the wire ribbon smoothly into the guide tracks.',
    keyTip: 'Make sure Pin 1 (White-Orange for T568B) is on the far left. Push firmly until all 8 copper tips are visibly pressed against the clear front wall of the plug.',
    warning: 'The outer cable jacket MUST extend at least 6mm inside the plug past the retention wedge so the wedge clamps the jacket, not the bare wires.'
  },
  {
    step: 6,
    title: 'Visual Inspection Before Crimping',
    action: 'Look through the transparent sides and front of the RJ45 plug. Verify all 8 copper wire tips are visible and wire colors did not jump slots.',
    keyTip: 'Inspect both the top (color sequence) and the front edge (conductor tips flush under gold teeth).',
  },
  {
    step: 7,
    title: 'Crimp with Modular Crimper',
    action: 'Insert the assembled plug into the 8P (8-position) chamber of the crimping tool. Squeeze the handles firmly until the ratchet mechanism releases.',
    keyTip: 'The tool drives the 8 gold-plated pins into the wires (piercing the insulation) while simultaneously locking the strain-relief wedge over the jacket.',
  },
  {
    step: 8,
    title: 'LAN Continuity Testing',
    action: 'Connect End A into the Master LAN Cable Tester and End B into the Remote unit. Turn on the power switch and observe the 1–8 LED sequence.',
    keyTip: 'For a straight-through cable, LEDs 1 through 8 must light up simultaneously and sequentially on both units (1-1, 2-2, 3-3, 4-4, 5-5, 6-6, 7-7, 8-8).',
  },
]

export interface FaultType {
  name: string
  testerPattern: string
  cause: string
  fix: string
}

export const FAULT_TYPES: FaultType[] = [
  {
    name: 'Open Circuit (Unlit LED)',
    testerPattern: 'One or more LEDs on the Remote unit do not illuminate during the sweep.',
    cause: 'Wire was cut too short, failed to reach the end of the RJ45 channel, or the crimper pin did not pierce the insulation.',
    fix: 'Cut off the RJ45 plug, re-strip carefully, ensure all wires hit the front face, and re-crimp.'
  },
  {
    name: 'Reversed Pair / Miswire',
    testerPattern: 'LED sequence jumps out of order (e.g. Master: 1-2-3-4-5-6-7-8; Remote: 1-2-6-4-5-3-7-8).',
    cause: 'Wires were placed into incorrect pin slots before crimping (e.g., swapping Green and Green-White).',
    fix: 'Inspect both ends with magnifying glass. Cut off the miswired end and re-align in exact T-568B order.'
  },
  {
    name: 'Short Circuit',
    testerPattern: 'Multiple LEDs light up simultaneously on the Remote unit during a single pin sweep.',
    cause: 'Conductor insulation was nicked during stripping, causing bare copper wires to touch inside the jacket or plug.',
    fix: 'Strip cable gently without ringing the blade too deep. Replace the plug.'
  },
  {
    name: 'Split Pair',
    testerPattern: 'Standard cheap continuity tester shows 1-to-1 pass, but network speed is capped or drops packets under load.',
    cause: 'Wires from different physical twisted pairs are combined on a single transmission circuit (e.g., mixing blue and green pairs). Destroys EMI cancellation.',
    fix: 'Follow color code strictly; do not just match arbitrary pins by color.'
  }
]
