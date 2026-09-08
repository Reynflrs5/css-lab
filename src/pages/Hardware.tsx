const components = [
  { name: 'Motherboard (Mainboard)', desc: 'Central PCB that interconnects all components. Houses the CPU socket, RAM slots, expansion slots, and I/O controllers.' },
  { name: 'CPU (Central Processing Unit)', desc: 'Executes instructions. Identified by socket type (LGA/PGA), core count, clock speed, and TDP.' },
  { name: 'RAM (Random Access Memory)', desc: 'Volatile high-speed memory for active data. Identified by type (DDR4/DDR5), capacity (GB), and speed (MHz).' },
  { name: 'GPU (Graphics Card)', desc: 'Renders display output. Also used for GPGPU tasks. Connects via PCIe x16 slot.' },
  { name: 'PSU (Power Supply Unit)', desc: 'Converts AC to regulated DC. Rated in Watts with 80 PLUS efficiency certification.' },
  { name: 'Storage (SSD / HDD)', desc: 'Non-volatile data storage. NVMe SSDs connect via M.2; SATA devices use data + power cables.' },
  { name: 'Optical Drive (ODD)', desc: 'Reads/writes CD, DVD, Blu-ray. Increasingly rare in modern builds — replaced by USB flash drives.' },
  { name: 'Case / Chassis', desc: 'Houses and protects all components. Comes in ATX, Micro-ATX, and Mini-ITX form factors.' },
  { name: 'CPU Cooler', desc: 'Dissipates CPU heat via heatsink+fan or AIO liquid cooler. Thermal paste required between CPU and cooler.' },
]

const assemblySteps = [
  { title: 'ESD Precautions', detail: 'Ground yourself using an anti-static wrist strap or by touching the unpainted metal of the case. Work on a flat, non-carpeted surface.' },
  { title: 'Install CPU', detail: 'Align the CPU triangle marker with the socket marker. For Intel LGA: lower the retention arm. For AMD AM4/AM5: insert and lock the ZIF socket.' },
  { title: 'Apply Thermal Paste', detail: 'Apply a pea-sized dot (~0.1 g) of thermal compound at the center of the CPU IHS. The cooler will spread it upon mounting.' },
  { title: 'Mount CPU Cooler', detail: 'Align the cooler over the CPU and secure it with the mounting bracket. Connect the 4-pin PWM fan header to CPU_FAN on the motherboard.' },
  { title: 'Install RAM', detail: 'Open the DIMM slot latches. Align the RAM notch with the slot key. Press firmly until both latches click. Use A2+B2 slots for dual-channel (check manual).' },
  { title: 'Mount Motherboard in Case', detail: 'Install I/O shield first. Align mobo standoffs, then lower the board. Secure with the correct screws (do not over-torque).' },
  { title: 'Install PSU', detail: 'Slide PSU into the bottom (or top) bay. Secure with 4 screws. Route cables before attaching: 24-pin ATX, 8-pin EPS, PCIe power.' },
  { title: 'Install Storage', detail: 'For M.2 NVMe: insert at 30° into the slot, press down, and secure with the single screw. For SATA: connect both data (SATA cable) and power connector.' },
  { title: 'Install GPU', detail: 'Remove PCIe slot covers. Press GPU into the x16 slot until the latch clicks. Secure with screws. Connect 6+2 pin PCIe power cables.' },
  { title: 'Cable Management & Power-on Test', detail: 'Route cables through grommets, tie with velcro. Connect front-panel headers (PWR_SW, RESET_SW, HDD_LED, POWER_LED). Perform initial POST.' },
]

const disassemblySteps = [
  { title: 'Power Down & Unplug', detail: 'Shut down OS. Flip PSU switch off. Unplug AC cable from wall. Press power button once to discharge capacitors.' },
  { title: 'Open Case Panel', detail: 'Remove thumbscrews on the rear and slide the tempered glass or steel panel toward the back.' },
  { title: 'Disconnect Cables', detail: 'Label or photograph cable routing before unplugging. Remove 24-pin ATX, EPS, PCIe, SATA power, and all fan headers.' },
  { title: 'Remove GPU', detail: 'Press the PCIe latch down, pull the GPU straight up. Unscrew the PCIe slot bracket screws first.' },
  { title: 'Remove Storage', detail: 'Unscrew M.2 retention screw and angle the drive out. For SATA, disconnect cable and unscrew the drive tray.' },
  { title: 'Remove Cooler & CPU', detail: 'Loosen cooler screws in a diagonal cross pattern. Lift off cooler. Open CPU socket latch and lift CPU vertically — never drag.' },
  { title: 'Remove RAM', detail: 'Press both DIMM latches outward simultaneously. The stick will pop up — pull straight out.' },
  { title: 'Unmount Motherboard', detail: 'Remove all mobo screws, lift the board straight up to avoid bending PCIe slots or CPU socket pins.' },
]

export default function Hardware() {
  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <span className="tag" style={{ marginBottom: '16px' }}>Module 01</span>
        <h1 style={{ marginTop: '8px', marginBottom: '8px' }}>Computer Hardware</h1>
        <p>Component identification, assembly, and disassembly procedures for CSS NC II.</p>
        <hr className="rule-heavy" />

        {/* Component ID */}
        <section className="section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <h2>01 — Component Identification</h2>
          </div>
          <div className="callout" style={{ marginBottom: '20px' }}>
            <span className="label">Note</span>
            Always identify a component by its <strong>form factor</strong>, <strong>socket/interface type</strong>, and <strong>electrical rating</strong> before handling.
          </div>
          <div className="grid-2" style={{ gap: '1px', background: 'var(--line)', border: '1px solid var(--line)' }}>
            {components.map(c => (
              <div key={c.name} style={{ background: 'var(--paper)', padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>{c.name}</div>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Safety */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>02 — Tools & Safety</h2>
          <div className="grid-2">
            <div className="panel">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>Required Tools</span>
              <ul style={{ paddingLeft: 0 }}>
                {[
                  'Phillips #1 and #2 screwdrivers',
                  'Anti-static wrist strap',
                  'Tweezers (for small screws/headers)',
                  'Cable ties / velcro straps',
                  'Thermal paste + applicator',
                  'Compressed air can',
                  'Multimeter (for PSU testing)',
                ].map(t => (
                  <li key={t} style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)', fontSize: '0.875rem', color: 'var(--graphite)', display: 'flex', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--steel)', fontSize: '0.75rem' }}>▸</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>ESD & Safety Rules</span>
              <ul style={{ paddingLeft: 0 }}>
                {[
                  'Always wear anti-static wrist strap',
                  'Handle PCBs by edges only',
                  'Never touch IC pins or contacts',
                  'Discharge capacitors before servicing PSU',
                  'Work on flat, non-carpeted surface',
                  'Keep liquids away from workspace',
                  'Store components in anti-static bags',
                ].map(r => (
                  <li key={r} style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)', fontSize: '0.875rem', color: 'var(--graphite)', display: 'flex', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--steel)', fontSize: '0.75rem' }}>▸</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Assembly */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>03 — Assembly Procedure</h2>
          <div className="callout" style={{ marginBottom: '20px' }}>
            <span className="label">TESDA Competency</span>
            CSS NC II Unit of Competency: <strong>Install and Configure Computer Systems</strong>
          </div>
          <ol className="dim-list">
            {assemblySteps.map((s, i) => (
              <li key={i}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{s.title}</div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Disassembly */}
        <section className="section">
          <h2 style={{ marginBottom: '16px' }}>04 — Disassembly Procedure</h2>
          <ol className="dim-list">
            {disassemblySteps.map((s, i) => (
              <li key={i}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{s.title}</div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
