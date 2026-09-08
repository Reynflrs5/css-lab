const diagnosticSteps = [
  { title: 'Identify the Problem', detail: 'Gather information: what changed? When did it start? Is it reproducible? Check user reports, error messages, and event logs.' },
  { title: 'Establish a Theory of Probable Cause', detail: 'List the most likely causes from simplest to most complex. Consider hardware, software, and configuration factors.' },
  { title: 'Test the Theory', detail: 'Perform targeted tests to confirm or eliminate each theory. Use divide-and-conquer: isolate subsystems (swap RAM, unplug GPU, boot to USB).' },
  { title: 'Establish a Plan of Action', detail: 'Once the cause is identified, determine the fix. Consider impact, required tools, replacement parts, and downtime.' },
  { title: 'Implement the Solution', detail: 'Apply the fix systematically. Document every change made during the process.' },
  { title: 'Verify Full System Functionality', detail: 'Test all affected functions — not just the reported symptom. Confirm the issue is fully resolved and no regressions introduced.' },
  { title: 'Document Findings', detail: 'Record the problem, root cause, solution, and time taken. Builds a knowledge base for future troubleshooting.' },
]

const postSequence = [
  { step: 'Power On', desc: 'PSU sends PWR_GOOD signal to motherboard; CPU resets.' },
  { step: 'CPU Initializes', desc: 'CPU loads BIOS/UEFI firmware from ROM chip.' },
  { step: 'POST Begins', desc: 'BIOS tests CPU registers, memory controller, and system timer.' },
  { step: 'Memory Test', desc: 'RAM is sized and tested for errors.' },
  { step: 'Hardware Enumeration', desc: 'BIOS detects storage, GPU, USB controllers, and other devices.' },
  { step: 'BIOS POST Code', desc: 'Diagnostic codes written to port 0x80; displayed on POST card or debug LED.' },
  { step: 'Boot Device Search', desc: 'BIOS reads boot order, loads MBR/GPT from boot device.' },
  { step: 'OS Handoff', desc: 'Control transferred to the OS bootloader (GRUB, Windows Boot Manager).' },
]

const beepCodes = [
  { bios: 'AMI', beeps: '1 short',          meaning: 'POST passed — system OK' },
  { bios: 'AMI', beeps: '3 long',            meaning: 'Conventional/extended memory failure' },
  { bios: 'AMI', beeps: '5 short',           meaning: 'CPU / CPU board failure' },
  { bios: 'AMI', beeps: '7 short',           meaning: 'Virtual mode exception error' },
  { bios: 'AMI', beeps: '8 short',           meaning: 'Display memory failure' },
  { bios: 'AMI', beeps: '11 short',          meaning: 'Cache memory bad' },
  { bios: 'Award', beeps: '1 long, 2 short', meaning: 'Video card / GPU error' },
  { bios: 'Award', beeps: '1 long, 3 short', meaning: 'Video card failure' },
  { bios: 'Award', beeps: 'Continuous',      meaning: 'RAM not detected or seated improperly' },
  { bios: 'Phoenix', beeps: '1-1-3',         meaning: 'CMOS write/read failure' },
  { bios: 'Phoenix', beeps: '1-3-1',         meaning: 'RAM refresh failure' },
  { bios: 'Phoenix', beeps: '3-3-4',         meaning: 'Video card failure' },
]

const commonProblems = [
  { symptom: 'No display / black screen', causes: 'Unseated GPU or RAM, faulty monitor cable, bad GPU, BIOS crash', fix: 'Reseat GPU and RAM, test with onboard graphics, clear CMOS' },
  { symptom: 'System won\'t power on', causes: 'Dead PSU, failed power button header, bad outlet, CPU overcurrent', fix: 'Test PSU with paperclip test, check 24-pin + 8-pin connections, try wall outlet' },
  { symptom: 'Freezes / random restarts', causes: 'Overheating, bad RAM, corrupted OS, driver conflict', fix: 'Monitor CPU/GPU temps, run MemTest86, check Event Viewer, update drivers' },
  { symptom: 'Slow performance', causes: 'HDD near failure, malware, thermal throttling, RAM leak', fix: 'CrystalDiskInfo for HDD, AV scan, clean cooler, Task Manager check' },
  { symptom: 'Blue Screen of Death (BSOD)', causes: 'Driver error, RAM failure, overclocking instability, corrupt OS files', fix: 'Note stop code, run sfc /scannow, test RAM, roll back drivers' },
  { symptom: 'Network not detected', causes: 'Loose cable, disabled NIC, wrong driver, DHCP failure', fix: 'Check cable, enable NIC in Device Manager, reinstall driver, ipconfig /release /renew' },
]

const maintenanceTasks = [
  { interval: 'Monthly', task: 'Clear dust from case vents and fan blades using compressed air' },
  { interval: 'Monthly', task: 'Check for and install OS security updates' },
  { interval: 'Quarterly', task: 'Run full disk scan (chkdsk, CrystalDiskInfo S.M.A.R.T. check)' },
  { interval: 'Quarterly', task: 'Clean keyboard and mouse; inspect cables for wear' },
  { interval: 'Annually', task: 'Replace thermal paste on CPU (and GPU if temperatures are high)' },
  { interval: 'Annually', task: 'Verify backup integrity; rotate backup media' },
  { interval: 'As needed', task: 'Replace CMOS battery if system loses time or BIOS resets' },
]

export default function Troubleshooting() {
  return (
    <main className="page">
      <div className="container">
        <span className="tag" style={{ marginBottom: '16px' }}>Module 04</span>
        <h1 style={{ marginTop: '8px', marginBottom: '8px' }}>Troubleshooting & Maintenance</h1>
        <p>Systematic diagnostic methodology, POST sequence, beep codes, and preventive maintenance.</p>
        <hr className="rule-heavy" />

        {/* Diagnostic Method */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>01 — Diagnostic Methodology</h2>
          <div className="callout" style={{ marginBottom: '20px' }}>
            <span className="label">CompTIA A+ Standard</span>
            The 7-step troubleshooting methodology is the industry standard approach — always follow it in order.
          </div>
          <ol className="dim-list">
            {diagnosticSteps.map((s, i) => (
              <li key={i}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{s.title}</div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* POST Sequence */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>02 — POST Sequence</h2>
          <p style={{ marginBottom: '16px' }}>Power-On Self-Test (POST) runs every time the computer starts. Understanding the sequence helps isolate boot failures.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--line)' }}>
            {postSequence.map((p, i) => (
              <div key={i} className="step-block" style={{ background: 'var(--paper)', margin: 0, padding: '14px 16px', borderBottom: 'none' }}>
                <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-body">
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{p.step}</h4>
                  <p style={{ fontSize: '0.83rem', margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Beep Codes */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>03 — POST Beep Codes</h2>
          <p style={{ marginBottom: '16px' }}>When POST fails, the BIOS emits beep codes through the PC speaker to indicate the faulty component.</p>
          <table className="beep-table">
            <thead>
              <tr>
                <th>BIOS Make</th>
                <th>Beep Pattern</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {beepCodes.map((b, i) => (
                <tr key={i}>
                  <td><span className="mono">{b.bios}</span></td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{b.beeps}</span></td>
                  <td>{b.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Common Problems */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>04 — Common Problems & Fixes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {commonProblems.map((p, i) => (
              <div key={i} className="panel">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Symptom</span>
                    <strong style={{ fontSize: '0.9rem' }}>{p.symptom}</strong>
                    <span className="label" style={{ display: 'block', marginTop: '10px', marginBottom: '4px' }}>Likely Causes</span>
                    <p style={{ fontSize: '0.82rem', margin: 0 }}>{p.causes}</p>
                  </div>
                  <div>
                    <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Recommended Fix</span>
                    <p style={{ fontSize: '0.82rem', margin: 0 }}>{p.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preventive Maintenance */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>05 — Preventive Maintenance Schedule</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th>Interval</th>
                <th>Task</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceTasks.map((m, i) => (
                <tr key={i}>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{m.interval}</span></td>
                  <td>{m.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Diagnostic Tools */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>06 — Diagnostic Software Tools</h2>
          <div className="grid-2">
            {[
              { name: 'MemTest86', purpose: 'RAM testing — boots from USB, independent of OS' },
              { name: 'CrystalDiskInfo', purpose: 'HDD/SSD S.M.A.R.T. health monitoring' },
              { name: 'HWiNFO64', purpose: 'Real-time hardware sensor monitoring (temps, voltages)' },
              { name: 'CPU-Z / GPU-Z', purpose: 'Detailed CPU and GPU specification readout' },
              { name: 'Windows Event Viewer', purpose: 'System and application error logs (eventvwr.msc)' },
              { name: 'sfc /scannow', purpose: 'System File Checker — repairs corrupt Windows files' },
              { name: 'chkdsk /f /r', purpose: 'Check and repair disk errors and bad sectors' },
              { name: 'Wireshark', purpose: 'Network packet capture and protocol analysis' },
            ].map(t => (
              <div key={t.name} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: '1px dashed var(--line)' }}>
                <code style={{ minWidth: '140px', fontSize: '0.78rem', alignSelf: 'flex-start' }}>{t.name}</code>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>{t.purpose}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
