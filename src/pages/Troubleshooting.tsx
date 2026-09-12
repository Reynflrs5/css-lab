import { useState } from 'react'
import {
  Wrench,
  Activity,
  AlertTriangle,
  Volume2,
  Terminal,
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

export default function Troubleshooting() {
  const [activeTab, setActiveTab] = useState<'methodology' | 'post' | 'beeps' | 'symptoms' | 'tools'>('methodology')
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
        {/* Navigation Tabs */}
        <div className="tech-tab-strip">
          <button
            type="button"
            onClick={() => setActiveTab('methodology')}
            className={`tech-tab-btn ${activeTab === 'methodology' ? 'active-amber' : ''}`}
          >
            <Activity size={15} />
            1. 7-Step Diagnostic SOP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className={`tech-tab-btn ${activeTab === 'post' ? 'active-amber' : ''}`}
          >
            <Terminal size={15} />
            2. POST Boot Sequence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beeps')}
            className={`tech-tab-btn ${activeTab === 'beeps' ? 'active-amber' : ''}`}
          >
            <Volume2 size={15} />
            3. POST Beep Decoder Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('symptoms')}
            className={`tech-tab-btn ${activeTab === 'symptoms' ? 'active-amber' : ''}`}
          >
            <AlertTriangle size={15} />
            4. Common Symptoms &amp; Fixes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`tech-tab-btn ${activeTab === 'tools' ? 'active-amber' : ''}`}
          >
            <Wrench size={15} />
            5. Software Diagnostic Utilities
          </button>
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
      </div>
    </main>
  )
}
