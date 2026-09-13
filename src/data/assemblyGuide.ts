export interface GuideStep {
  title: string
  detail: string
  partId?: string
}

export const assemblySteps: GuideStep[] = [
  { 
    title: 'ESD Precautions & Prep', 
    detail: 'Ground yourself using an anti-static wrist strap attached to unpainted case chassis. Clear non-conductive, flat workspace.',
    partId: 'chassis'
  },
  { 
    title: 'Install CPU in Socket', 
    detail: 'Align CPU corner golden triangle with socket pin-1 indicator. For LGA: release retention arm, insert without force, lower clamp. For PGA: drop into ZIF socket and lock lever.',
    partId: 'cpu'
  },
  { 
    title: 'Apply Thermal Compound', 
    detail: 'Apply a pea-sized dot (~0.1 g) of thermal compound at the center of the CPU integrated heat spreader (IHS).',
    partId: 'cpu'
  },
  { 
    title: 'Mount CPU Cooler', 
    detail: 'Align cooler bracket diagonally over retention holes. Tighten screws in an X-pattern to ensure even thermal paste spread. Connect 4-pin PWM cable to CPU_FAN.',
    partId: 'cooling'
  },
  { 
    title: 'Install Memory Modules (RAM)', 
    detail: 'Open DIMM latches. Match notch key with slot ridge. Press down firmly on both ends until both latches click into place. Use slots A2 and B2 for dual-channel.',
    partId: 'ram'
  },
  { 
    title: 'Install I/O Shield & Motherboard', 
    detail: 'Snap I/O shield firmly into case rear cutout. Verify motherboard standoff placement matches board holes. Lower board gently and secure with standard screws.',
    partId: 'motherboard'
  },
  { 
    title: 'Mount Power Supply Unit (PSU)', 
    detail: 'Slide PSU into lower mounting compartment with fan oriented toward dust filter vent. Fasten with 4 hex screws. Route 24-pin ATX, 8-pin EPS, and PCIe lines.',
    partId: 'psu'
  },
  { 
    title: 'Install Storage Drives', 
    detail: 'Insert M.2 NVMe SSD at a 30-degree angle into M.2 socket, push flat, and secure with M.2 retention screw or toolless latch. Connect SATA drives if present.',
    partId: 'storage'
  },
  { 
    title: 'Install Graphics Card (GPU)', 
    detail: 'Remove corresponding rear PCIe expansion covers. Insert GPU into top PCIe x16 slot until safety retention lock snaps. Secure bracket screws and plug in PCIe power cables.',
    partId: 'gpu'
  },
  { 
    title: 'Connect Headers & Initial POST Test', 
    detail: 'Connect front panel pins (PWR_SW, RESET_SW, HDD_LED, POWER_LED), USB 3.0, and HD Audio headers. Connect display to GPU output and perform initial diagnostic POST.',
    partId: 'fpanel'
  },
]

export const disassemblySteps: GuideStep[] = [
  { 
    title: 'Power Down & Discharge Residual Charge', 
    detail: 'Perform OS shutdown. Toggle PSU rocker switch to 0 (OFF). Disconnect AC power cord from wall. Press chassis power button for 5 seconds to discharge PSU capacitors.',
    partId: 'psu'
  },
  { 
    title: 'Open Case Side Panels', 
    detail: 'Unscrew rear thumbscrews and remove tempered glass or side aluminum panels. Store glass safely on a padded surface.',
    partId: 'chassis'
  },
  { 
    title: 'Disconnect Internal Wiring Harness', 
    detail: 'Unhook 24-pin ATX power connector by depressing its safety latch. Disconnect 8-pin CPU EPS, PCIe GPU power, SATA cables, and front panel pin headers.',
    partId: 'motherboard'
  },
  { 
    title: 'Remove GPU (Graphics Card)', 
    detail: 'Unscrew PCIe slot bracket thumbscrews. Depress the PCIe slot locking tab with your finger and lift graphics card straight up.',
    partId: 'gpu'
  },
  { 
    title: 'Remove M.2 SSDs & Storage', 
    detail: 'Unscrew M.2 heatsink and drive mounting screw. Gently slide M.2 SSD out at a 30-degree angle. Disconnect and remove 2.5-inch SATA drives.',
    partId: 'storage'
  },
  { 
    title: 'Remove CPU Cooler & Processor', 
    detail: 'Loosen cooler screws gradually in diagonal sequence. Twist cooler gently to break thermal paste suction before lifting. Release CPU socket latch and lift processor by edges.',
    partId: 'cooling'
  },
  { 
    title: 'Remove RAM DIMM Modules', 
    detail: 'Press DIMM retention latches outward. The RAM module will elevate slightly. Pull straight out by the upper PCB corners.',
    partId: 'ram'
  },
  { 
    title: 'Unfasten & Remove Motherboard', 
    detail: 'Remove all mounting screws from brass standoffs. Carefully lift motherboard out of chassis, taking care not to scrape against rear I/O shield.',
    partId: 'motherboard'
  },
]
