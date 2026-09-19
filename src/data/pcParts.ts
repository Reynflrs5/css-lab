export interface PcPart {
  id: string
  name: string
  shortName: string
  category: 'Processing' | 'Memory' | 'Graphics' | 'Power' | 'Storage' | 'Thermal' | 'Interconnect' | 'Enclosure'
  powerDraw: string
  temperature: string
  body: string
  specs: { label: string; value: string }[]
  installGuide: string[]
  troubleshootingTips: string[]
  systemType?: 'pc' | 'server' | 'laptop' | 'networking' | 'both'
}

export const pcParts: PcPart[] = [
  {
    id: 'chassis',
    name: 'Chassis — Computer Case & Front I/O',
    shortName: 'Case / Chassis',
    category: 'Enclosure',
    powerDraw: 'Passive / LED (~2W)',
    temperature: 'Ambient Case Temp',
    body: 'The protective structural enclosure that houses, grounds, and shields internal electronic components from physical impact and electromagnetic interference (EMI). Features front panel I/O ports, dedicated cable management channels, dust filters, and optimized positive/negative airflow intake paths.',
    systemType: 'pc',
    specs: [
      { label: 'Form Factor Class', value: 'Mid-Tower ATX (Supports ATX, mATX, Mini-ITX)' },
      { label: 'Construction Materials', value: '0.8mm SPCC Steel + Tempered Glass Side Panel' },
      { label: 'Front I/O Interface', value: '1 × USB-C 3.2 Gen 2, 2 × USB 3.0 Type-A, 3.5mm HD Audio' },
      { label: 'Drive Bays', value: '2 × 3.5" HDD cages, 2 × 2.5" SSD sleds' },
      { label: 'Fan Mount Capacities', value: '3 × 120mm front, 2 × 140mm top, 1 × 120mm rear' },
      { label: 'GPU Clearance', value: 'Up to 380mm length (with front fans installed)' },
    ],
    installGuide: [
      'Remove both side panels before assembly: store tempered glass flat on a padded surface away from ceramic tile floors.',
      'Check brass motherboard standoffs: install standoffs ONLY in positions matching your motherboard form factor screw holes.',
      'Route major power cables (24-pin ATX, 8-pin EPS) through rubber grommets before fastening the motherboard in place.',
    ],
    troubleshootingTips: [
      'Power button does nothing when pressed: inspect front-panel PWR_SW connector orientation and verify switch continuity with a multimeter.',
      'Front USB 3.0 ports intermittent: check the 19-pin blue USB header on the motherboard for bent internal pins.',
    ],
  },
  {
    id: 'motherboard',
    name: 'Motherboard — Main Printed Circuit Board',
    shortName: 'Motherboard',
    category: 'Interconnect',
    powerDraw: '25 – 70 W',
    temperature: '35 – 55 °C',
    body: 'The central nervous system and structural backbone of the computer. Houses the CPU socket, RAM slots, PCIe lanes, chipset, and power regulation VRMs (Voltage Regulator Modules). Connects every subsystem and routes power and high-speed data buses across multilayer copper traces.',
    systemType: 'pc',
    specs: [
      { label: 'Form Factor', value: 'ATX (305 × 244 mm), Micro-ATX, Mini-ITX' },
      { label: 'CPU Sockets', value: 'LGA1700 / LGA1851 (Intel), AM5 (AMD)' },
      { label: 'RAM Slots', value: '4 × DDR5 DIMM (Dual Channel, up to 192 GB)' },
      { label: 'Expansion Slots', value: '1 × PCIe 5.0 x16, 2 × PCIe 4.0 x4' },
      { label: 'Storage Interfaces', value: '4 × M.2 NVMe PCIe 4.0/5.0, 4 × SATA 6 Gb/s' },
      { label: 'Power Headers', value: '24-pin ATX Main, dual 8-pin EPS 12V' },
    ],
    installGuide: [
      'Install the metal I/O shield firmly into the rear chassis cutout before placing the board.',
      'Check chassis standoffs: match standoff positions strictly with motherboard screw holes to prevent rear electrical shorts.',
      'Fasten screws gently in an X-pattern without over-torquing to prevent cracking multilayer PCB traces.',
    ],
    troubleshootingTips: [
      'Inspect 2-digit 7-segment POST LED display or onboard debug LEDs (CPU/DRAM/VGA/BOOT) for boot stall stages.',
      'Clear CMOS jumper (CLRTC) or remove CR2032 coin battery for 5 minutes if UEFI BIOS settings prevent POST.',
    ],
  },
  {
    id: 'cpu',
    name: 'CPU — Central Processing Unit',
    shortName: 'CPU',
    category: 'Processing',
    powerDraw: '65 – 253 W TDP',
    temperature: '38 – 85 °C',
    body: 'The computational engine and primary processor. Coordinates calculations, branch predictions, logic operations, and microcode instructions. Modern architectures pair high-performance compute cores with power-efficient cores along with ultra-fast multi-megabyte L2/L3 cache blocks.',
    systemType: 'pc',
    specs: [
      { label: 'Architecture', value: 'Hybrid P-Core + E-Core (x86-64 / AMD64)' },
      { label: 'Cores / Threads', value: '16 Cores / 24 Threads (Typical Performance Build)' },
      { label: 'Base / Boost Clock', value: '3.4 GHz base / 5.6 GHz turbo boost' },
      { label: 'Smart Cache (L3)', value: '36 MB Shared L3 Cache' },
      { label: 'Instruction Sets', value: 'AVX-512, SSE4.2, Intel VT-x / AMD-V, AES-NI' },
      { label: 'Lithography', value: 'Intel 7 / TSMC 4nm process node' },
    ],
    installGuide: [
      'Lift socket load lever and metal load plate fully without touching fragile gold socket contact pins.',
      'Align the golden alignment triangle on the CPU corner precisely with the engraved marker on the socket.',
      'Drop CPU straight down without sliding or forcing, lower plate, and lock the lever back into the retention hook.',
    ],
    troubleshootingTips: [
      'Frequent thermal shutdown under load indicates missing/dry thermal paste or unpeeled protective plastic on cooler base.',
      'No POST with CPU debug LED solid: check for bent LGA socket pins or verify motherboard BIOS compatibility for newer CPU revisions.',
    ],
  },
  {
    id: 'cooling',
    name: 'Cooling — CPU Cooler & Airflow Array',
    shortName: 'CPU Cooler',
    category: 'Thermal',
    powerDraw: '3 – 15 W (Fans + Pump)',
    temperature: 'Ambient Dependent',
    body: 'Maintains semiconductor stability by absorbing intense heat flux from the CPU integrated heat spreader (IHS) through sintered copper heatpipes or liquid coolant loops into aluminum fin arrays cooled by high-static-pressure PWM fans.',
    systemType: 'pc',
    specs: [
      { label: 'Cooler Type', value: 'High-Density Dual-Tower Air Cooler / 280mm AIO' },
      { label: 'Heatpipes', value: '6 × 6mm sintered copper sintered heat pipes' },
      { label: 'Fan Dimensions', value: '2 × 120mm Fluid Dynamic Bearing (FDB)' },
      { label: 'Speed Range', value: '500 – 1850 RPM (PWM dynamic curve)' },
      { label: 'Airflow Rating', value: '67.8 CFM @ 28 dBA max acoustic level' },
      { label: 'Thermal Interface', value: 'Carbon-microparticle non-conductive paste (~8.5 W/m-K)' },
    ],
    installGuide: [
      'Ensure the factory plastic peel film is peeled off the copper baseplate before mounting.',
      'Apply a centered pea-sized dot (~0.15g) or thin cross pattern of non-conductive thermal paste on the IHS.',
      'Connect the 4-pin PWM tachometer connector to the dedicated CPU_FAN header (not SYS_FAN).',
    ],
    troubleshootingTips: [
      'Fan spinning at 100% full blast constantly: check UEFI/BIOS Hardware Monitor to verify PWM mode is selected instead of DC mode.',
      'Rapid CPU spike to 95°C+ within 10 seconds of boot: pump failure in AIO loop or cooler base is not making flush contact with CPU.',
    ],
  },
  {
    id: 'ram',
    name: 'RAM — Random Access Memory (DDR5 Dual-Channel)',
    shortName: 'RAM Modules',
    category: 'Memory',
    powerDraw: '5 – 12 W',
    temperature: '32 – 50 °C',
    body: 'Ultra-low latency volatile workspace memory utilized by the CPU for active processes, kernel buffers, and program assets. Features integrated On-Die ECC (Error Correction Code) and onboard Power Management ICs (PMIC) for razor-sharp voltage regulation.',
    systemType: 'pc',
    specs: [
      { label: 'Memory Standard', value: 'DDR5 SDRAM (288-pin DIMM)' },
      { label: 'Configuration', value: '32 GB (2 × 16 GB Dual-Channel Kit)' },
      { label: 'Frequency / Speed', value: '6000 MT/s (PC5-48000)' },
      { label: 'Primary Timings', value: 'CL30-36-36-76' },
      { label: 'Operating Voltage', value: '1.35 V (XMP 3.0 / EXPO Profile)' },
      { label: 'PMIC / ECC', value: 'Onboard PMIC with On-Die ECC validation' },
    ],
    installGuide: [
      'Always install 2 sticks in slots A2 and B2 (typically slots 2 & 4 from CPU socket) for optimal dual-channel signal integrity.',
      'Open the DIMM latch clips and align the asymmetric plastic key notch with the slot partition.',
      'Apply firm, even downward thumb pressure on both ends until the retention latches audibly snap shut.',
    ],
    troubleshootingTips: [
      'Continuous repetitive beep code (1 long beep or 3 beeps): memory not seated properly or defective module.',
      'Windows showing less RAM than installed or system crashing under load: test each DIMM individually using Windows Memory Diagnostic or MemTest86.',
    ],
  },
  {
    id: 'gpu',
    name: 'GPU — Dedicated Graphics Accelerator',
    shortName: 'GPU (Graphics)',
    category: 'Graphics',
    powerDraw: '180 – 350 W',
    temperature: '40 – 78 °C',
    body: 'Parallel processing powerhouse housing thousands of stream multiprocessors, tensor calculation cores, and ray tracing accelerators. Driven by high-bandwidth GDDR6X video memory to render photorealistic geometry, simulations, video encoding, and AI neural networks.',
    systemType: 'pc',
    specs: [
      { label: 'Bus Interface', value: 'PCIe 4.0 / 5.0 x16 mechanical & electrical' },
      { label: 'VRAM Capacity', value: '16 GB GDDR6X (256-bit bus, 716 GB/s bandwidth)' },
      { label: 'Stream / CUDA Cores', value: '7,680 Cores' },
      { label: 'Cooling Shroud', value: 'Triple 90mm axial-tech counter-rotating fans' },
      { label: 'Display Outputs', value: '3 × DisplayPort 1.4a, 1 × HDMI 2.1a' },
      { label: 'Power Connector', value: '1 × 16-pin 12VHPWR (or dual 8-pin PCIe power)' },
    ],
    installGuide: [
      'Remove the correct chassis expansion slot bracket plates corresponding to the GPU’s double/triple slot thickness.',
      'Press firmly into primary PCIe x16 slot until the PCIe retention latch snaps securely over the card tab.',
      'Fasten bracket screws to chassis and attach a GPU anti-sag support bracket to protect PCIe slot solder points.',
      'Ensure 12V-2x6 / 12VHPWR or 8-pin auxiliary power connectors are clicked 100% flush into the socket.',
    ],
    troubleshootingTips: [
      'Display has no signal but PC boots: verify display cable is plugged directly into GPU outputs, NOT the motherboard I/O.',
      'Artifacts (checkerboard patterns, screen tearing): GPU overheating, bad memory solder, or insufficient auxiliary PCIe power.',
    ],
  },
  {
    id: 'storage',
    name: 'Storage — High-Speed NVMe M.2 Solid State Drive',
    shortName: 'M.2 NVMe SSD',
    category: 'Storage',
    powerDraw: '2 – 8 W',
    temperature: '35 – 65 °C',
    body: 'High-density, non-volatile persistent storage delivering instant operating system boots and zero-lag file access. Connects directly to CPU PCIe root lanes via the M.2 interface using 3D TLC NAND flash chips orchestrated by an intelligent multi-core flash memory controller.',
    systemType: 'both',
    specs: [
      { label: 'Form Factor', value: 'M.2 Type 2280 (22mm width × 80mm length)' },
      { label: 'Protocol / Interface', value: 'NVMe 2.0 over PCIe 4.0 x4 lanes' },
      { label: 'Capacity', value: '2,000 GB (2 TB) 3D NAND' },
      { label: 'Sequential Read', value: 'Up to 7,450 MB/s' },
      { label: 'Sequential Write', value: 'Up to 6,900 MB/s' },
      { label: 'Endurance Rating', value: '1,200 TBW (Terabytes Written)' },
    ],
    installGuide: [
      'Locate primary M.2 slot shielded by the motherboard heatsink; remove heatsink and peel thermal pad protective film.',
      'Insert M.2 card into slot at a 30-degree upward angle until gold contact pins are fully seated.',
      'Gently push card down parallel to motherboard and secure with the M.2 standoff screw or toolless EZ-latch.',
    ],
    troubleshootingTips: [
      'Drive missing in BIOS/UEFI boot priority: verify if slot shares lanes with SATA ports or check NVMe RAID/AHCI settings.',
      'Write speeds dropping dramatically during long transfers: drive is thermal throttling; ensure heatsink thermal pad is making direct contact.',
    ],
  },
  {
    id: 'sata-hdd',
    name: 'Secondary Storage — 3.5" SATA Hard Disk Drive / SSD Bay',
    shortName: 'SATA HDD / Bay',
    category: 'Storage',
    powerDraw: '5 – 10 W',
    temperature: '30 – 45 °C',
    body: 'High-capacity magnetic or SATA solid-state mass storage installed in the chassis front drive cage. Utilizes dual cables: a 7-pin SATA 6 Gb/s data cable to the motherboard and a 15-pin SATA power connector from the power supply unit.',
    systemType: 'pc',
    specs: [
      { label: 'Interface Standard', value: 'SATA III (Serial ATA 6.0 Gb/s)' },
      { label: 'Spindle Speed', value: '7,200 RPM (Mechanical HDD) or 0 RPM (2.5" SSD)' },
      { label: 'Form Factors Supported', value: '3.5" LFF (Large Form Factor) & 2.5" SFF' },
      { label: 'Buffer / Cache', value: '256 MB DRAM Cache buffer' },
      { label: 'Data Cable Pinout', value: '7-pin keyed connector (Tx+, Tx-, Rx-, Rx+, GND)' },
      { label: 'Power Input Rails', value: '+12V (motor), +5V (controller board), +3.3V' },
    ],
    installGuide: [
      'Slide drive into toolless plastic drive caddy with vibration-dampening rubber grommets aligned to screw holes.',
      'Push caddy into the lower chassis drive cage until the latch clicks securely.',
      'Connect keyed L-shaped 7-pin SATA data cable to SATA_1 port on motherboard and 15-pin SATA power connector from PSU.',
    ],
    troubleshootingTips: [
      'Clicking / grinding sound from drive ("Click of Death"): mechanical head actuator failure; back up data immediately.',
      'Drive not detected in Windows Explorer: check Disk Management (diskmgmt.msc) to initialize, partition (GPT), and format (NTFS).',
    ],
  },
  {
    id: 'case-fans',
    name: 'Chassis Airflow — Intake & Exhaust Fan Array',
    shortName: 'Case Fans',
    category: 'Thermal',
    powerDraw: '2 – 5 W per Fan',
    temperature: 'Ambient Flow',
    body: 'Dynamic ventilation array establishing directional airflow throughout the chassis. Front intake fans draw cool filtered air across the storage cages and motherboard, while rear and top exhaust fans expel heated air generated by the CPU and GPU.',
    systemType: 'pc',
    specs: [
      { label: 'Fan Configuration', value: '2 × 120mm front intake + 1 × 120mm rear exhaust' },
      { label: 'Airflow Flow Type', value: 'Positive Pressure setup (Intake CFM > Exhaust CFM)' },
      { label: 'Connector Standard', value: '4-pin PWM (Pulse Width Modulation) + ARGB 5V' },
      { label: 'Bearing Type', value: 'Fluid Dynamic Bearing (FDB, 60,000 hrs MTTF)' },
      { label: 'Max Airflow', value: '55.3 CFM per fan @ 1500 RPM' },
      { label: 'Acoustic Level', value: '18 – 24 dBA quiet profile' },
    ],
    installGuide: [
      'Verify airflow direction indicator arrows molded on the plastic fan frame (arrow points toward exhaust side).',
      'Mount front fans to pull air IN through the dust filter; mount rear fan to blow air OUT of the case.',
      'Daisy-chain 4-pin PWM cables or plug into SYS_FAN / CHA_FAN headers on the motherboard.',
    ],
    troubleshootingTips: [
      'Excessive dust buildup inside chassis: indicates negative pressure configuration; increase front intake fan RPM curve.',
      'Rattling noise: fan blade clipping against an unrouted internal power cable or loose mounting screw.',
    ],
  },
  {
    id: 'cmos-battery',
    name: 'CMOS Battery — CR2032 Real-Time Clock & BIOS Battery',
    shortName: 'CMOS Battery',
    category: 'Interconnect',
    powerDraw: 'Micro-amperes (~0.01W)',
    temperature: 'Ambient (~30°C)',
    body: 'A 3-volt lithium coin cell battery that supplies continuous backup power to the motherboard Real-Time Clock (RTC) and non-volatile CMOS memory, preserving system clock time, hardware date, and user-configured BIOS/UEFI settings when the AC power cord is unplugged.',
    systemType: 'both',
    specs: [
      { label: 'Cell Chemistry', value: 'Lithium Manganese Dioxide (Li/MnO2)' },
      { label: 'Nominal Voltage', value: '3.0 Volts DC' },
      { label: 'Standard Capacity', value: '220 – 240 mAh' },
      { label: 'Form Dimensions', value: '20mm diameter × 3.2mm thickness (CR2032)' },
      { label: 'Expected Battery Life', value: '3 to 5 years continuous operation' },
      { label: 'Socket Retention', value: 'Spring-loaded metal horizontal coin cell latch' },
    ],
    installGuide: [
      'Identify the horizontal round socket usually located between the primary PCIe slot and the chipset heatsink.',
      'Insert battery with the smooth flat positive (+) side facing UPWARD.',
      'Press down gently until the spring-loaded metal clip snaps over the coin edge.',
    ],
    troubleshootingTips: [
      'PC prompts "Press F1 to enter Setup" or system time/date resets to Jan 1 on every boot: battery voltage is below 2.5V and must be replaced.',
      'BIOS password forgotten: disconnect AC power cord, remove CMOS battery for 5 minutes, and short the 2-pin CLRTC jumper to reset settings to factory default.',
    ],
  },
  {
    id: 'fpanel',
    name: 'Front Panel Headers — System Control & I/O Wiring',
    shortName: 'FPANEL Wiring',
    category: 'Interconnect',
    powerDraw: 'Low Voltage Logic (~1W)',
    temperature: 'Ambient',
    body: 'The 9-pin motherboard header block connecting the chassis front controls: Power Switch (PWR_SW), Reset Switch (RESET_SW), Hard Drive Activity LED (HDD_LED), and Power Indicator LED (POWER_LED). Crucial competency in TESDA CSS NC II assembly.',
    systemType: 'pc',
    specs: [
      { label: 'Header Block Standard', value: 'Intel 9-pin Standard Front Panel Layout (2 × 5 key-pin 10)' },
      { label: 'Power / Reset Logic', value: 'Momentary contact switch (non-polarized closure to ground)' },
      { label: 'LED Indicators', value: 'Polarity sensitive (+ positive anode / − negative cathode)' },
      { label: 'USB 3.0 Header', value: '19-pin keyed connector with Dual Differential PCIe pairs' },
      { label: 'HD Audio Header', value: '10-pin block (pin 8 keyed) for front 3.5mm mic/headphone' },
      { label: 'Operating Voltage', value: '+3.3V / +5VSB logic level' },
    ],
    installGuide: [
      'Consult the motherboard manual pinout diagram or printed legends next to the FPANEL header block.',
      'LED connectors are polarized: colored wire is positive (+), white or black wire is negative (−).',
      'Switches (PWR_SW, RESET_SW) are non-polarized and will function regardless of pin orientation.',
    ],
    troubleshootingTips: [
      'HDD activity LED never lights up: connector is plugged in backwards; reverse the + and − pins on the header.',
      'Bench testing without case: gently touch the two PWR_SW pins simultaneously with a flathead screwdriver for 0.5s to initiate POST.',
    ],
  },
  {
    id: 'psu',
    name: 'PSU — Power Supply Unit (Modular ATX 3.0)',
    shortName: 'PSU (Power)',
    category: 'Power',
    powerDraw: '850 W Capacity (80+ Gold)',
    temperature: 'Internal Fan Cooled',
    body: 'The electrical powerhouse that rectifies dangerous 110V/220V AC wall current into strictly regulated, ripple-free DC rails (+12V, +5V, +3.3V) with over-voltage, short-circuit, and over-power protection safeguards (OVP, UVP, OCP, OTP, SCP).',
    systemType: 'pc',
    specs: [
      { label: 'Continuous Output', value: '850 Watts (1000W excursion headroom)' },
      { label: 'Efficiency Rating', value: '80 PLUS Gold (≥ 90% efficiency @ 50% load)' },
      { label: 'Modularity', value: 'Fully Modular (connect only required ribbon cables)' },
      { label: 'ATX Standard', value: 'ATX 3.0 with PCIe 5.0 12VHPWR native cable' },
      { label: 'Cooling System', value: '135mm Fluid Dynamic Bearing fan with Zero-RPM Eco mode' },
      { label: 'Protection ICs', value: 'OCP, OVP, UVP, SCP, OTP, OPP' },
    ],
    installGuide: [
      'Orient the PSU fan facing downward if the case has a bottom intake filter vent; orient upward if case bottom is solid.',
      'Secure PSU to chassis rear frame using the 4 standard coarse-thread hex screws.',
      'Connect all modular cables to the PSU body BEFORE sliding into tight basement shrouds.',
    ],
    troubleshootingTips: [
      'System immediately shuts down under gaming load: PSU triggering OPP/OCP due to transient power spikes exceeding rating.',
      'Paperclip test: jump Green wire (PS_ON#) to any Black ground wire on 24-pin ATX connector to test standalone PSU fan spin.',
    ],
  },
  {
    id: 'server-chassis',
    name: 'Server Chassis — 2U Rackmount Enclosure',
    shortName: '2U Rack Chassis',
    category: 'Enclosure',
    powerDraw: 'Passive',
    temperature: 'Server Ambient',
    body: 'A heavy-duty rack-mountable enclosure designed to fit in a standard 19-inch equipment rack. Features hot-swap drive bays in the front and redundant power supply slots in the rear, prioritizing density, airflow, and physical security.',
    systemType: 'server',
    specs: [
      { label: 'Form Factor Class', value: '2U Rackmount' },
      { label: 'Drive Bays', value: '12 × 3.5" or 24 × 2.5" Hot-Swap SAS/SATA' },
      { label: 'Motherboard Support', value: 'E-ATX, EE-ATX, SSI-EEB' },
      { label: 'Expansion Slots', value: '7 × Low Profile PCIe or 3 × Full Height (with riser)' }
    ],
    installGuide: [
      'Install sliding rack rails into the server rack before mounting the chassis.',
      'Ensure the chassis cover is securely closed to maintain proper positive air pressure for the high-RPM fans.'
    ],
    troubleshootingTips: [
      'Chassis intrusion alarm triggered: Ensure the top lid is completely flush and the microswitch is depressed.'
    ]
  },
  {
    id: 'server-cpu',
    name: 'Server CPU — Enterprise Multi-Core Processor',
    shortName: 'Server CPU',
    category: 'Processing',
    powerDraw: '250 – 350 W TDP',
    temperature: '45 – 80 °C',
    body: 'Enterprise-grade processor optimized for 24/7 uptime, massive virtualization, and heavy database workloads. Features support for multi-socket configurations and hundreds of PCIe lanes.',
    systemType: 'server',
    specs: [
      { label: 'Architecture', value: 'Enterprise x86-64 / ARM' },
      { label: 'Cores / Threads', value: '64 Cores / 128 Threads per socket' },
      { label: 'Smart Cache (L3)', value: '256 MB L3 Cache' },
      { label: 'PCIe Lanes', value: '128 × PCIe 5.0 lanes' }
    ],
    installGuide: [
      'Install into the server socket using the included carrier frame to prevent pin damage.',
      'Fasten heatsink in a diagonal star pattern to ensure even pressure according to torque specifications.'
    ],
    troubleshootingTips: [
      'Check Baseboard Management Controller (BMC) system event log (SEL) for Machine Check Exceptions (MCE).'
    ]
  },
  {
    id: 'server-mobo',
    name: 'Server Motherboard — Dual-Socket SSI-EEB',
    shortName: 'Server Board',
    category: 'Interconnect',
    powerDraw: '50 – 100 W',
    temperature: '40 – 60 °C',
    body: 'A massive, enterprise-grade printed circuit board featuring dual CPU sockets, dozens of memory slots, and integrated out-of-band management (IPMI/BMC). Designed for absolute stability and continuous operation.',
    systemType: 'server',
    specs: [
      { label: 'Form Factor', value: 'SSI-EEB or Proprietary Rackmount' },
      { label: 'Sockets', value: 'Dual LGA 4189 / Socket SP5' },
      { label: 'Memory', value: 'Up to 32 × DDR5 RDIMM slots' },
      { label: 'Management', value: 'Dedicated ASPEED AST2600 BMC for IPMI 2.0 / Redfish' }
    ],
    installGuide: [
      'Ensure the chassis standoffs match the SSI-EEB mounting holes precisely to avoid shorts.',
      'Connect the dedicated management LAN port to the out-of-band management network switch.'
    ],
    troubleshootingTips: [
      'System unbootable: Log into the BMC web interface via the management IP to view POST codes and remote console.'
    ]
  },
  {
    id: 'server-ram',
    name: 'Server RAM — ECC Registered Memory (RDIMM)',
    shortName: 'ECC RAM',
    category: 'Memory',
    powerDraw: '8 – 15 W',
    temperature: '35 – 55 °C',
    body: 'Error-Correcting Code memory that detects and corrects single-bit memory errors on the fly. Essential for preventing data corruption in mission-critical applications and databases.',
    systemType: 'server',
    specs: [
      { label: 'Memory Standard', value: 'DDR5 RDIMM (Registered DIMM)' },
      { label: 'Configuration', value: '64 GB per module' },
      { label: 'Error Correction', value: 'Advanced ECC and Chipkill' },
      { label: 'Frequency', value: '4800 MT/s (JEDEC Standard)' }
    ],
    installGuide: [
      'Populate DIMM slots according to the motherboard manual for optimal interleaving.',
      'Ensure memory channels are balanced across both CPU sockets.'
    ],
    troubleshootingTips: [
      'Memory training failure on boot: Check for unseated modules or dust in the socket.',
      'Correctable errors logged: Monitor module health via IPMI; schedule replacement if threshold is exceeded.'
    ]
  },
  {
    id: 'server-cooling',
    name: 'Server Cooling — High-RPM Counter-Rotating Fans',
    shortName: 'Fan Wall',
    category: 'Thermal',
    powerDraw: '15 – 35 W per fan',
    temperature: 'Ambient Flow',
    body: 'A centralized mid-chassis fan wall composed of ultra-high RPM (10,000+ RPM), dual-rotor hot-swappable fans that force a massive volume of air through the server chassis.',
    systemType: 'server',
    specs: [
      { label: 'Fan Type', value: 'Dual-Rotor Counter-Rotating' },
      { label: 'Speed Range', value: '1,500 – 16,000 RPM' },
      { label: 'Hot-Swap', value: 'Yes, toolless drop-in modules' }
    ],
    installGuide: [
      'Drop fan modules straight down into the mid-plane connectors while the server is running (hot-swap).',
      'Keep fingers clear of the exposed high-speed blades when the lid is removed.'
    ],
    troubleshootingTips: [
      'Loud jet-engine noise constantly: Normal during POST, but if sustained, check BMC for thermal sensor failures or missing chassis lid.'
    ]
  },
  {
    id: 'server-storage',
    name: 'Server Storage — Hot-Swap SAS/SATA Enterprise Drives',
    shortName: 'SAS HDD/SSD',
    category: 'Storage',
    powerDraw: '7 – 12 W',
    temperature: '35 – 45 °C',
    body: 'Enterprise-grade storage drives designed for RAID arrays, offering higher endurance (DWPD), continuous 24/7 duty cycles, and dual-port SAS interfaces for high availability.',
    systemType: 'server',
    specs: [
      { label: 'Interface Standard', value: 'SAS (Serial Attached SCSI) 12Gb/s' },
      { label: 'Spindle Speed', value: '10,000 RPM / 15,000 RPM (HDD) or TLC NAND (SSD)' },
      { label: 'Hot-Swap', value: 'Yes, front-accessible carriers' },
      { label: 'MTBF', value: '2.5 Million Hours' }
    ],
    installGuide: [
      'Mount drives into the hot-swap caddies using the provided flat-head screws.',
      'Slide the caddy into the front backplane and close the lever until it clicks.'
    ],
    troubleshootingTips: [
      'Drive LED flashing amber/red: The drive has failed or is in a predictive failure state; hot-swap with a replacement for RAID rebuild.'
    ]
  },
  {
    id: 'server-psu',
    name: 'Redundant Power Supply Unit (1U/2U)',
    shortName: 'Redundant PSU',
    category: 'Power',
    powerDraw: '1600 W (Titanium)',
    temperature: 'Server Fan Cooled',
    body: 'Hot-swappable power supplies designed for N+1 redundancy. If one PSU fails or loses AC power, the other takes over instantly without dropping the server.',
    systemType: 'server',
    specs: [
      { label: 'Continuous Output', value: '1600 Watts per module' },
      { label: 'Efficiency Rating', value: '80 PLUS Titanium (96% Efficiency)' },
      { label: 'Hot-Swap Support', value: 'Yes, toolless removal with handle' }
    ],
    installGuide: [
      'Slide PSU module into the rear chassis bay until the locking latch clicks.',
      'Connect PSU 1 and PSU 2 to independent power grids or separate UPS units for maximum availability.'
    ],
    troubleshootingTips: [
      'Amber fault LED on PSU: Check input voltage or replace the failed module.',
      'Server shuts down under heavy load: Check if redundant PSU is disabled or operating in cold-standby mode via BMC.'
    ]
  },
  {
    id: 'laptop-mobo',
    name: 'Laptop Logic Board',
    shortName: 'Logic Board',
    category: 'Interconnect',
    powerDraw: '5 – 45 W',
    temperature: '40 – 75 °C',
    body: 'The highly integrated mainboard of a laptop. Contains the embedded CPU, GPU, memory controller, and I/O interfaces on a single dense multi-layer PCB to save space.',
    systemType: 'laptop',
    specs: [
      { label: 'Form Factor', value: 'Proprietary Custom PCB' },
      { label: 'Embedded SoC', value: 'BGA-soldered CPU / APU' },
    ],
    installGuide: [
      'Ensure the internal battery is disconnected before touching the logic board to prevent short circuits.'
    ],
    troubleshootingTips: [
      'Laptop turns off abruptly: check for liquid damage or burnt VRM ICs.'
    ],
  },
  {
    id: 'laptop-battery',
    name: 'Lithium-Ion Polymer Battery',
    shortName: 'Battery',
    category: 'Power',
    powerDraw: 'Discharging / Charging',
    temperature: '30 – 45 °C',
    body: 'A flat, high-density energy storage pack providing portable power. Contains multiple Li-Po cells and a Battery Management System (BMS) for safety.',
    systemType: 'laptop',
    specs: [
      { label: 'Capacity', value: '50 - 99 Watt-hours (Wh)' },
      { label: 'Chemistry', value: 'Lithium-Ion Polymer (Li-Po)' },
    ],
    installGuide: [
      'Do not bend or puncture battery packs. A damaged pack poses a severe fire risk.'
    ],
    troubleshootingTips: [
      'Swollen battery: immediately stop using the device and dispose of the battery safely.'
    ],
  },
  {
    id: 'laptop-cooling',
    name: 'Laptop Thermal Module',
    shortName: 'Cooling / Heatpipe',
    category: 'Thermal',
    powerDraw: '2 – 5 W',
    temperature: 'Exhausts 60 – 90 °C heat',
    body: 'A compact cooling solution using flattened copper heatpipes to transfer heat from the CPU/GPU die to a fin stack, where a low-profile blower fan exhausts the heat.',
    systemType: 'laptop',
    specs: [
      { label: 'Thermal Interface', value: 'Liquid Metal or High-Performance Thermal Paste' },
      { label: 'Fan Type', value: '5V Blower Fan (Centrifugal)' },
    ],
    installGuide: [
      'Tighten heatsink screws in a diagonal pattern (1-3-2-4) to ensure even mounting pressure.'
    ],
    troubleshootingTips: [
      'Loud grinding noise: fan bearing may be failing due to dust buildup or wear.'
    ],
  },
  {
    id: 'laptop-ram',
    name: 'SO-DIMM Memory',
    shortName: 'SO-DIMM RAM',
    category: 'Memory',
    powerDraw: '2 – 4 W',
    temperature: '35 – 50 °C',
    body: 'Small Outline Dual In-line Memory Module. A smaller form factor version of regular desktop RAM designed specifically for laptops and mini-PCs.',
    systemType: 'laptop',
    specs: [
      { label: 'Form Factor', value: '262-pin SO-DIMM (DDR5)' },
      { label: 'Voltage', value: '1.1V (DDR5)' },
    ],
    installGuide: [
      'Insert the stick into the slot at a 30-degree angle, then press down until the side clips lock into place.'
    ],
    troubleshootingTips: [
      'Memory failure: unclip and reseat the RAM, or try a single stick in alternating slots.'
    ],
  },
  {
    id: 'laptop-storage',
    name: 'M.2 NVMe SSD',
    shortName: 'NVMe SSD',
    category: 'Storage',
    powerDraw: '3 – 6 W',
    temperature: '40 – 70 °C',
    body: 'A gum-stick sized solid state drive that connects directly to the PCIe bus for ultra-fast storage speeds in compact spaces.',
    systemType: 'laptop',
    specs: [
      { label: 'Form Factor', value: 'M.2 2280' },
      { label: 'Interface', value: 'PCIe Gen 4.0 x4' },
    ],
    installGuide: [
      'Insert at a slight angle and secure with the single M.2 hold-down screw.'
    ],
    troubleshootingTips: [
      'Drive not detected: ensure it is fully inserted; sometimes thermal pads can prevent full seating.'
    ],
  },
  {
    id: 'laptop-wifi',
    name: 'WLAN / Wi-Fi + Bluetooth Card',
    shortName: 'Wi-Fi Card',
    category: 'Interconnect',
    powerDraw: '1 – 3 W',
    temperature: '35 – 45 °C',
    body: 'An M.2 2230 sized wireless network adapter providing Wi-Fi and Bluetooth connectivity. Features microscopic U.FL antenna connectors.',
    systemType: 'laptop',
    specs: [
      { label: 'Form Factor', value: 'M.2 2230 Key E' },
      { label: 'Standard', value: 'Wi-Fi 6E / Wi-Fi 7' },
    ],
    installGuide: [
      'Be extremely gentle when snapping the fragile antenna cables onto the U.FL terminals.'
    ],
    troubleshootingTips: [
      'Poor signal strength: ensure both main and auxiliary antenna cables are securely attached.'
    ],
  },
  {
    id: 'wifi-router',
    name: 'Wireless Router',
    shortName: 'Wi-Fi Router',
    category: 'Interconnect',
    powerDraw: '5 – 15 W',
    temperature: '40 – 50 °C',
    body: 'A networking device that forwards data packets between computer networks and provides Wi-Fi access. Acts as the gateway, DHCP server, and firewall for the local network.',
    systemType: 'networking',
    specs: [
      { label: 'Standard', value: '802.11ax (Wi-Fi 6)' },
      { label: 'Ports', value: '1× WAN, 4× Gigabit LAN' },
    ],
    installGuide: [
      'Place in an open, central location away from thick concrete walls for optimal signal coverage.'
    ],
    troubleshootingTips: [
      'No internet connection: check the WAN link light and reboot the router.'
    ],
  },
  {
    id: 'network-switch',
    name: '24-Port Gigabit Ethernet Switch',
    shortName: 'Network Switch',
    category: 'Interconnect',
    powerDraw: '10 – 30 W',
    temperature: '35 – 45 °C',
    body: 'Connects devices together on a computer network by using packet switching to receive and forward data to the destination device.',
    systemType: 'networking',
    specs: [
      { label: 'Ports', value: '24× 10/100/1000 Mbps RJ45' },
      { label: 'Switching Capacity', value: '48 Gbps Non-blocking' },
    ],
    installGuide: [
      'Mount securely in a 19-inch rack and connect the uplink port to the main router or core switch.'
    ],
    troubleshootingTips: [
      'Port LED off: check cable for breaks or verify the connected device is powered on.'
    ],
  },
  {
    id: 'patch-panel',
    name: '24-Port RJ45 Patch Panel',
    shortName: 'Patch Panel',
    category: 'Interconnect',
    powerDraw: 'Passive',
    temperature: 'Ambient',
    body: 'A mounted hardware unit containing an assembly of port locations. It serves as a static switchboard to connect and manage incoming and outgoing LAN cables.',
    systemType: 'networking',
    specs: [
      { label: 'Category', value: 'Cat 6 UTP' },
      { label: 'Punch Down', value: '110 Block (T568B Standard)' },
    ],
    installGuide: [
      'Use a punch-down tool to terminate horizontal cabling onto the rear 110 blocks following the T568B color code.'
    ],
    troubleshootingTips: [
      'Intermittent connection: re-punch the wire to ensure the insulation displacement contact (IDC) has bitten through the wire jacket.'
    ],
  },
  {
    id: 'lan-tester',
    name: 'RJ45 LAN Cable Tester',
    shortName: 'Cable Tester',
    category: 'Interconnect',
    powerDraw: '9V Battery',
    temperature: 'Ambient',
    body: 'A diagnostic tool used to verify the electrical connections in a twisted-pair network cable. Checks for continuity, open circuits, short circuits, and crossed wires.',
    systemType: 'networking',
    specs: [
      { label: 'Compatibility', value: 'RJ45, RJ11, RJ12' },
      { label: 'Display', value: '1-8 LED Pin Indicators' },
    ],
    installGuide: [
      'Connect one end of the terminated cable to the master unit and the other to the remote unit. Turn on to scan pins 1 through 8.'
    ],
    troubleshootingTips: [
      'LEDs skipping numbers: Indicates an open circuit (wire not making contact) or a broken wire.'
    ],
  }
]
