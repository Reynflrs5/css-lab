import { useState } from 'react'
import AtlasExplorer from '../components/AtlasExplorer'
import { pcParts } from '../data/pcParts'
import '../styles/tech-pages.css'

type Tab = 'atlas' | 'builder' | 'compare' | 'assembly' | 'ports' | 'glossary'

// ── PC Builder Compatibility Data ─────────────────────────────
const builderOptions = {
  cpu: [
    { id: 'i5-12400', name: 'Intel Core i5-12400', socket: 'LGA1700', tdp: 65 },
    { id: 'i7-13700k', name: 'Intel Core i7-13700K', socket: 'LGA1700', tdp: 125 },
    { id: 'r5-5600', name: 'AMD Ryzen 5 5600', socket: 'AM4', tdp: 65 },
    { id: 'r7-7700x', name: 'AMD Ryzen 7 7700X', socket: 'AM5', tdp: 105 },
  ],
  motherboard: [
    { id: 'b660', name: 'MSI PRO B660M-A', socket: 'LGA1700', formFactor: 'Micro-ATX', ddrGen: 4 },
    { id: 'z790', name: 'ASUS ROG STRIX Z790-E', socket: 'LGA1700', formFactor: 'ATX', ddrGen: 5 },
    { id: 'b550', name: 'Gigabyte B550M DS3H', socket: 'AM4', formFactor: 'Micro-ATX', ddrGen: 4 },
    { id: 'x670', name: 'MSI MAG X670E Tomahawk', socket: 'AM5', formFactor: 'ATX', ddrGen: 5 },
  ],
  ram: [
    { id: 'ddr4-16', name: '16GB DDR4-3200', ddrGen: 4, capacity: 16, watt: 6 },
    { id: 'ddr4-32', name: '32GB DDR4-3600', ddrGen: 4, capacity: 32, watt: 9 },
    { id: 'ddr5-16', name: '16GB DDR5-5600', ddrGen: 5, capacity: 16, watt: 8 },
    { id: 'ddr5-32', name: '32GB DDR5-6000', ddrGen: 5, capacity: 32, watt: 12 },
  ],
  gpu: [
    { id: 'rtx3060', name: 'NVIDIA RTX 3060 12GB', watt: 170, pcieLanes: 16 },
    { id: 'rtx4070', name: 'NVIDIA RTX 4070 Super', watt: 220, pcieLanes: 16 },
    { id: 'rx6700xt', name: 'AMD RX 6700 XT', watt: 230, pcieLanes: 16 },
    { id: 'rx7900xt', name: 'AMD RX 7900 XT', watt: 315, pcieLanes: 16 },
  ],
  psu: [
    { id: '550w', name: '550W 80+ Bronze', watt: 550 },
    { id: '650w', name: '650W 80+ Gold', watt: 650 },
    { id: '750w', name: '750W 80+ Gold', watt: 750 },
    { id: '850w', name: '850W 80+ Platinum', watt: 850 },
  ],
}

// ── Assembly Order ─────────────────────────────────────────────
const assemblySteps = [
  { step: 1, title: 'Prepare the Case', detail: 'Remove both side panels. Install brass standoffs matching your motherboard form factor (ATX, mATX). Keep the tempered glass panel on a padded surface.' },
  { step: 2, title: 'Install CPU into Motherboard', detail: 'Lift the socket lever. Align the golden triangle on the CPU corner with the socket marker. Drop in without forcing. Close the lever.' },
  { step: 3, title: 'Install RAM', detail: 'Insert RAM in slots A2 and B2 (slots 2 & 4 from CPU socket) for dual-channel. Align the notch and press firmly until both latches click.' },
  { step: 4, title: 'Apply Thermal Paste & Mount Cooler', detail: 'Apply a pea-sized dot of thermal paste to the center of the CPU IHS. Lower the cooler straight down and fasten the mounting screws in a diagonal cross pattern.' },
  { step: 5, title: 'Install M.2 SSD', detail: 'Remove the M.2 heatsink. Insert the M.2 drive at 30 degrees, push flat, secure with the retaining screw or EZ-latch. Reattach the heatsink.' },
  { step: 6, title: 'Mount Motherboard in Case', detail: 'First press in the I/O shield. Lower the motherboard onto the standoffs. Fasten screws in a star pattern without over-tightening.' },
  { step: 7, title: 'Install PSU', detail: 'Orient PSU fan toward the bottom intake vent (if present). Slide into the PSU shroud and fasten 4 rear hex screws. Route all needed modular cables before closing.' },
  { step: 8, title: 'Install GPU', detail: 'Remove the expansion slot brackets. Press the GPU firmly into the primary PCIe x16 slot until the retention latch snaps. Fasten the bracket screws and connect PCIe power cables.' },
  { step: 9, title: 'Connect All Power Cables', detail: 'Attach: 24-pin ATX main power, 8-pin EPS CPU power (near top-left of board), PCIe GPU power, SATA power for HDD/SSD. Route cables behind the motherboard tray.' },
  { step: 10, title: 'Connect Front Panel Headers', detail: 'Plug PWR_SW, RESET_SW, HDD_LED (+/-), POWER_LED (+/-) into the FPANEL header block. LEDs are polarity-sensitive (colored wire = +). Refer to the motherboard manual for the exact pinout diagram.' },
  { step: 11, title: 'Install Case Fans & Cable Manage', detail: 'Mount front fans as intake, rear as exhaust. Connect to SYS_FAN headers. Use Velcro straps (not zip ties) to bundle cables neatly behind the tray.' },
  { step: 12, title: 'First Boot & BIOS Setup', detail: 'Connect the monitor to the GPU (not motherboard). Power on. Enter BIOS (Del/F2). Enable XMP/EXPO for RAM, set boot priority to your OS drive, and verify all components are detected.' },
]

// ── Ports & Connectors ────────────────────────────────────────
const ports = [
  { name: 'SATA III Data Cable', desc: '7-pin L-shaped keyed connector. Transfers data at 6 Gb/s. Connects motherboard to 2.5" SSD or 3.5" HDD.', where: 'Inside case', color: '#f97316' },
  { name: 'SATA Power (15-pin)', desc: '15-pin wide flat connector from PSU. Provides +12V (motor), +5V (controller), and +3.3V rails to HDDs and SSDs.', where: 'Inside case', color: '#f97316' },
  { name: '24-pin ATX Main Power', desc: 'Large 24-pin main power connector that provides multiple voltage rails from PSU to motherboard. Has a locking clip.', where: 'Inside case', color: '#f59e0b' },
  { name: '8-pin EPS 12V (CPU Power)', desc: 'Dedicated 12V CPU power connector near the top-left corner of the motherboard. Some high-end boards require 2 × 8-pin.', where: 'Inside case', color: '#f59e0b' },
  { name: 'PCIe 8-pin / 12VHPWR (GPU)', desc: 'Auxiliary power for the GPU. Older cards use 1-2 × 8-pin connectors; new PCIe 5.0 cards use a single 16-pin 12VHPWR connector.', where: 'Inside case', color: '#3b82f6' },
  { name: 'M.2 (2280) NVMe Slot', desc: 'Small edge connector on the motherboard accepting M.2 2280 cards at a 30-degree angle. Supports PCIe 4.0/5.0 x4 or SATA M.2 drives.', where: 'Motherboard', color: '#10b981' },
  { name: 'FPANEL (9-pin block)', desc: 'Intel-standard 9-pin front panel header connecting PWR_SW, RESET_SW, HDD_LED, and POWER_LED from the case to the board.', where: 'Motherboard', color: '#8b5cf6' },
  { name: 'USB 3.0 Internal (19-pin)', desc: 'Blue 19-pin keyed header connecting front-panel USB 3.0 Type-A ports to the motherboard.', where: 'Motherboard', color: '#8b5cf6' },
  { name: 'RJ-45 Ethernet Port', desc: '8-pin modular jack for wired LAN connection. Supports 1/2.5/10 GbE depending on the NIC chipset. Usually color-coded.', where: 'Rear I/O', color: '#06b6d4' },
  { name: 'DisplayPort 1.4a', desc: '20-pin video output on discrete GPU. Supports up to 4K@144Hz or 8K@60Hz. The primary cable for gaming monitors.', where: 'GPU Rear', color: '#6366f1' },
  { name: 'HDMI 2.1', desc: '19-pin audio+video output. Supports 4K@120Hz and 8K@60Hz. Common for TV connections and non-gaming monitors.', where: 'GPU Rear', color: '#6366f1' },
  { name: 'PWM 4-pin Fan Header', desc: '4-pin header on the motherboard for CPU_FAN, SYS_FAN connections. PWM (pin 4) allows the motherboard to control fan speed precisely.', where: 'Motherboard', color: '#06b6d4' },
]

// ── Spec Glossary ─────────────────────────────────────────────
const glossaryEntries = [
  { term: 'TDP (Thermal Design Power)', category: 'CPU/GPU', explanation: 'The maximum heat a cooling system must dissipate in watts. A CPU with 65W TDP needs a cooler rated for at least 65W. NOT the actual power consumption — it\'s the baseline the cooler must handle.' },
  { term: 'DDR5-5600 CL36', category: 'RAM', explanation: 'DDR5 = 5th-gen RAM type. 5600 = 5600 MT/s transfer speed. CL36 = Column Latency 36 cycles. Lower CL means less latency. Higher MT/s means more bandwidth. Both matter — a lower CL at a lower speed can be faster than high-speed with high latency.' },
  { term: 'PCIe 4.0 x16', category: 'GPU/Slots', explanation: 'PCIe = Peripheral Component Interconnect Express. 4.0 = 4th generation (double bandwidth of Gen 3.0). x16 = 16 data lanes. Each PCIe 4.0 lane moves 2 GB/s, so x16 = 32 GB/s of bandwidth — used for the GPU.' },
  { term: 'NVMe vs SATA', category: 'Storage', explanation: 'SATA III maxes out at 600 MB/s — fine for HDDs and SATA SSDs. NVMe uses PCIe lanes and can reach 7,000+ MB/s. NVMe is up to 12× faster. Both use the same M.2 form factor slot, but NVMe needs an NVMe-compatible M.2 slot.' },
  { term: '80+ Gold Efficiency', category: 'PSU', explanation: 'The 80 PLUS rating certifies how efficiently the PSU converts AC power to DC. Bronze = ≥82% efficient, Gold = ≥90%, Platinum = ≥92%, Titanium = ≥94%. Higher efficiency = less heat generated inside the PSU and lower electricity bills.' },
  { term: 'XMP / EXPO Profile', category: 'RAM', explanation: 'Factory-tuned overclocking profiles stored on the RAM\'s SPD chip. XMP (Intel eXtreme Memory Profile) or EXPO (AMD Extended Profiles for Overclocking) unlock the RAM\'s full advertised speed. Without enabling it in BIOS, DDR5-6000 RAM runs at default 4800 MT/s.' },
  { term: 'Dual Channel', category: 'RAM', explanation: 'Installing 2 identical RAM sticks in the correct paired slots (A2+B2) doubles the memory bandwidth. Single-channel vs dual-channel can mean up to 30% performance difference in CPU-integrated graphics and in memory-bandwidth-limited tasks like video editing.' },
  { term: 'Form Factor (ATX / mATX / ITX)', category: 'Motherboard/Case', explanation: 'Standardized physical sizes. ATX (305×244mm) has the most expansion slots. Micro-ATX (244×244mm) is smaller with fewer PCIe slots. Mini-ITX (170×170mm) is the most compact. The case must support the motherboard\'s form factor.' },
  { term: 'LGA vs AM4 vs AM5 Socket', category: 'CPU', explanation: 'The physical socket the CPU snaps into. Intel uses LGA (Land Grid Array) — the pins are on the motherboard socket. AMD uses PGA (AM4) or LGA-style (AM5) — earlier AMD CPUs had pins on the chip. Sockets are NOT cross-compatible between brands or generations.' },
  { term: 'PWM vs DC Fan Control', category: 'Cooling', explanation: 'DC (voltage control) slows fans by reducing voltage — less precise, fans can stall at low speeds. PWM (Pulse Width Modulation) rapidly switches the fan on/off at a fixed voltage — more precise, smoother speed curve, better low-RPM stability. Always use PWM for CPU fans.' },
  { term: 'POST (Power-On Self-Test)', category: 'BIOS', explanation: 'The first code the CPU runs before the OS loads. It checks that the CPU, RAM, GPU, and storage are all responding. If POST passes, you hear 1 short beep (AMI BIOS) and see the manufacturer logo. If POST fails, you get beep error codes or a debug LED code on the board.' },
]

export default function PcParts() {
  const [activeTab, setActiveTab] = useState<Tab>('atlas')

  // Builder state
  const [build, setBuild] = useState<Record<string, string>>({ cpu: '', motherboard: '', ram: '', gpu: '', psu: '' })

  // Compare state
  const [compareA, setCompareA] = useState<string>('cpu')
  const [compareB, setCompareB] = useState<string>('motherboard')

  // Assembly state
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set())

  // Ports filter
  const [portFilter, setPortFilter] = useState<string>('All')

  // Glossary filter
  const [glossarySearch, setGlossarySearch] = useState('')
  const [glossaryCategory, setGlossaryCategory] = useState('All')

  // ── Compatibility checks ──────────────────────────────────────
  const getCompatibilityIssues = () => {
    const issues: string[] = []
    const cpu = builderOptions.cpu.find(c => c.id === build.cpu)
    const mb = builderOptions.motherboard.find(m => m.id === build.motherboard)
    const ram = builderOptions.ram.find(r => r.id === build.ram)
    const gpu = builderOptions.gpu.find(g => g.id === build.gpu)
    const psu = builderOptions.psu.find(p => p.id === build.psu)

    if (cpu && mb && cpu.socket !== mb.socket)
      issues.push(`CPU socket (${cpu.socket}) does not match motherboard socket (${mb.socket}).`)
    if (mb && ram && mb.ddrGen !== ram.ddrGen)
      issues.push(`Motherboard supports DDR${mb.ddrGen} but selected RAM is DDR${ram.ddrGen}.`)

    const totalWatt = (cpu?.tdp ?? 0) + (gpu?.watt ?? 0) + (ram?.watt ?? 0) + 50 // 50W system overhead
    if (psu && totalWatt > psu.watt * 0.85)
      issues.push(`Estimated system load (~${totalWatt}W) exceeds 85% of PSU capacity (${psu.watt}W). Upgrade PSU.`)

    return { issues, totalWatt, cpu, mb, ram, gpu, psu }
  }

  const allSelected = Object.values(build).every(v => v !== '')
  const { issues, totalWatt, cpu, mb, ram, gpu, psu } = getCompatibilityIssues()

  // ── Helpers ──────────────────────────────────────────────────
  const partA = pcParts.find(p => p.id === compareA)
  const partB = pcParts.find(p => p.id === compareB)

  const tabBtnStyle = (t: Tab) => ({
    padding: '8px 18px', border: '1px solid', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
    background: activeTab === t ? '#0f172a' : '#f8fafc',
    color: activeTab === t ? '#fff' : '#475569',
    borderColor: activeTab === t ? '#0f172a' : '#e2e8f0',
  })

  if (activeTab === 'atlas') return (
    <div>
      <div style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: '#0f172a', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        {[
          { id: 'atlas', label: '3D Hardware Explorer' },
          { id: 'builder', label: 'PC Builder / Compatibility' },
          { id: 'compare', label: 'Part Comparison' },
          { id: 'assembly', label: 'Assembly Checklist' },
          { id: 'ports', label: 'Port & Connector ID' },
          { id: 'glossary', label: 'Specs Glossary' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} style={{
            padding: '6px 14px', border: '1px solid', borderRadius: '5px', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
            background: activeTab === t.id ? '#3b82f6' : 'rgba(255,255,255,0.07)',
            color: activeTab === t.id ? '#fff' : '#94a3b8',
            borderColor: activeTab === t.id ? '#3b82f6' : 'rgba(255,255,255,0.12)',
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <AtlasExplorer />
    </div>
  )

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* Sub-nav bar */}
      <div style={{ background: '#0f172a', padding: '12px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        {[
          { id: 'atlas', label: '3D Hardware Explorer' },
          { id: 'builder', label: 'PC Builder / Compatibility' },
          { id: 'compare', label: 'Part Comparison' },
          { id: 'assembly', label: 'Assembly Checklist' },
          { id: 'ports', label: 'Port & Connector ID' },
          { id: 'glossary', label: 'Specs Glossary' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} style={{
            padding: '6px 14px', border: '1px solid', borderRadius: '5px', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
            background: activeTab === t.id ? '#3b82f6' : 'rgba(255,255,255,0.07)',
            color: activeTab === t.id ? '#fff' : '#94a3b8',
            borderColor: activeTab === t.id ? '#3b82f6' : 'rgba(255,255,255,0.12)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '64px' }}>

        {/* ── TAB: PC BUILDER ────────────────────────────────────── */}
        {activeTab === 'builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">CSS NC II Competency — Component Selection</span>
                <h2 style={{ marginTop: '4px', marginBottom: '8px' }}>PC Builder & Compatibility Checker</h2>
                <p style={{ color: 'var(--graphite)', fontSize: '0.9rem', marginBottom: '28px', lineHeight: 1.6 }}>
                  Select parts for each component category. The checker will flag socket, DDR generation, and PSU wattage conflicts in real time.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {(['cpu', 'motherboard', 'ram', 'gpu', 'psu'] as const).map(key => (
                    <div key={key} style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <div className="label" style={{ marginBottom: '8px', textTransform: 'uppercase' }}>{key}</div>
                      <select
                        value={build[key]}
                        onChange={e => setBuild(prev => ({ ...prev, [key]: e.target.value }))}
                        className="tech-dropdown"
                        style={{ width: '100%', marginBottom: 0 }}
                      >
                        <option value="">-- Select {key.toUpperCase()} --</option>
                        {builderOptions[key].map((opt: any) => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {allSelected && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {issues.length === 0 ? (
                      <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginBottom: '6px' }}>COMPATIBILITY: PASS</div>
                        <strong style={{ color: '#15803d', fontSize: '1rem' }}>All components are compatible!</strong>
                        <p style={{ color: '#166534', fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                          Estimated system load: ~{totalWatt}W / {psu?.watt}W PSU ({Math.round(totalWatt / psu!.watt * 100)}% utilization)
                        </p>
                      </div>
                    ) : (
                      <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginBottom: '10px' }}>COMPATIBILITY: {issues.length} ISSUE{issues.length > 1 ? 'S' : ''} FOUND</div>
                        {issues.map((issue, i) => (
                          <div key={i} style={{ padding: '8px 12px', background: '#fff', borderLeft: '3px solid #ef4444', marginBottom: '8px', fontSize: '0.86rem', color: '#991b1b' }}>
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      {[
                        { label: 'CPU TDP', value: `${cpu?.tdp}W` },
                        { label: 'GPU TDP', value: `${gpu?.watt}W` },
                        { label: 'RAM Draw', value: `~${ram?.watt}W` },
                        { label: 'Estimated Total', value: `~${totalWatt}W` },
                        { label: 'PSU Capacity', value: `${psu?.watt}W` },
                        { label: 'Headroom', value: `${psu ? psu.watt - totalWatt : 0}W` },
                      ].map(stat => (
                        <div key={stat.label} style={{ padding: '12px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>{stat.label}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PART COMPARISON ───────────────────────────────── */}
        {activeTab === 'compare' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Side-by-Side Spec Analysis</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Part Comparison Mode</h2>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {(['A', 'B'] as const).map(side => (
                    <div key={side} style={{ flex: 1, minWidth: '220px' }}>
                      <div className="label" style={{ marginBottom: '6px' }}>Part {side}</div>
                      <select
                        value={side === 'A' ? compareA : compareB}
                        onChange={e => side === 'A' ? setCompareA(e.target.value) : setCompareB(e.target.value)}
                        className="tech-dropdown"
                        style={{ width: '100%', marginBottom: 0 }}
                      >
                        {pcParts.map(p => <option key={p.id} value={p.id}>{p.shortName}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {partA && partB && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      {[partA, partB].map((part, i) => (
                        <div key={i} style={{ padding: '16px', background: i === 0 ? '#eff6ff' : '#f0fdf4', border: `1px solid ${i === 0 ? '#93c5fd' : '#86efac'}`, borderRadius: '8px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: i === 0 ? '#1d4ed8' : '#16a34a', fontWeight: 700, marginBottom: '4px' }}>
                            Part {i === 0 ? 'A' : 'B'}
                          </div>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{part.name}</strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#475569' }}>⚡ {part.powerDraw}</span>
                            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#475569' }}>🌡 {part.temperature}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#1e293b', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
                        <span>SPECIFICATION</span><span>PART A</span><span>PART B</span>
                      </div>
                      {Array.from({ length: Math.max(partA.specs.length, partB.specs.length) }, (_, i) => {
                        const sA = partA.specs[i]
                        const sB = partB.specs[i]
                        return (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: i % 2 === 0 ? '#fff' : '#f8fafc', padding: '10px 14px', fontSize: '0.82rem', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#475569' }}>{sA?.label ?? sB?.label ?? '—'}</span>
                            <span style={{ color: '#0f172a' }}>{sA?.value ?? '—'}</span>
                            <span style={{ color: '#0f172a' }}>{sB?.value ?? '—'}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ASSEMBLY CHECKLIST ─────────────────────────────── */}
        {activeTab === 'assembly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="frame">
              <div className="frame-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <span className="label">CSS NC II Practical Task</span>
                    <h2 style={{ marginTop: '4px', marginBottom: '4px' }}>PC Assembly Order Checklist</h2>
                    <p style={{ color: 'var(--graphite)', fontSize: '0.88rem', margin: 0 }}>Click each step to mark it complete. Follow the order for a proper assembly.</p>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#64748b' }}>
                    {doneSteps.size} / {assemblySteps.length} completed
                  </div>
                </div>

                <div style={{ marginBottom: '12px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(doneSteps.size / assemblySteps.length) * 100}%`, background: '#10b981', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {assemblySteps.map((s, idx) => {
                    const done = doneSteps.has(idx)
                    return (
                      <div
                        key={idx}
                        onClick={() => setDoneSteps(prev => { const n = new Set(prev); done ? n.delete(idx) : n.add(idx); return n })}
                        style={{ display: 'flex', gap: '14px', padding: '14px 18px', background: done ? '#f0fdf4' : '#fff', border: `1px solid ${done ? '#86efac' : '#e2e8f0'}`, borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', alignItems: 'flex-start' }}
                      >
                        <div style={{ width: '20px', height: '20px', flexShrink: 0, borderRadius: '4px', border: `2px solid ${done ? '#16a34a' : '#cbd5e1'}`, background: done ? '#16a34a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                          {done && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '1px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                              Step {s.step.toString().padStart(2, '0')}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: done ? '#15803d' : '#0f172a', textDecoration: done ? 'line-through' : 'none' }}>{s.title}</strong>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.6 }}>{s.detail}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PORT IDENTIFIER ───────────────────────────────── */}
        {activeTab === 'ports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Physical Interface Reference</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>Port & Connector Identifier</h2>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {['All', 'Inside case', 'Motherboard', 'GPU Rear', 'Rear I/O'].map(f => (
                    <button key={f} type="button" onClick={() => setPortFilter(f)}
                      className={`tech-tab-btn ${portFilter === f ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '5px 14px' }}>
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {ports.filter(p => portFilter === 'All' || p.where === portFilter).map((port, i) => (
                    <div key={i} style={{ padding: '16px', background: '#f8fafc', border: `1px solid ${port.color}30`, borderLeft: `4px solid ${port.color}`, borderRadius: '6px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{port.name}</strong>
                        <span style={{ fontSize: '0.68rem', padding: '1px 8px', borderRadius: '10px', background: `${port.color}18`, color: port.color, fontWeight: 700 }}>{port.where}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.6 }}>{port.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SPECS GLOSSARY ────────────────────────────────── */}
        {activeTab === 'glossary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="frame">
              <div className="frame-inner">
                <span className="label">Terminology Reference — CSS NC II</span>
                <h2 style={{ marginTop: '4px', marginBottom: '20px' }}>PC Specs Glossary & Decoder</h2>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <input
                    type="search"
                    placeholder="Search terms..."
                    value={glossarySearch}
                    onChange={e => setGlossarySearch(e.target.value)}
                    style={{ flex: 1, minWidth: '180px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <select value={glossaryCategory} onChange={e => setGlossaryCategory(e.target.value)} className="tech-dropdown" style={{ marginBottom: 0, minWidth: '160px' }}>
                    <option value="All">All Categories</option>
                    {[...new Set(glossaryEntries.map(e => e.category))].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {glossaryEntries
                    .filter(e => (glossaryCategory === 'All' || e.category === glossaryCategory) && (glossarySearch === '' || e.term.toLowerCase().includes(glossarySearch.toLowerCase()) || e.explanation.toLowerCase().includes(glossarySearch.toLowerCase())))
                    .map((entry, i) => (
                      <div key={i} style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{entry.term}</strong>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '1px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', fontWeight: 700 }}>{entry.category}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.7 }}>{entry.explanation}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
