import { useState, useMemo } from 'react'
import {
  Zap,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Activity,
  TrendingDown,
  Cable,
} from 'lucide-react'

/* ─── Data Model ──────────────────────────────────────────────────── */

type CatKey = 'Cat5e' | 'Cat6' | 'Cat6A' | 'Cat7' | 'Cat8'

interface SpeedTier {
  standard: string
  speedLabel: string
  speedMbps: number
  maxLengthM: number
  note: string
}

interface CableSpec {
  label: string
  bandwidthMHz: number
  shielded: boolean
  attenDbPer100m: number   // dB at rated frequency, per 100 m (TIA-568 max insertion loss)
  speedTiers: SpeedTier[]
  poeStandards: string[]
  maxPoEWatts: number
  constructionNote: string
}

const CABLE_DATA: Record<CatKey, CableSpec> = {
  'Cat5e': {
    label: 'Category 5e (Enhanced)',
    bandwidthMHz: 100,
    shielded: false,
    attenDbPer100m: 22.0,
    speedTiers: [
      { standard: '1000BASE-T',  speedLabel: '1 Gbps',    speedMbps: 1000,  maxLengthM: 100, note: 'Full Gigabit — standard LAN' },
      { standard: '100BASE-TX',  speedLabel: '100 Mbps',  speedMbps: 100,   maxLengthM: 100, note: 'Fast Ethernet — legacy fallback' },
      { standard: '10BASE-T',    speedLabel: '10 Mbps',   speedMbps: 10,    maxLengthM: 100, note: 'Legacy Ethernet' },
    ],
    poeStandards: ['PoE — 802.3af (15.4 W)', 'PoE+ — 802.3at (30 W)'],
    maxPoEWatts: 30,
    constructionNote: 'Unshielded Twisted Pair (UTP). 4 pairs, 24 AWG solid conductor. Most common in Philippine school and office LANs.',
  },
  'Cat6': {
    label: 'Category 6',
    bandwidthMHz: 250,
    shielded: false,
    attenDbPer100m: 19.8,
    speedTiers: [
      { standard: '10GBASE-T',   speedLabel: '10 Gbps',   speedMbps: 10000, maxLengthM: 55,  note: '10G limited to ≤55 m (EIA-568 note)' },
      { standard: '1000BASE-T',  speedLabel: '1 Gbps',    speedMbps: 1000,  maxLengthM: 100, note: 'Full Gigabit at 100 m' },
      { standard: '100BASE-TX',  speedLabel: '100 Mbps',  speedMbps: 100,   maxLengthM: 100, note: 'Fast Ethernet fallback' },
    ],
    poeStandards: ['PoE — 802.3af (15.4 W)', 'PoE+ — 802.3at (30 W)', 'PoE++ Type 3 — 802.3bt (60 W)'],
    maxPoEWatts: 60,
    constructionNote: 'UTP with internal spline separator to reduce crosstalk. Tighter twist rate than Cat5e. Backward compatible.',
  },
  'Cat6A': {
    label: 'Category 6A (Augmented)',
    bandwidthMHz: 500,
    shielded: false,
    attenDbPer100m: 20.7,
    speedTiers: [
      { standard: '10GBASE-T',   speedLabel: '10 Gbps',   speedMbps: 10000, maxLengthM: 100, note: 'Full 10G at 100 m — full channel' },
      { standard: '1000BASE-T',  speedLabel: '1 Gbps',    speedMbps: 1000,  maxLengthM: 100, note: 'Full Gigabit at 100 m' },
    ],
    poeStandards: ['PoE — 802.3af (15.4 W)', 'PoE+ — 802.3at (30 W)', 'PoE++ Type 3 — 802.3bt (60 W)', 'PoE++ Type 4 — 802.3bt (100 W)'],
    maxPoEWatts: 100,
    constructionNote: 'Available in UTP or F/UTP (foil-shielded). Larger cable diameter (~8 mm) vs Cat6. Required for APs and IP cameras drawing high PoE.',
  },
  'Cat7': {
    label: 'Category 7 (ISO/IEC 11801)',
    bandwidthMHz: 600,
    shielded: true,
    attenDbPer100m: 20.8,
    speedTiers: [
      { standard: '10GBASE-T',   speedLabel: '10 Gbps',   speedMbps: 10000, maxLengthM: 100, note: 'Fully shielded — excellent for noisy environments' },
      { standard: '1000BASE-T',  speedLabel: '1 Gbps',    speedMbps: 1000,  maxLengthM: 100, note: 'Gigabit with full shielding' },
    ],
    poeStandards: ['PoE — 802.3af (15.4 W)', 'PoE+ — 802.3at (30 W)', 'PoE++ Type 3 — 802.3bt (60 W)', 'PoE++ Type 4 — 802.3bt (100 W)'],
    maxPoEWatts: 100,
    constructionNote: 'S/FTP (shielded pairs + overall foil). Uses GG45 or TERA connector — NOT standard RJ45 compatible without adapter. Rarely used in PH.',
  },
  'Cat8': {
    label: 'Category 8 (IEEE 802.3bq)',
    bandwidthMHz: 2000,
    shielded: true,
    attenDbPer100m: 30.0,
    speedTiers: [
      { standard: '40GBASE-T',   speedLabel: '40 Gbps',   speedMbps: 40000, maxLengthM: 30,  note: '40G limited to 30 m — data center only' },
      { standard: '25GBASE-T',   speedLabel: '25 Gbps',   speedMbps: 25000, maxLengthM: 30,  note: '25G — top-of-rack switch connections' },
      { standard: '10GBASE-T',   speedLabel: '10 Gbps',   speedMbps: 10000, maxLengthM: 30,  note: '10G at 30 m' },
    ],
    poeStandards: ['PoE++ Type 4 — 802.3bt (100 W)'],
    maxPoEWatts: 100,
    constructionNote: 'S/FTP. Uses standard RJ45 (Cat8.1) or proprietary TERA (Cat8.2). Designed for short runs between switches in data centers. Very expensive.',
  },
}

/* ─── Helper Calculations ─────────────────────────────────────────── */

/**
 * Returns the best achievable speed at a given length for a cable category.
 */
function getBestSpeed(cat: CatKey, lengthM: number): SpeedTier | null {
  const tiers = CABLE_DATA[cat].speedTiers
  // Sort from fastest to slowest; pick first where maxLengthM >= lengthM
  const sorted = [...tiers].sort((a, b) => b.speedMbps - a.speedMbps)
  return sorted.find(t => t.maxLengthM >= lengthM) ?? null
}

/**
 * All tiers that are achievable at the given length.
 */
function getAchievableTiers(cat: CatKey, lengthM: number): SpeedTier[] {
  return CABLE_DATA[cat].speedTiers.filter(t => t.maxLengthM >= lengthM)
}

/**
 * Estimated signal attenuation at a given length.
 * Uses linear approximation scaled from 100 m reference value.
 */
function getAttenuation(cat: CatKey, lengthM: number): number {
  return (CABLE_DATA[cat].attenDbPer100m * lengthM) / 100
}

/**
 * EIA/TIA-568 channel model:
 * Max permanent link = 90 m
 * Max equipment cords = 10 m  → Total channel = 100 m
 */
function getEiaCompliance(lengthM: number): {
  permanentLinkOk: boolean
  channelOk: boolean
  permanentLinkMax: number
  channelMax: number
  overBy: number
} {
  const permanentLinkMax = 90
  const channelMax = 100
  return {
    permanentLinkOk: lengthM <= permanentLinkMax,
    channelOk: lengthM <= channelMax,
    permanentLinkMax,
    channelMax,
    overBy: Math.max(0, lengthM - channelMax),
  }
}

/**
 * PoE voltage drop estimate.
 * Rough model: V_drop = I × R (round trip)
 * Cat5e/6 conductor R ≈ 9.38 Ω/100 m for 24 AWG solid
 * PoE feeds through 2 pairs (mode A or B) → parallel → R/2 for send, R/2 for return
 * For simplicity: V_drop = (watts / 48V) * 9.38 * (lengthM / 100)
 */
function getPoEVoltageDrop(lengthM: number, poEWatts: number): { volts: number; pctOfNominal: number; ok: boolean } {
  const resistance_per_100m = 9.38  // Ω for 24 AWG
  const nominalV = 48
  const current = poEWatts / nominalV
  // Round trip via 2 conductors (2 × R_one_way)
  const r_total = 2 * (resistance_per_100m * lengthM / 100) / 2 // 2 pairs in parallel
  const v_drop = current * r_total
  const pct = (v_drop / nominalV) * 100
  return { volts: +v_drop.toFixed(2), pctOfNominal: +pct.toFixed(1), ok: v_drop < 7.0 }  // 802.3bt allows ≤7 V drop at PSE
}

/**
 * Speed formatted label with unit
 */
function fmtSpeed(mbps: number): string {
  if (mbps >= 1000) return `${mbps / 1000} Gbps`
  return `${mbps} Mbps`
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function ResultCard({
  icon: Icon,
  label,
  value,
  subValue,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  subValue?: string
  accent?: string
}) {
  return (
    <div style={{
      border: `1px solid ${accent ?? 'var(--line)'}`,
      padding: '16px 18px',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={18} color={accent ?? 'var(--graphite)'} />
        <span className="label">{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.4rem', color: accent ?? 'var(--ink)', lineHeight: 1.1 }}>
        {value}
      </div>
      {subValue && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--graphite)' }}>
          {subValue}
        </div>
      )}
    </div>
  )
}

function ComplianceRow({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 14px',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      background: ok ? '#f0fdf4' : '#fef2f2',
      borderRadius: '2px',
    }}>
      {ok
        ? <CheckCircle2 size={18} color="#15803d" style={{ flexShrink: 0, marginTop: '1px' }} />
        : <XCircle size={18} color="#b91c1c" style={{ flexShrink: 0, marginTop: '1px' }} />
      }
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: ok ? '#15803d' : '#b91c1c' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8rem', color: ok ? '#166534' : '#991b1b', marginTop: '2px' }}>
          {detail}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function CableCalculator() {
  const [lengthM, setLengthM] = useState<number>(50)
  const [inputVal, setInputVal] = useState<string>('50')
  const [category, setCategory] = useState<CatKey>('Cat5e')
  const [poeWatts, setPoeWatts] = useState<number>(15)

  // Sync slider → text
  const handleSlider = (v: number) => {
    setLengthM(v)
    setInputVal(String(v))
  }

  // Sync text → slider (allow partial typing)
  const handleInput = (raw: string) => {
    setInputVal(raw)
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= 1 && n <= 150) setLengthM(n)
  }

  const spec = CABLE_DATA[category]
  const eia = useMemo(() => getEiaCompliance(lengthM), [lengthM])
  const best = useMemo(() => getBestSpeed(category, lengthM), [category, lengthM])
  const achievable = useMemo(() => getAchievableTiers(category, lengthM), [category, lengthM])
  const atten = useMemo(() => getAttenuation(category, lengthM), [category, lengthM])
  const poe = useMemo(() => getPoEVoltageDrop(lengthM, poeWatts), [lengthM, poeWatts])

  const attenOk = atten <= spec.attenDbPer100m  // reference limit (at rated freq)
  const speedColor = best
    ? best.speedMbps >= 10000 ? '#2563eb'
    : best.speedMbps >= 1000  ? '#15803d'
    : '#d97706'
    : '#b91c1c'

  // Build a visual speed spectrum bar (0–40,000 Mbps)
  const maxBars = 40000
  const bestMbps = best?.speedMbps ?? 0
  const spectrumPct = Math.min((bestMbps / maxBars) * 100, 100)

  // All categories for comparison
  const catList: CatKey[] = ['Cat5e', 'Cat6', 'Cat6A', 'Cat7', 'Cat8']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="frame">
        <div className="frame-inner">
          <span className="label">Structured Cabling Design Tool</span>
          <h2 style={{ margin: '4px 0 8px 0' }}>Cable Length &amp; Performance Calculator</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Input your cable run length and category to instantly see achievable data speeds,
            signal attenuation, PoE voltage drop, and EIA/TIA-568 compliance status.
            Use this when planning lab setups or structured cabling assessments.
          </p>
        </div>
      </div>

      {/* ── Inputs + Live Results ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '24px', alignItems: 'start' }}>

        {/* INPUT PANEL */}
        <div className="frame" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 16px)' }}>
          <div className="frame-inner">
            <span className="label" style={{ display: 'block', marginBottom: '20px' }}>Input Parameters</span>

            {/* Cable Length */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Cable Length
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={inputVal}
                    onChange={e => handleInput(e.target.value)}
                    style={{
                      width: '62px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textAlign: 'right',
                      border: '1px solid var(--ink)',
                      padding: '4px 6px',
                      background: 'var(--paper)',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.85rem' }}>m</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={150}
                value={lengthM}
                onChange={e => handleSlider(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--ink)', cursor: 'pointer', height: '4px' }}
              />

              {/* Scale labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {[1, 30, 55, 90, 100, 150].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleSlider(v)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      color: lengthM === v ? 'var(--ink)' : 'var(--steel)',
                      fontWeight: lengthM === v ? 700 : 400,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >{v}</button>
                ))}
              </div>

              {/* EIA landmarks */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span className="tag" style={{ fontSize: '0.62rem' }}>30 m — Cat8 max</span>
                <span className="tag" style={{ fontSize: '0.62rem' }}>55 m — Cat6 10G limit</span>
                <span className="tag" style={{ fontSize: '0.62rem' }}>90 m — EIA permanent link</span>
                <span className="tag" style={{ fontSize: '0.62rem' }}>100 m — EIA channel max</span>
              </div>
            </div>

            {/* Cable Category */}
            <div style={{ marginBottom: '24px' }}>
              <div className="label" style={{ marginBottom: '10px' }}>Cable Category:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {catList.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn ${category === cat ? 'btn-solid' : ''}`}
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem', padding: '8px 12px' }}
                    onClick={() => setCategory(cat)}
                  >
                    <span>{CABLE_DATA[cat].label.split('(')[0].trim()}</span>
                    <span style={{ fontWeight: 400, opacity: 0.75 }}>{CABLE_DATA[cat].bandwidthMHz} MHz</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PoE Load */}
            <div>
              <div className="label" style={{ marginBottom: '10px' }}>PoE Device Power Draw:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { w: 15,  label: 'PoE 802.3af',   sub: '15.4 W' },
                  { w: 30,  label: 'PoE+ 802.3at',  sub: '30 W' },
                  { w: 60,  label: 'PoE++ Type 3',  sub: '60 W' },
                  { w: 100, label: 'PoE++ Type 4',  sub: '100 W' },
                ].map(p => (
                  <button
                    key={p.w}
                    type="button"
                    className={`btn ${poeWatts === p.w ? 'btn-solid' : ''}`}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '6px 10px', fontSize: '0.7rem' }}
                    onClick={() => setPoeWatts(p.w)}
                  >
                    <span style={{ fontWeight: 700 }}>{p.label}</span>
                    <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.65rem' }}>{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Primary speed result */}
          <div style={{
            padding: '24px',
            background: best ? speedColor : '#b91c1c',
            color: '#ffffff',
            border: `2px solid ${best ? speedColor : '#b91c1c'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Best Achievable Speed at {lengthM} m — {category}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1 }}>
                  {best ? fmtSpeed(best.speedMbps) : 'No Signal'}
                </div>
                {best && (
                  <div style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.9 }}>
                    {best.standard} — {best.note}
                  </div>
                )}
                {!best && (
                  <div style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.9 }}>
                    Cable run exceeds all speed tier limits for {category}.
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', opacity: 0.75 }}>EIA-568 Compliance</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.3rem', marginTop: '4px' }}>
                  {eia.channelOk ? '✓ PASS' : '✕ FAIL'}
                </div>
                {!eia.channelOk && (
                  <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '4px' }}>
                    Over by {eia.overBy} m
                  </div>
                )}
              </div>
            </div>

            {/* Speed spectrum bar */}
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.75 }}>0</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.75 }}>10 Mbps</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.75 }}>1 Gbps</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.75 }}>10 Gbps</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.75 }}>40 Gbps</span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${spectrumPct}%`,
                  background: 'rgba(255,255,255,0.85)',
                  transition: 'width 0.35s ease',
                  borderRadius: '2px',
                }} />
              </div>
            </div>
          </div>

          {/* Metric cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <ResultCard
              icon={TrendingDown}
              label="Signal Attenuation"
              value={`${atten.toFixed(1)} dB`}
              subValue={`Ref limit: ${spec.attenDbPer100m} dB / 100 m`}
              accent={attenOk ? '#15803d' : '#b91c1c'}
            />
            <ResultCard
              icon={Activity}
              label="Bandwidth"
              value={`${spec.bandwidthMHz} MHz`}
              subValue={spec.shielded ? 'STP / S-FTP Shielded' : 'UTP Unshielded'}
              accent="var(--ink)"
            />
            <ResultCard
              icon={Zap}
              label="Max PoE Power"
              value={`${Math.min(poeWatts, spec.maxPoEWatts)} W`}
              subValue={poeWatts > spec.maxPoEWatts ? `${category} max is ${spec.maxPoEWatts} W` : 'Supported by this category'}
              accent={poeWatts > spec.maxPoEWatts ? '#b91c1c' : '#2563eb'}
            />
            <ResultCard
              icon={Wifi}
              label="PoE Voltage Drop"
              value={`${poe.volts} V`}
              subValue={`${poe.pctOfNominal}% of 48 V nominal — ${poe.ok ? 'Within limit' : 'Exceeds 7 V limit'}`}
              accent={poe.ok ? '#15803d' : '#b91c1c'}
            />
          </div>

          {/* Available speed tiers */}
          <div className="frame">
            <div className="frame-inner">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>
                Achievable Speed Tiers at {lengthM} m for {category}:
              </span>

              {achievable.length === 0 ? (
                <div style={{ padding: '16px', border: '1px solid #fca5a5', background: '#fef2f2', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <AlertTriangle size={18} color="#b91c1c" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#b91c1c' }}>
                    No IEEE speed standard is achievable at {lengthM} m for {category}. Shorten the run or upgrade to a higher category.
                  </span>
                </div>
              ) : (
                <table className="spec-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>IEEE Standard</th>
                      <th>Speed</th>
                      <th>Max Segment</th>
                      <th>Status at {lengthM} m</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spec.speedTiers.map(t => {
                      const ok = t.maxLengthM >= lengthM
                      return (
                        <tr key={t.standard} style={{ background: ok ? '#f0fdf4' : '#fef2f2' }}>
                          <td><span className="mono" style={{ fontWeight: 600 }}>{t.standard}</span></td>
                          <td><span className="mono" style={{ fontWeight: 700, color: ok ? '#15803d' : '#94a3b8' }}>{t.speedLabel}</span></td>
                          <td><span className="mono">{t.maxLengthM} m</span></td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: ok ? '#15803d' : '#b91c1c' }}>
                              {ok ? '✓ Achievable' : '✕ Exceeds limit'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--graphite)', fontSize: '0.76rem' }}>{t.note}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* EIA / TIA-568 Compliance checks */}
          <div className="frame">
            <div className="frame-inner">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>EIA/TIA-568 Standards Compliance Checklist:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ComplianceRow
                  ok={eia.permanentLinkOk}
                  label={`Permanent Link ≤ ${eia.permanentLinkMax} m`}
                  detail={eia.permanentLinkOk
                    ? `Your run (${lengthM} m) is within the max horizontal cabling distance of ${eia.permanentLinkMax} m. ✓`
                    : `Your run (${lengthM} m) exceeds the permanent link limit of ${eia.permanentLinkMax} m by ${lengthM - eia.permanentLinkMax} m. Add a consolidation point or intermediate patch panel.`}
                />
                <ComplianceRow
                  ok={eia.channelOk}
                  label={`Total Channel ≤ ${eia.channelMax} m (incl. patch cords)`}
                  detail={eia.channelOk
                    ? `Full channel (cable + patch cords) is within the ${eia.channelMax} m limit. Valid for all IEEE 802.3 speed standards that support this cable category.`
                    : `Channel length of ${lengthM} m exceeds the ${eia.channelMax} m limit by ${eia.overBy} m. This segment will not support any IEEE data standard. Relocate IDF/MDF or run fiber for longer distances.`}
                />
                <ComplianceRow
                  ok={!spec.shielded || true}
                  label={spec.shielded ? 'Shielded Cable — Proper Grounding Required' : 'UTP — No Shielding Required'}
                  detail={spec.shielded
                    ? `${category} uses shielded pairs (S/FTP or F/UTP). Improper grounding of the shield can induce more noise than unshielded cable. Ensure all connectors, patch panels, and racks share a common ground.`
                    : `${category} is UTP — no shield grounding needed. Simpler installation but more susceptible to EMI from power lines, motors, and fluorescent lights.`}
                />
                <ComplianceRow
                  ok={poeWatts <= spec.maxPoEWatts}
                  label={`PoE Power Class — ${poeWatts} W ${poeWatts <= spec.maxPoEWatts ? 'Supported' : 'EXCEEDS Category Limit'}`}
                  detail={poeWatts <= spec.maxPoEWatts
                    ? `${category} is rated to carry up to ${spec.maxPoEWatts} W PoE. Your selected ${poeWatts} W load is within safe limits.`
                    : `${category} is rated for a maximum of ${spec.maxPoEWatts} W. A ${poeWatts} W load requires ${poeWatts > 60 ? 'Cat6A or Cat7' : 'Cat6 or higher'}. Excessive current causes conductor heating and accelerated jacket degradation.`}
                />
                <ComplianceRow
                  ok={poe.ok}
                  label={`PoE Voltage Drop — ${poe.volts} V (${poe.pctOfNominal}%)`}
                  detail={poe.ok
                    ? `Voltage drop of ${poe.volts} V over ${lengthM} m is within the IEEE 802.3bt allowance of 7 V max drop at the PSE output. Powered Device (PD) receives ≥${(48 - poe.volts).toFixed(1)} V.`
                    : `Voltage drop of ${poe.volts} V exceeds the 7 V IEEE 802.3bt limit. The PD may receive insufficient voltage and fail to operate or power-cycle. Shorten the run to ≤${Math.floor(lengthM * (7 / poe.volts))} m or use PoE injector mid-span.`}
                />
              </div>
            </div>
          </div>

          {/* PoE Standards supported */}
          <div className="frame">
            <div className="frame-inner">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>PoE Standards Supported by {category}:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {spec.poeStandards.map(p => (
                  <div key={p} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    border: '1px solid #86efac',
                    background: '#f0fdf4',
                    borderRadius: '2px',
                  }}>
                    <CheckCircle2 size={14} color="#15803d" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category notes */}
          <div className="callout">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Construction Note — {category}:</span>
                {spec.constructionNote}
              </div>
            </div>
          </div>

          {/* Cross-category comparison at this length */}
          <div className="frame">
            <div className="frame-inner">
              <span className="label" style={{ display: 'block', marginBottom: '12px' }}>
                All-Category Speed Comparison at {lengthM} m:
              </span>
              <table className="spec-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Bandwidth</th>
                    <th>Best Speed at {lengthM} m</th>
                    <th>Max PoE</th>
                    <th>EIA-568</th>
                  </tr>
                </thead>
                <tbody>
                  {catList.map(cat => {
                    const b = getBestSpeed(cat, lengthM)
                    const eiaC = getEiaCompliance(lengthM)
                    const isSelected = cat === category
                    return (
                      <tr key={cat} style={{ background: isSelected ? '#eff6ff' : undefined }}>
                        <td>
                          <span className="mono" style={{ fontWeight: isSelected ? 700 : 400 }}>
                            {isSelected ? '▶ ' : ''}{cat}
                          </span>
                        </td>
                        <td><span className="mono">{CABLE_DATA[cat].bandwidthMHz} MHz</span></td>
                        <td>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: b
                              ? b.speedMbps >= 10000 ? '#2563eb'
                              : b.speedMbps >= 1000 ? '#15803d'
                              : '#d97706'
                              : '#b91c1c',
                          }}>
                            {b ? fmtSpeed(b.speedMbps) : 'No Signal'}
                          </span>
                        </td>
                        <td><span className="mono">{CABLE_DATA[cat].maxPoEWatts} W</span></td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.72rem', color: eiaC.channelOk ? '#15803d' : '#b91c1c' }}>
                            {eiaC.channelOk ? '✓' : '✕'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          {(() => {
            const recs: { icon: string; text: string }[] = []
            if (!eia.channelOk) recs.push({ icon: '🔁', text: `Run is ${eia.overBy} m over the EIA-568 limit. Use fiber optic or a powered intermediate distribution frame (IDF) to extend range beyond 100 m.` })
            if (!eia.permanentLinkOk && eia.channelOk) recs.push({ icon: '⚠️', text: `Horizontal cabling exceeds 90 m. Reduce patch cord lengths to stay within the total 100 m channel budget.` })
            if (category === 'Cat5e' && lengthM <= 55) recs.push({ icon: '⬆️', text: `Your run is ≤55 m. Consider upgrading to Cat6 for 10 Gbps capability without significant extra cost.` })
            if (category === 'Cat6' && lengthM > 55) recs.push({ icon: '⬆️', text: `Cat6 10 Gbps is limited to 55 m. For 10G over ${lengthM} m, upgrade to Cat6A.` })
            if (!poe.ok) recs.push({ icon: '⚡', text: `Voltage drop of ${poe.volts} V exceeds safe limits for a ${poeWatts} W PoE device. Either shorten the run or use a mid-span PoE injector/repeater closer to the device.` })
            if (poeWatts > spec.maxPoEWatts) recs.push({ icon: '🔌', text: `${category} is not rated for ${poeWatts} W PoE. Upgrade to ${poeWatts > 30 ? 'Cat6A or Cat7' : 'Cat6 or higher'} for proper thermal performance.` })
            if (recs.length === 0) recs.push({ icon: '✅', text: `All parameters are within TIA-568 compliance limits. This cable run is suitable for ${best ? fmtSpeed(best.speedMbps) : '–'} at ${lengthM} m.` })
            return (
              <div className="panel-dark">
                <span className="label" style={{ color: 'var(--mist)', display: 'block', marginBottom: '12px' }}>
                  <Cable size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Design Recommendations:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recs.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--mist)' }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{r.icon}</span>
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
