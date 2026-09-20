import { useState } from 'react'
import '../styles/server-diagram.css'
import PcDiagram from './PcDiagram'

interface SComp {
  id: string
  name: string
  shortName: string
  category: string
  color: string
  description: string
  functionText: string
  examples: string[]
  specs: { label: string; value: string }[]
}

const COMPS: SComp[] = [
  {
    id: 'server-chassis',
    name: 'Server Chassis / Case',
    shortName: 'CHASSIS',
    category: 'Enclosure',
    color: '#64748b',
    description: 'The 2U rackmount enclosure that houses and protects all internal server components.',
    functionText: 'Provides structural integrity, organized cable routing, and proper front-to-rear airflow channels. Hot-swap bays on the front let drives be replaced without powering down. Rack ears mount the server in a standard 19" equipment rack.',
    examples: ['Dell PowerEdge R740 2U Chassis', 'HP ProLiant DL380 Gen10 Gen10', 'Supermicro 2U CSE-827'],
    specs: [
      { label: 'Form Factor', value: '2U Rackmount' },
      { label: 'Height', value: '88.9 mm (3.5 in)' },
      { label: 'Drive Bays', value: '8× Hot-Swap 3.5" / 2.5"' },
      { label: 'Material', value: 'Cold-rolled steel + aluminum' },
      { label: 'Rack Width', value: 'Standard 19" EIA-310' },
    ],
  },
  {
    id: 'server-cpu',
    name: 'CPU / Processor',
    shortName: 'CPU',
    category: 'Processing',
    color: '#ef4444',
    description: 'Dual-socket enterprise-class CPUs that execute all server instructions and computations.',
    functionText: 'Server CPUs support multi-socket configurations, much larger L3 caches, and more PCIe lanes than desktop chips. They also support ECC memory and are designed for 24/7 continuous operation. NUMA (Non-Uniform Memory Access) topology links each socket to its own local RAM bank for efficiency.',
    examples: ['Intel Xeon Gold 6338 (32-core)', 'AMD EPYC 7763 (64-core)', 'Intel Xeon Platinum 8380 (40-core)'],
    specs: [
      { label: 'Sockets', value: '2× (Dual-socket board)' },
      { label: 'Cores', value: '16–96 cores per socket' },
      { label: 'L3 Cache', value: 'Up to 256MB' },
      { label: 'TDP', value: '120W – 280W' },
      { label: 'PCIe Lanes', value: '64–128 per socket' },
    ],
  },
  {
    id: 'server-ram',
    name: 'RAM / Memory (ECC RDIMM)',
    shortName: 'ECC RAM',
    category: 'Memory',
    color: '#a855f7',
    description: 'Registered ECC DDR4/DDR5 memory modules that store all actively running data and OS processes.',
    functionText: 'ECC (Error Correcting Code) automatically detects and corrects single-bit memory errors — critical for server uptime. Registered (buffered) DIMMs allow far more sticks per memory channel than standard desktop RAM. A typical 2-socket server can support 16–32 DIMM slots totaling several terabytes of RAM.',
    examples: ['Samsung 64GB DDR4-3200 RDIMM ECC', 'Micron 128GB DDR5-4800 3DS RDIMM', 'SK Hynix 32GB RDIMM ECC'],
    specs: [
      { label: 'Type', value: 'DDR4 / DDR5 RDIMM ECC' },
      { label: 'Per-DIMM', value: '16GB – 256GB' },
      { label: 'DIMM Slots', value: '16–32 total' },
      { label: 'Speed', value: '3200 – 4800 MT/s' },
      { label: 'Error Correction', value: 'ECC (SECDED)' },
    ],
  },
  {
    id: 'server-mobo',
    name: 'Motherboard (SSI-EEB)',
    shortName: 'MOTHERBOARD',
    category: 'Interconnect',
    color: '#22c55e',
    description: 'The SSI-EEB form factor server board that interconnects all components via high-speed buses.',
    functionText: 'Server motherboards support dual-CPU sockets, dozens of DIMM slots, and multiple PCIe slots. They also integrate a Baseboard Management Controller (BMC/IPMI) for out-of-band management. The chipset manages I/O lanes between the CPU(s), PCIe devices, and SATA/SAS controllers.',
    examples: ['Supermicro X12DPi-N6', 'ASUS Pro WS C621E SAGE', 'Gigabyte MZ72-HB0'],
    specs: [
      { label: 'Form Factor', value: 'SSI-EEB (305 × 330 mm)' },
      { label: 'CPU Support', value: 'Dual-socket LGA4189 / SP3' },
      { label: 'Memory Slots', value: '16–32 DIMM slots' },
      { label: 'PCIe Slots', value: '6–8 × PCIe 4.0/5.0' },
      { label: 'Management', value: 'Integrated BMC/IPMI 2.0' },
    ],
  },
  {
    id: 'server-storage',
    name: 'Storage (HDD / SSD)',
    shortName: 'STORAGE',
    category: 'Storage',
    color: '#10b981',
    description: 'Hot-swappable server drives in the front bays supporting SAS, SATA, or NVMe U.2 interfaces.',
    functionText: 'Server storage drives are purpose-built for 24/7 operation, higher sustained I/O rates, and longer endurance than desktop drives. Hot-swap allows drives to be physically replaced without shutting down the server. NVMe U.2 drives offer dramatically higher throughput than SAS/SATA for latency-sensitive workloads.',
    examples: ['Seagate Exos 16TB SAS 12Gb/s', 'Samsung PM9A3 U.2 NVMe 7.68TB', 'WD Gold 3.5" 14TB SATA 6Gb/s'],
    specs: [
      { label: 'Interface', value: 'SAS 12Gb/s / NVMe U.2 / SATA' },
      { label: 'HDD Capacity', value: '4TB – 24TB' },
      { label: 'SSD Capacity', value: '960GB – 32TB' },
      { label: 'HDD Speed', value: '7,200 RPM' },
      { label: 'Hot-Swap', value: 'Yes (no downtime needed)' },
    ],
  },
  {
    id: 'server-psu',
    name: 'Power Supply Unit (PSU)',
    shortName: 'PSU',
    category: 'Power',
    color: '#f59e0b',
    description: 'Redundant hot-swap PSU modules that deliver continuous, reliable power even if one unit fails.',
    functionText: 'A 1+1 redundant PSU config means two PSUs share the load. If one fails or is pulled for replacement, the other takes full load without interruption. Server PSUs achieve 80 PLUS Platinum/Titanium efficiency ratings to minimize waste heat. Each PSU connects to a separate AC circuit for true power redundancy.',
    examples: ['Delta DPS-800AB-1 800W', 'Artesyn CSU800AP 800W 80+ Platinum', 'FSP FSP1000-20ERN 1000W'],
    specs: [
      { label: 'Wattage', value: '750W – 3000W per unit' },
      { label: 'Efficiency', value: '80 PLUS Platinum/Titanium' },
      { label: 'Redundancy', value: '1+1 hot-swap' },
      { label: 'Input', value: '100–240V AC (auto-ranging)' },
      { label: 'Form Factor', value: '1U hot-plug module' },
    ],
  },
  {
    id: 'server-fans',
    name: 'Cooling Fans / Heatsink',
    shortName: 'COOLING',
    category: 'Thermal',
    color: '#06b6d4',
    description: 'High-speed redundant system fans and CPU heatsinks that maintain safe operating temperatures.',
    functionText: 'Server fans in the fan wall spin at 5,000–25,000 RPM — far faster than desktop fans — to move large volumes of air through the tightly packed chassis. The BMC dynamically controls fan speed via PWM based on thermal sensor readings across the board. N+1 fan redundancy means the server can lose one fan without overheating.',
    examples: ['Delta PFB0612EH 60mm 25,000 RPM', 'Nidec V60E12BS2A5-57', 'Dynatron A28 1U CPU Heatsink'],
    specs: [
      { label: 'Fan Size', value: '40mm / 60mm / 80mm' },
      { label: 'Max Speed', value: '5,000 – 25,000 RPM' },
      { label: 'Redundancy', value: 'N+1 redundant fan modules' },
      { label: 'Control', value: 'PWM via BMC thermal logic' },
      { label: 'Airflow Dir.', value: 'Front-to-rear' },
    ],
  },
  {
    id: 'server-nic',
    name: 'Network Interface Card (NIC)',
    shortName: 'NIC',
    category: 'Networking',
    color: '#3b82f6',
    description: 'A PCIe expansion card providing high-speed network connectivity (10GbE / 25GbE / 100GbE).',
    functionText: 'NICs connect the server to the data center network fabric. Modern server NICs support SR-IOV (Virtual Function offloading for VMs), RDMA (Remote Direct Memory Access for ultra-low latency), TCP Offload Engine (TOE), and hardware timestamping. InfiniBand NICs are used in HPC clusters for sub-microsecond latency.',
    examples: ['Mellanox ConnectX-6 100GbE', 'Intel E810 25GbE', 'Broadcom NetXtreme E-Series 10GbE'],
    specs: [
      { label: 'Interface', value: 'PCIe 4.0 x16' },
      { label: 'Port Speed', value: '10 / 25 / 100 GbE' },
      { label: 'Ports', value: '2× SFP28 or QSFP28' },
      { label: 'Features', value: 'SR-IOV, RDMA, TSO' },
      { label: 'Standard', value: '802.3ae / 802.3ba' },
    ],
  },
  {
    id: 'server-raid',
    name: 'RAID Controller',
    shortName: 'RAID CTRL',
    category: 'Storage Control',
    color: '#f97316',
    description: 'A PCIe hardware controller that manages multiple drives as a redundant, fault-tolerant storage array.',
    functionText: 'Hardware RAID controllers have their own dedicated processor and cache memory (with a Battery Backup Unit/BBU). They implement RAID levels in hardware, offloading the CPU. The BBU protects cached write data during a power failure, flushing it to disk once power is restored. RAID 5/6 are common for balanced redundancy.',
    examples: ['Broadcom MegaRAID 9560-16i', 'Microsemi Adaptec SmartRAID 3200', 'Dell PERC H755'],
    specs: [
      { label: 'Interface', value: 'PCIe 4.0 x8' },
      { label: 'RAID Levels', value: '0, 1, 5, 6, 10, 50, 60' },
      { label: 'Cache', value: '4GB – 8GB DDRx + BBU' },
      { label: 'Drive Ports', value: '8–24× SAS 12Gb/s' },
      { label: 'Throughput', value: 'Up to 22 GB/s' },
    ],
  },
  {
    id: 'server-gpu',
    name: 'GPU / Accelerator Card',
    shortName: 'GPU',
    category: 'Acceleration',
    color: '#8b5cf6',
    description: 'A high-performance GPU card for AI/ML inference, scientific computing, or render workloads.',
    functionText: 'Server GPUs (also called compute accelerators) provide massive parallelism — thousands of CUDA or stream cores — for workloads like neural network training/inference, scientific simulations, and video transcoding. Unlike desktop GPUs, server GPUs use ECC memory and passive cooling (relying on the chassis fan wall).',
    examples: ['NVIDIA A100 80GB PCIe', 'NVIDIA H100 SXM5 80GB', 'AMD Instinct MI250 128GB'],
    specs: [
      { label: 'Interface', value: 'PCIe 4.0 x16' },
      { label: 'VRAM', value: '16GB – 80GB HBM2e/HBM3' },
      { label: 'FP32 Perf.', value: 'Up to 77.6 TFLOPS' },
      { label: 'Cooling', value: 'Passive (chassis fan wall)' },
      { label: 'TDP', value: '250W – 400W' },
    ],
  },
  {
    id: 'server-expansion',
    name: 'Expansion Cards (PCIe)',
    shortName: 'EXP CARDS',
    category: 'Expansion',
    color: '#ec4899',
    description: 'Additional PCIe expansion cards that extend server capabilities — HBAs, Fiber Channel, InfiniBand, crypto.',
    functionText: 'PCIe expansion slots allow workload-specific customization. HBAs (Host Bus Adapters) connect the server to SAN block storage. Fiber Channel cards connect to FC storage networks. InfiniBand HCAs are used for ultra-low-latency interconnects in HPC clusters. Hardware crypto accelerators offload TLS/SSL processing from the CPU.',
    examples: ['Emulex LPe35002 32Gb Fiber Channel HBA', 'Intel QuickAssist Crypto Accelerator', 'Mellanox HDR 200Gb InfiniBand HCA'],
    specs: [
      { label: 'Slot', value: 'PCIe 4.0 x4 / x8 / x16' },
      { label: 'Card Types', value: 'HBA, FC, IB, Crypto, FPGA' },
      { label: 'Bandwidth', value: 'Up to 64 GB/s (x16 Gen4)' },
      { label: 'Power', value: '25W – 75W per slot (+ aux)' },
    ],
  },
  {
    id: 'server-network-ports',
    name: 'Network Ports (Rear I/O)',
    shortName: 'NETWORK PORTS',
    category: 'Connectivity',
    color: '#14b8a6',
    description: 'Rear-panel ports for management (IPMI), data network (SFP+/RJ-45), USB, and video output.',
    functionText: 'The rear I/O panel aggregates all external connectivity. The dedicated 1GbE BMC management port allows out-of-band access independent of the host OS. USB ports enable local OS installation via flash drive. The VGA or display port allows local console access without KVM hardware.',
    examples: ['1GbE RJ-45 (IPMI/BMC)', '2× SFP28 25GbE (NIC)', '2× USB 3.0, 1× VGA'],
    specs: [
      { label: 'MGMT Port', value: '1× 1GbE RJ-45 (BMC/IPMI)' },
      { label: 'Data Ports', value: '2× SFP28 25GbE (via NIC)' },
      { label: 'USB', value: '2× USB 3.0 Type-A' },
      { label: 'Video', value: '1× VGA (1920×1200 max)' },
      { label: 'Serial', value: '1× DB-9 RS-232 (console)' },
    ],
  },
  {
    id: 'server-bmc',
    name: 'BMC / IPMI Controller',
    shortName: 'BMC / IPMI',
    category: 'Management',
    color: '#84cc16',
    description: 'An independent embedded microcontroller for out-of-band server management — always on when power is present.',
    functionText: 'The BMC operates entirely independently of the host CPU and OS. It monitors temperatures, fan speeds, voltages, and power consumption 24/7. It enables remote KVM-over-IP access, virtual media mounting, hardware inventory, event logs, and power on/off — even when the server OS is down or unresponsive, as long as the server is plugged into AC power.',
    examples: ['ASPEED AST2600 (common OEM BMC)', 'Dell iDRAC 9 Enterprise', 'HPE iLO 5', 'Supermicro IPMI 2.0'],
    specs: [
      { label: 'Standard', value: 'IPMI 2.0 + Redfish REST API' },
      { label: 'Network', value: 'Dedicated 1GbE LAN port' },
      { label: 'Features', value: 'KVM, vMedia, power ctrl' },
      { label: 'Power Source', value: '+5Vsb (standby, always-on)' },
      { label: 'Protocols', value: 'IPMI, SNMP, SMASH-CLP' },
    ],
  },
]

interface Props {
  selectedId?: string | null
  onSelect?: (id: string | null) => void
}

export default function ServerDiagram({ selectedId: extId, onSelect }: Props) {
  const [intId, setIntId] = useState<string | null>(null)
  const activeId = extId !== undefined ? extId : intId

  const select = (id: string) => {
    const next = activeId === id ? null : id
    setIntId(next)
    onSelect?.(next)
  }

  const showAll = () => {
    setIntId(null)
    onSelect?.(null)
  }

  const comp = COMPS.find(c => c.id === activeId)


  return (
    <div className="sd-root">
      {/* ── LEFT: Visual Diagram ─────────────────────────── */}
      <div className="sd-left" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sd-canvas-label">
          <span className="sd-canvas-title">Interactive Server Diagram</span>
          <span className="sd-canvas-sub">Click any component to inspect it</span>
        </div>

        <div className="sd-canvas" style={{ padding: 0, flex: 1, minHeight: '400px' }}>
          <PcDiagram 
            systemType="server" 
            selectedId={activeId || 'server-chassis'} 
            onSelect={select} 
            initialZoom={1.3}
            isFullscreen={false}
          />
        </div>

        {/* Show All / component index */}
        <div className="sd-bottom-bar">
          {activeId ? (
            <button className="sd-show-all-btn" onClick={showAll}>
              ↩ Show All Components
            </button>
          ) : (
            <div className="sd-component-chips">
              {COMPS.map(c => (
                <button
                  key={c.id}
                  className="sd-chip"
                  style={{ '--cc': c.color } as React.CSSProperties}
                  onClick={() => select(c.id)}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Info Panel ─────────────────────────────── */}
      <div className={`sd-info-panel${comp ? ' has-comp' : ''}`}>
        {comp ? (
          <div className="sd-info-content">
            <div className="sd-info-header" style={{ borderColor: comp.color }}>
              <div className="sd-info-cat" style={{ background: comp.color + '22', color: comp.color }}>
                {comp.category}
              </div>
              <h2 className="sd-info-name">{comp.name}</h2>
              <p className="sd-info-desc">{comp.description}</p>
            </div>

            <div className="sd-info-section">
              <h3 className="sd-info-section-title">Function</h3>
              <p className="sd-info-section-body">{comp.functionText}</p>
            </div>

            <div className="sd-info-section">
              <h3 className="sd-info-section-title">Technical Specs</h3>
              <div className="sd-specs-grid">
                {comp.specs.map(s => (
                  <div key={s.label} className="sd-spec-row">
                    <span className="sd-spec-key">{s.label}</span>
                    <span className="sd-spec-val">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sd-info-section">
              <h3 className="sd-info-section-title">Examples</h3>
              <ul className="sd-examples-list">
                {comp.examples.map(ex => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="sd-info-empty">
            <div className="sd-info-empty-graphic">
              <div className="sd-empty-server" />
            </div>
            <h3>Click a component to learn about it</h3>
            <p>Select any part of the server diagram on the left, or choose from the list below:</p>
            <div className="sd-comp-list">
              {COMPS.map(c => (
                <button
                  key={c.id}
                  className="sd-comp-list-item"
                  onClick={() => select(c.id)}
                  style={{ '--cc': c.color } as React.CSSProperties}
                >
                  <span className="sd-comp-list-dot" style={{ background: c.color }} />
                  <span className="sd-comp-list-name">{c.name}</span>
                  <span className="sd-comp-list-cat">{c.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
