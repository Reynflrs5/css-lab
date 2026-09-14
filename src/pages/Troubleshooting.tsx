import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Volume2,
  ShieldAlert,
} from 'lucide-react'
import '../styles/tech-pages.css'

const diagnosticSteps = [
  {
    step: 1,
    title: 'Identify the Problem',
    detail: 'Gather user symptoms, inquire about recent hardware/driver modifications, review error logs (Event Viewer), and establish if issue is reproducible under consistent conditions.',
  },
  {
    step: 2,
    title: 'Establish a Theory of Probable Cause',
    detail: 'Brainstorm the most likely root causes from simplest to most complex. Consider fundamental factors first (unplugged cables, tripped PSU breakers, loose RAM seating).',
  },
  {
    step: 3,
    title: 'Test the Theory to Determine Cause',
    detail: 'Execute targeted diagnostic tests (swap suspect DIMMs into known-good slots, boot to minimal hardware POST configuration, probe PSU rails with a multimeter).',
  },
  {
    step: 4,
    title: 'Establish a Plan of Action & Solution',
    detail: 'Formulate an actionable repair plan that minimizes system downtime and prevents collateral component damage. Identify replacement parts or driver rollbacks.',
  },
  {
    step: 5,
    title: 'Implement the Solution or Escalate',
    detail: 'Execute the repair or configuration changes step-by-step. If outside local scope or under vendor warranty seal, escalate to tier-2 or manufacturer support.',
  },
  {
    step: 6,
    title: 'Verify Full System Functionality',
    detail: 'Perform full POST cycle, launch stress testing benchmarks, test peripheral I/O, and implement preventive measures to ensure the fault will not recur.',
  },
  {
    step: 7,
    title: 'Document Findings, Actions & Outcomes',
    detail: 'Record the incident ticket details: exact error code, root cause discovered, replacement part serials, and diagnostic duration into the workshop ticketing system.',
  },
]

const postSequence = [
  { step: '01', title: 'Power Initialization', desc: 'PSU stabilizes DC voltages and asserts PWR_OK (+5V) signal on pin 8 of 24-pin ATX harness; motherboard releases CPU reset.' },
  { step: '02', title: 'CPU Register Self-Check', desc: 'Processor executes reset vector jump to BIOS/UEFI ROM address; validates internal registers and microcode.' },
  { step: '03', title: 'POST Diagnostic Routine', desc: 'Firmware executes preliminary system timer, DMA controller, and interrupt controller self-tests.' },
  { step: '04', title: 'DRAM Detection & Sizing', desc: 'Memory controller reads SPD EEPROM chips on DIMMs, configures JEDEC/XMP voltage and timings, tests read/write registers.' },
  { step: '05', title: 'PCIe & GPU Enumeration', desc: 'Enumerates PCIe root complex; initializes primary display adapter and displays video BIOS banner on screen.' },
  { step: '06', title: 'Storage & Peripheral Detection', desc: 'Scans SATA ports and NVMe PCIe lanes for attached SSDs, HDDs, and USB human interface devices (HID).' },
  { step: '07', title: 'Diagnostic Port 0x80 Output', desc: 'Outputs two-digit hexadecimal POST codes to motherboard 7-segment debug display or external PCIe diagnostic card.' },
  { step: '08', title: 'OS Bootloader Handoff', desc: 'Loads EFI Boot Manager (UEFI GPT) or Master Boot Record (Legacy BIOS MBR) into RAM; yields CPU control to OS kernel.' },
]

const beepCodes = [
  { bios: 'AMI', beeps: '1 short', meaning: 'POST Passed — Normal Boot', status: 'OK', color: '#10b981' },
  { bios: 'AMI', beeps: '1 long, 3 short', meaning: 'Conventional/Extended Memory Failure', status: 'DRAM Error', color: '#ef4444' },
  { bios: 'AMI', beeps: '5 short', meaning: 'CPU / Processor Circuit Failure', status: 'CPU Error', color: '#ef4444' },
  { bios: 'AMI', beeps: '7 short', meaning: 'Processor Virtual Mode Exception', status: 'CPU Error', color: '#ef4444' },
  { bios: 'AMI', beeps: '8 short', meaning: 'Display Memory Read/Write Error', status: 'VGA Error', color: '#f59e0b' },
  { bios: 'Award', beeps: '1 long, 2 short', meaning: 'Video Adapter Failure or Cable Unseated', status: 'VGA Error', color: '#f59e0b' },
  { bios: 'Award', beeps: 'Continuous Beep', meaning: 'Memory Not Detected or Unseated DIMM', status: 'DRAM Error', color: '#ef4444' },
  { bios: 'Award', beeps: 'Repeating High/Low', meaning: 'CPU Overheating or Damaged Fan Sensor', status: 'Thermal Trip', color: '#ef4444' },
  { bios: 'Phoenix', beeps: '1-1-3', meaning: 'CMOS RAM Read/Write Failure', status: 'Battery/CMOS', color: '#f59e0b' },
  { bios: 'Phoenix', beeps: '1-3-1', meaning: 'RAM Refresh Circuit Failure', status: 'DRAM Error', color: '#ef4444' },
  { bios: 'Phoenix', beeps: '3-3-4', meaning: 'Video Controller Initialization Fault', status: 'VGA Error', color: '#f59e0b' },
]

const commonProblems = [
  {
    symptom: 'No Display / Black Screen (Fans Spinning)',
    severity: 'High',
    causes: 'Unseated GPU or RAM DIMMs, monitor plugged into motherboard rather than discrete GPU, corrupted CMOS BIOS settings.',
    fix: 'Reseat graphics card and RAM. Verify display HDMI/DisplayPort connects directly to GPU. Clear CMOS by bridging CLR_CMOS pins for 10 seconds.',
  },
  {
    symptom: 'System Completely Unresponsive (No Fans / No LEDs)',
    severity: 'Critical',
    causes: 'Wall AC cord disconnected, PSU rear switch in 0 position, front-panel PWR_SW wire detached, tripped PSU short-circuit protection (OVP/OCP).',
    fix: 'Perform PSU paperclip test (bridge Pin 16 PS_ON green wire to ground black wire). Check ATX 24-pin connection. Inspect motherboard for blown electrolytic capacitors.',
  },
  {
    symptom: 'Intermittent BSOD / Sudden Kernel Panics',
    severity: 'High',
    causes: 'Faulty or misconfigured RAM timings, CPU overheating (>95°C thermal throttle), incompatible display drivers, corrupted system files.',
    fix: 'Boot into MemTest86 to check memory bit integrity. Check CPU cooler mounting pressure. Run sfc /scannow and DISM restorehealth in elevated CMD.',
  },
  {
    symptom: 'Storage Device Not Detected in BIOS/UEFI',
    severity: 'Medium',
    causes: 'Loose SATA data/power connection, disabled M.2 slot in BIOS due to shared PCIe lanes, SSD controller firmware failure.',
    fix: 'Inspect SATA data cable locking latches. Check motherboard manual for PCIe/SATA lane sharing conflicts. Update motherboard UEFI firmware.',
  },
  {
    symptom: 'Ethernet NIC Shows "No Internet" or APIPA 169.254.x.x',
    severity: 'Medium',
    causes: 'DHCP server unreachable, damaged RJ-45 copper pins, disabled network adapter in Windows Device Manager, IP address conflict.',
    fix: 'Inspect RJ-45 patch cable on continuity tester. Run `ipconfig /release` followed by `ipconfig /renew`. Verify router DHCP service is active.',
  },
]

const diagnosticTools = [
  { name: 'MemTest86', type: 'Standalone USB Boot', use: 'Independent RAM stress testing outside OS environment. Detects faulty cells.' },
  { name: 'CrystalDiskInfo', type: 'Windows Utility', use: 'Reads S.M.A.R.T. health telemetry, reallocated sector counts, and drive temperature.' },
  { name: 'HWiNFO64', type: 'Hardware Monitor', use: 'Deep real-time sensor readout for CPU package temps, VRM phases, and ATX rail voltages.' },
  { name: 'sfc /scannow', type: 'Windows Native CMD', use: 'System File Checker — scans protected system files and replaces corrupted binaries.' },
  { name: 'Windows Event Viewer', type: 'OS Telemetry (eventvwr)', use: 'Inspects Application and System event logs for Event ID 41 (Kernel-Power) crashes.' },
  { name: 'Wireshark', type: 'Packet Analyzer', use: 'Deep packet inspection for network troubleshooting, ARP broadcasts, and DHCP handshakes.' },
]

// ── FEATURE 1: Symptom Checker tree ─────────────────────────────────────────
const symptomTree: Record<string, { question: string; options: { label: string; next: string | null; result?: string }[] }> = {
  root: {
    question: 'What is the primary symptom?',
    options: [
      { label: 'No display / black screen', next: 'no_display' },
      { label: 'PC does not turn on at all', next: 'no_power' },
      { label: 'Blue Screen of Death (BSOD)', next: 'bsod' },
      { label: 'No internet / network access', next: 'no_network' },
      { label: 'PC turns on but no beeps & no POST', next: 'no_post' },
    ],
  },
  no_display: {
    question: 'Are the fans spinning and LEDs on?',
    options: [
      { label: 'Yes — fans are running', next: 'no_display_fans' },
      { label: 'No — completely dead', next: 'no_power' },
    ],
  },
  no_display_fans: {
    question: 'Where is the monitor cable plugged in?',
    options: [
      { label: 'Into the motherboard (rear I/O)', next: null, result: 'Plug the display cable into the dedicated GPU port, not the motherboard. The CPU may not have integrated graphics enabled.' },
      { label: 'Into the GPU directly', next: 'no_display_gpu' },
    ],
  },
  no_display_gpu: {
    question: 'Have you recently installed or removed RAM?',
    options: [
      { label: 'Yes', next: null, result: 'Reseat all RAM sticks. Remove one stick at a time and test each slot. Refer to the motherboard manual for the correct DIMM priority slot (usually A2/B2).' },
      { label: 'No', next: null, result: 'Clear the CMOS by removing the motherboard battery for 30 seconds or bridging the CLR_CMOS jumper pins. If problem persists, try a known-good GPU.' },
    ],
  },
  no_power: {
    question: 'Does the PSU fan spin at all when pressing power?',
    options: [
      { label: 'No — nothing happens', next: null, result: 'Check: (1) PSU rear rocker switch is ON. (2) Wall outlet is live. (3) Perform the PSU paperclip test — bridge PS_ON (green, pin 16) to GND (black) on the 24-pin connector. If fan spins, the issue is the front-panel PWR_SW header or motherboard.' },
      { label: 'Spins briefly then shuts off', next: null, result: 'The PSU is triggering Over-Current Protection (OCP). Disconnect all non-essential peripherals (HDDs, PCIe cards) and test with only CPU + 1 stick of RAM. If it boots, a peripheral is shorting.' },
    ],
  },
  bsod: {
    question: 'Is the BSOD random or triggered by a specific action?',
    options: [
      { label: 'Random — even at idle', next: null, result: 'Most likely faulty RAM. Boot MemTest86 from USB and run at least 2 passes. Also check CPU temperature in HWiNFO64 — throttle at 95°C+ can cause kernel panics.' },
      { label: 'When loading a game or GPU app', next: null, result: 'GPU driver crash. Boot into Safe Mode (F8), uninstall GPU drivers using DDU (Display Driver Uninstaller), then reinstall the latest stable driver from the manufacturer website.' },
      { label: 'After a Windows Update', next: null, result: 'Roll back the update via Settings > Windows Update > Update History > Uninstall. If stuck in a reboot loop, use Startup Repair from a Windows USB installer.' },
    ],
  },
  no_network: {
    question: 'Is this Wi-Fi or wired Ethernet?',
    options: [
      { label: 'Wired Ethernet', next: 'no_eth' },
      { label: 'Wi-Fi', next: null, result: 'Check: (1) Airplane mode is OFF. (2) Forget & rejoin the network. (3) Update Wi-Fi adapter driver. (4) Run `netsh winsock reset` in elevated CMD and restart.' },
    ],
  },
  no_eth: {
    question: 'What does `ipconfig` show for the Ethernet adapter?',
    options: [
      { label: '169.254.x.x (APIPA address)', next: null, result: 'The PC cannot reach the DHCP server. Check: (1) Ethernet cable continuity with a LAN tester. (2) Router/switch is powered on. (3) Run `ipconfig /release` then `ipconfig /renew`. (4) Check Device Manager for yellow exclamation on NIC.' },
      { label: 'No adapter listed at all', next: null, result: 'The NIC driver is missing or corrupted. Open Device Manager and look for unknown devices. Download the correct NIC driver from the motherboard manufacturer website and install manually.' },
    ],
  },
  no_post: {
    question: 'Does the motherboard have a POST debug display (7-segment or Q-Code LEDs)?',
    options: [
      { label: 'Yes — it shows a code', next: null, result: 'Look up the displayed hex code in the motherboard manual. Common codes: 00/FF = CPU not detected (reseat CPU, check for bent pins). d0-d3 = memory training failure (reseat RAM). 62 = PCIe initialization (reseat GPU).' },
      { label: 'No debug display', next: null, result: 'Strip to minimum components: 1 CPU + 1 RAM stick in slot A2 + power. If no beep, suspect faulty RAM, CPU, or dead motherboard. Borrow a known-good RAM stick to test.' },
    ],
  },
}

// ── FEATURE 2: Preventive Maintenance Checklist ─────────────────────────────
const maintenanceTasks = [
  { interval: 'Monthly', task: 'Blow out dust from vents & filters with compressed air can', why: 'Dust buildup increases thermal resistance, raising component temperatures by 10–20°C.' },
  { interval: 'Monthly', task: 'Inspect all cable connections for secure seating', why: 'Vibration from cooling fans can loosen SATA, PCIe, and RAM connectors over time.' },
  { interval: 'Every 3 Months', task: 'Clean keyboard, mouse, and monitor screen', why: 'Prevents bacteria buildup and static discharge from conductive debris.' },
  { interval: 'Every 6 Months', task: 'Check S.M.A.R.T. drive health via CrystalDiskInfo', why: 'Early detection of reallocated sectors allows data backup before HDD failure.' },
  { interval: 'Every 6 Months', task: 'Run Windows Disk Cleanup and defragment HDDs (not SSDs)', why: 'Fragmented HDDs have longer seek times. SSDs should use TRIM, not defrag.' },
  { interval: 'Annually', task: 'Replace CPU thermal paste', why: 'Thermal paste dries and cracks over 1–3 years, causing a 5–15°C rise in idle CPU temps.' },
  { interval: 'Every 3–5 Years', task: 'Replace CMOS battery (CR2032)', why: 'A dead CMOS battery causes BIOS settings to reset and the system clock to lose time.' },
  { interval: 'As Needed', task: 'Update BIOS/UEFI firmware', why: 'Firmware updates fix security vulnerabilities and add support for new CPU generations.' },
]

// ── FEATURE 3: CMD Quick Reference ──────────────────────────────────────────
const cmdCommands = [
  { cmd: 'ipconfig /all', category: 'Network', desc: 'Displays full NIC configuration: IP, subnet, gateway, MAC address, DNS, and DHCP lease info.' },
  { cmd: 'ipconfig /release', category: 'Network', desc: 'Releases the current DHCP-assigned IP address back to the DHCP server.' },
  { cmd: 'ipconfig /renew', category: 'Network', desc: 'Requests a fresh IP address from the DHCP server. Use after /release.' },
  { cmd: 'ipconfig /flushdns', category: 'Network', desc: 'Clears the local DNS resolver cache. Fixes "site not found" after DNS changes.' },
  { cmd: 'ping 127.0.0.1', category: 'Network', desc: 'Pings the loopback address to verify TCP/IP stack is functioning on the local machine.' },
  { cmd: 'ping 8.8.8.8', category: 'Network', desc: 'Pings Google DNS to verify internet connectivity beyond local LAN.' },
  { cmd: 'tracert <hostname>', category: 'Network', desc: 'Traces the network path (each hop/router) to a destination. Reveals where packets are dropping.' },
  { cmd: 'netstat -ano', category: 'Network', desc: 'Lists all active TCP/UDP connections with process IDs. Useful for detecting unauthorized connections.' },
  { cmd: 'sfc /scannow', category: 'System', desc: 'System File Checker — scans and repairs corrupted protected Windows system files in place.' },
  { cmd: 'DISM /Online /Cleanup-Image /RestoreHealth', category: 'System', desc: 'Repairs the Windows image using Windows Update as the source. Run before sfc if image itself is corrupt.' },
  { cmd: 'chkdsk C: /f /r', category: 'Disk', desc: 'Checks drive C: for filesystem errors (/f) and bad sectors (/r). Requires restart for system drive.' },
  { cmd: 'diskpart', category: 'Disk', desc: 'Opens the disk partitioning utility. Use list disk, select disk, list partition, and format commands.' },
  { cmd: 'eventvwr', category: 'System', desc: 'Opens Event Viewer. Navigate to Windows Logs > System and filter by Event ID 41 (unexpected shutdown).' },
  { cmd: 'msconfig', category: 'System', desc: 'System Configuration — manage startup items, boot options (Safe Mode), and services.' },
  { cmd: 'devmgmt.msc', category: 'Hardware', desc: 'Opens Device Manager. Yellow exclamation marks indicate missing or corrupt drivers.' },
  { cmd: 'mdsched.exe', category: 'Hardware', desc: 'Windows Memory Diagnostic — schedules a RAM test on next restart.' },
]

// ── FEATURE 4: BSOD Stop Codes ──────────────────────────────────────────────
const bsodCodes = [
  { code: '0x0000007E', name: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED', cause: 'A driver threw an unhandled exception. Most common: outdated or corrupt GPU/NIC drivers.', fix: 'Boot Safe Mode, use DDU to remove GPU drivers, reinstall from manufacturer site.' },
  { code: '0x0000007F', name: 'UNEXPECTED_KERNEL_MODE_TRAP', cause: 'CPU-level error — stack overflow, divide-by-zero, or overheating CPU causing register corruption.', fix: 'Check CPU temps in HWiNFO64. Run Prime95 stress test. Reseat CPU cooler and replace thermal paste.' },
  { code: '0x0000009F', name: 'DRIVER_POWER_STATE_FAILURE', cause: 'A driver did not respond correctly during Sleep/Hibernate power state transitions.', fix: 'Update all drivers. Disable Hybrid Sleep in Power Options > Advanced Settings.' },
  { code: '0x000000C2', name: 'BAD_POOL_CALLER', cause: 'A driver or process attempted an invalid memory pool allocation. Often caused by defective RAM.', fix: 'Run MemTest86 for 2+ passes. Update or rollback recently installed drivers.' },
  { code: '0x000000D1', name: 'DRIVER_IRQL_NOT_LESS_OR_EQUAL', cause: 'A driver accessed memory at an incorrect IRQL. Frequently seen with NIC, USB, or GPU drivers.', fix: 'Check the minidump file in C:\Windows\Minidump using WinDbg. Update named driver.' },
  { code: '0x000000EF', name: 'CRITICAL_PROCESS_DIED', cause: 'A critical Windows system process (csrss.exe, winlogon.exe) terminated unexpectedly.', fix: 'Run sfc /scannow and DISM /RestoreHealth. Check for malware with Windows Defender offline scan.' },
  { code: '0xC0000034', name: 'WINLOAD.EFI NOT FOUND', cause: 'Boot configuration data (BCD) is missing or corrupted. Often occurs after improper shutdown during updates.', fix: 'Boot from Windows USB > Repair your computer > Startup Repair. Or run: bootrec /fixbcd in CMD.' },
  { code: '0xC000021A', name: 'STATUS_SYSTEM_PROCESS_TERMINATED', cause: 'Csrss.exe or winlogon.exe crashed before login screen — usually a missing system DLL.', fix: 'Boot into recovery environment and run sfc /scannow /offbootdir=C:\ /offwindir=C:\Windows.' },
]

// ── FEATURE 5: Thermal Management Guide ─────────────────────────────────────
const thermalGuide = [
  {
    title: 'Normal Temperature Ranges',
    items: [
      { label: 'CPU Idle', range: '30–50°C', status: 'OK', color: '#10b981' },
      { label: 'CPU Under Load', range: '60–85°C', status: 'Normal', color: '#10b981' },
      { label: 'CPU Thermal Throttle', range: '95°C+', status: 'Critical', color: '#ef4444' },
      { label: 'GPU Idle', range: '35–55°C', status: 'OK', color: '#10b981' },
      { label: 'GPU Under Load', range: '65–85°C', status: 'Normal', color: '#10b981' },
      { label: 'HDD Operating', range: '30–45°C', status: 'OK', color: '#10b981' },
      { label: 'SSD (NVMe) Operating', range: '40–70°C', status: 'Normal', color: '#f59e0b' },
    ]
  },
  {
    title: 'Thermal Paste Replacement Procedure',
    steps: [
      'Power off and unplug the PC. Ground yourself by touching the PSU chassis.',
      'Unscrew the CPU cooler mounting bracket and gently twist & lift the cooler off.',
      'Wipe off old thermal compound from both the CPU IHS and cooler base using 90%+ isopropyl alcohol and a lint-free cloth.',
      'Apply a pea-sized dot (about 4mm) of thermal paste to the center of the CPU.',
      'Remount the cooler in a diagonal pattern (tighten opposite corner screws) to spread paste evenly.',
      'Boot and verify temperatures have dropped by checking HWiNFO64 under full CPU load (run Prime95 for 5 minutes).'
    ]
  }
]

export default function Troubleshooting() {
  const [activeTab, setActiveTab] = useState<'methodology' | 'post' | 'beeps' | 'symptoms' | 'tools' | 'symptomchecker' | 'maintenance' | 'cmd' | 'bsod' | 'thermal'>('methodology')
  const [checkerNode, setCheckerNode] = useState<string>('root')
  const [checkerHistory, setCheckerHistory] = useState<string[]>([])
  const [checkerResult, setCheckerResult] = useState<string | null>(null)
  const [cmdCategory, setCmdCategory] = useState<string>('All')
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [selectedBios, setSelectedBios] = useState<string>('ALL')

  const filteredBeeps = selectedBios === 'ALL'
    ? beepCodes
    : beepCodes.filter(b => b.bios === selectedBios)

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-amber" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>DIAGNOSTIC TELEMETRY // MODULE 04 // COMPTIA A+ &amp; TESDA STANDARD</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-amber">Troubleshooting &amp; Diagnostics</span>
          </h1>

          <p className="tech-page-desc">
            Rigorous 7-step hardware troubleshooting methodologies, Power-On Self-Test (POST) sequencing,
            BIOS beep code analyzers, BSOD triage matrices, and preventive maintenance protocols.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <Activity size={14} color="#f59e0b" />
              <span>Methodology: <strong>7-Step CompTIA Model</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Volume2 size={14} color="#38bdf8" />
              <span>BIOS Decoders: <strong>AMI, Award &amp; Phoenix</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <ShieldAlert size={14} color="#10b981" />
              <span>POST Port: <strong>0x80 Hex Decoder</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Dropdown */}
        <div className="tech-dropdown-container" style={{ marginBottom: '32px', position: 'relative' }}>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as 'methodology' | 'post' | 'beeps' | 'symptoms' | 'tools')}
            className="tech-dropdown"
          >
            <option value="methodology">1. 7-Step Diagnostic SOP</option>
            <option value="post">2. POST Boot Sequence</option>
            <option value="beeps">3. POST Beep Decoder Matrix</option>
            <option value="symptoms">4. Common Symptoms & Fixes</option>
            <option value="tools">5. Software Diagnostic Utilities</option>
            <option value="symptomchecker">6. Interactive Symptom Checker</option>
            <option value="maintenance">7. Preventive Maintenance Checklist</option>
            <option value="cmd">8. Windows CMD Quick Reference</option>
            <option value="bsod">9. BSOD Stop Code Decoder</option>
            <option value="thermal">10. Thermal Management Guide</option>
          </select>
        </div>

        {/* TAB 1: Diagnostic Methodology */}
        {activeTab === 'methodology' && (
          <div>
            <div className="tech-callout amber">
              <div className="tech-callout-text">
                <strong>Standard Technician Principle:</strong> Always execute troubleshooting chronologically from Step 1 to Step 7. 
                Never apply random hardware modifications without first establishing a theory and recording test baselines.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {diagnosticSteps.map(s => (
                <div key={s.step} className="tech-step-card">
                  <div className="tech-step-index" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
                    0{s.step}
                  </div>
                  <div className="tech-step-content" style={{ flex: 1 }}>
                    <h4>Step {s.step}: {s.title}</h4>
                    <p>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: POST Boot Sequence */}
        {activeTab === 'post' && (
          <div>
            <div className="tech-card-dark" style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '8px' }}>
                Power-On Self-Test (POST) Phase Architecture
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                POST executes in microcode prior to operating system initialization. If any critical component (CPU, RAM, GPU) fails to report, execution halts and yields an audio beep or Port 0x80 error.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {postSequence.map(p => (
                <div key={p.step} className="tech-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                      PHASE {p.step}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Beep Code Matrix */}
        {activeTab === 'beeps' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'AMI', 'Award', 'Phoenix'].map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBios(b)}
                    className={`tech-tab-btn ${selectedBios === b ? 'active-amber' : ''}`}
                    style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                  >
                    {b === 'ALL' ? 'All BIOS Vendors' : b}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
                {filteredBeeps.length} Beep Pattern Codes
              </span>
            </div>

            <div className="tech-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>BIOS Firmware</th>
                    <th>Beep Pattern</th>
                    <th>Diagnosis / Hardware Fault</th>
                    <th>Subsystem Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeeps.map((b, idx) => (
                    <tr key={idx}>
                      <td><span className="tech-badge tech-badge-indigo">{b.bios}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Volume2 size={14} color={b.color} />
                          <code style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.beeps}</code>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{b.meaning}</td>
                      <td>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: 3,
                          background: `${b.color}15`,
                          color: b.color,
                          border: `1px solid ${b.color}40`,
                          fontWeight: 600
                        }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Symptoms & Fixes */}
        {activeTab === 'symptoms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {commonProblems.map((p, idx) => (
              <div key={idx} className="tech-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: 8 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} color="#d97706" />
                    {p.symptom}
                  </h4>
                  <span className={`tech-badge ${p.severity === 'Critical' ? 'tech-badge-amber' : 'tech-badge-blue'}`}>
                    {p.severity} Severity
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', background: '#f8fafc', padding: '14px 16px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Likely Causes
                    </span>
                    <p style={{ fontSize: '0.84rem', color: '#334155', margin: 0 }}>
                      {p.causes}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#059669', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                      Field Fix Protocol
                    </span>
                    <p style={{ fontSize: '0.84rem', color: '#0f172a', margin: 0, fontWeight: 500 }}>
                      {p.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: Software Tools */}
        {activeTab === 'tools' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {diagnosticTools.map(t => (
              <div key={t.name} className="tech-card">
                <div className="tech-card-header">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {t.name}
                  </span>
                  <span className="tech-badge tech-badge-blue">{t.type}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.55 }}>
                  {t.use}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: Interactive Symptom Checker */}
        {activeTab === 'symptomchecker' && (() => {
          const node = symptomTree[checkerNode]
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Breadcrumb trail */}
              {checkerHistory.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setCheckerNode('root'); setCheckerHistory([]); setCheckerResult(null) }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '4px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', color: '#475569' }}
                  >
                    Start Over
                  </button>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({checkerHistory.length} step{checkerHistory.length > 1 ? 's' : ''} taken)</span>
                </div>
              )}

              {checkerResult ? (
                <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginBottom: '8px' }}>DIAGNOSIS COMPLETE</div>
                  <h3 style={{ margin: '0 0 12px 0', color: '#15803d' }}>Recommended Action:</h3>
                  <p style={{ margin: '0 0 20px 0', color: '#166534', lineHeight: 1.7, fontSize: '0.92rem' }}>{checkerResult}</p>
                  <button
                    onClick={() => { setCheckerNode('root'); setCheckerHistory([]); setCheckerResult(null) }}
                    style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
                  >
                    Diagnose Another Problem
                  </button>
                </div>
              ) : (
                <div className="tech-card" style={{ padding: '28px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginBottom: '12px' }}>DIAGNOSTIC DECISION TREE</div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.15rem', color: '#0f172a' }}>{node.question}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {node.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (opt.result) {
                            setCheckerResult(opt.result)
                          } else if (opt.next) {
                            setCheckerHistory(h => [...h, checkerNode])
                            setCheckerNode(opt.next!)
                          }
                        }}
                        style={{
                          textAlign: 'left', padding: '14px 18px', background: '#f8fafc',
                          border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer',
                          fontSize: '0.9rem', color: '#0f172a', fontWeight: 500,
                          transition: 'border-color 0.15s, background 0.15s'
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#f59e0b'; (e.currentTarget as HTMLButtonElement).style.background = '#fffbeb' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* TAB 7: Preventive Maintenance Checklist */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="tech-callout amber">
              <div className="tech-callout-text">
                <strong>Technician Note:</strong> Preventive maintenance reduces hardware failure rates by up to 70%. Click each task to mark it complete.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {maintenanceTasks.map((t, idx) => {
                const done = completedTasks.has(idx)
                return (
                  <div
                    key={idx}
                    onClick={() => setCompletedTasks(prev => { const n = new Set(prev); done ? n.delete(idx) : n.add(idx); return n })}
                    style={{
                      display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 20px',
                      background: done ? '#f0fdf4' : '#fff', border: `1px solid ${done ? '#86efac' : '#e2e8f0'}`,
                      borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '22px', height: '22px', flexShrink: 0, borderRadius: '4px',
                      border: `2px solid ${done ? '#16a34a' : '#cbd5e1'}`,
                      background: done ? '#16a34a' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                    }}>
                      {done && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '1px 8px', borderRadius: '10px', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                          {t.interval}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: done ? '#15803d' : '#0f172a', textDecoration: done ? 'line-through' : 'none' }}>
                          {t.task}
                        </strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>{t.why}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
              {completedTasks.size} / {maintenanceTasks.length} tasks completed
            </div>
          </div>
        )}

        {/* TAB 8: CMD Quick Reference */}
        {activeTab === 'cmd' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Network', 'System', 'Disk', 'Hardware'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCmdCategory(cat)}
                  className={`tech-tab-btn ${cmdCategory === cat ? 'active-amber' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 14px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="tech-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Command</th>
                    <th style={{ width: '12%' }}>Category</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {cmdCommands.filter(c => cmdCategory === 'All' || c.category === cmdCategory).map((c, i) => (
                    <tr key={i}>
                      <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{c.cmd}</code></td>
                      <td><span className="tech-badge tech-badge-indigo" style={{ fontSize: '0.65rem' }}>{c.category}</span></td>
                      <td style={{ fontSize: '0.84rem', color: '#334155' }}>{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: BSOD Stop Code Decoder */}
        {activeTab === 'bsod' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="tech-callout amber">
              <div className="tech-callout-text">
                <strong>Pro Tip:</strong> Open <code>C:\Windows\Minidump</code> and load the .dmp file in <strong>WinDbg</strong> (free from Microsoft Store) to get the exact faulting driver name for any BSOD.
              </div>
            </div>
            {bsodCodes.map((b, i) => (
              <div key={i} className="tech-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '10px' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>{b.code}</code>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{b.name}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', background: '#f8fafc', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Cause</span>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155' }}>{b.cause}</p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#059669', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Fix</span>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#0f172a', fontWeight: 500 }}>{b.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 10: Thermal Management Guide */}
        {activeTab === 'thermal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Normal Operating Temperature Ranges</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Component Temperature Reference</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {thermalGuide[0].items!.map((item, i) => (
                    <div key={i} style={{ padding: '14px 16px', background: '#f8fafc', border: `1px solid ${item.color}40`, borderLeft: `4px solid ${item.color}`, borderRadius: '4px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.range}</div>
                      <div style={{ fontSize: '0.72rem', color: item.color, fontWeight: 600, marginTop: '2px' }}>{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="frame">
              <div className="frame-inner">
                <span className="label">Standard Operating Procedure</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Thermal Paste Replacement (6 Steps)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {thermalGuide[1].steps!.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ width: '36px', height: '36px', flexShrink: 0, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        0{i + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.6, paddingTop: '6px' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-dark">
              <div className="label" style={{ color: 'var(--mist)', marginBottom: '8px' }}>Key Insight — Thermal Throttling</div>
              <h3 style={{ color: 'var(--paper)', marginBottom: '10px' }}>Why Overheating Slows Your PC</h3>
              <p style={{ color: 'var(--mist)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                When a CPU reaches its <strong>TjMax temperature</strong> (typically 95–105°C), it automatically reduces its clock speed to generate less heat. This is called <strong>thermal throttling</strong>. A PC that feels slow or laggy under load is very often a cooling problem, not a CPU or RAM problem. Always check temperatures before recommending a hardware upgrade.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
