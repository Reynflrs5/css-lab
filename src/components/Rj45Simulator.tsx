import { useState, useEffect } from 'react'
import {
  WIRE_COLORS,
  T568B_PINOUT,
  T568A_PINOUT,
  PIN_FUNCTIONS,
  type WireColor
} from '../data/cablingData'
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Zap,
  ArrowRightLeft
} from 'lucide-react'

export default function Rj45Simulator() {
  // Simulator configuration
  const [targetStandard, setTargetStandard] = useState<'T568B' | 'T568A' | 'CROSSOVER'>('T568B')
  
  // Current slot assignments for End A & End B (array of 8 wire IDs or null)
  const [slotsA, setSlotsA] = useState<(string | null)[]>(T568B_PINOUT)
  const [slotsB, setSlotsB] = useState<(string | null)[]>(T568B_PINOUT)
  const [activeEnd, setActiveEnd] = useState<'A' | 'B'>('A')
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null)

  // Tester state
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [activeLed, setActiveLed] = useState<number>(0) // 1 to 8, 0 means inactive
  const [testSpeed, setTestSpeed] = useState<number>(600) // ms per sweep step

  const activeSlots = activeEnd === 'A' ? slotsA : slotsB
  const setActiveSlots = activeEnd === 'A' ? setSlotsA : setSlotsB

  const targetSequence = targetStandard === 'T568A'
    ? T568A_PINOUT
    : targetStandard === 'CROSSOVER'
      ? (activeEnd === 'A' ? T568A_PINOUT : T568B_PINOUT)
      : T568B_PINOUT

  // Clear or set slots
  const handleClear = () => {
    setActiveSlots(new Array(8).fill(null))
  }

  const handleAutoFill = () => {
    setActiveSlots([...targetSequence])
  }

  const handleShuffle = () => {
    const shuffled = [...WIRE_COLORS.map(w => w.id)].sort(() => Math.random() - 0.5)
    setActiveSlots(shuffled)
  }

  const handleIntroduceError = () => {
    const copy = [...targetSequence]
    // Swap pin 1 and 2, or 3 and 6
    const tmp = copy[0]
    copy[0] = copy[1]
    copy[1] = tmp
    setActiveSlots(copy)
  }

  // Handle clicking on an available wire from the palette
  const handleSelectWire = (wireId: string) => {
    setSelectedWireId(prev => prev === wireId ? null : wireId)
  }

  // Handle clicking on a slot
  const handleSlotClick = (index: number) => {
    if (selectedWireId) {
      // If wire already exists in another slot, swap or remove from previous
      const updated = [...activeSlots]
      const existingIdx = updated.indexOf(selectedWireId)
      if (existingIdx !== -1 && existingIdx !== index) {
        updated[existingIdx] = updated[index] // swap or null
      }
      updated[index] = selectedWireId
      setActiveSlots(updated)
      setSelectedWireId(null)
    } else {
      // If slot has a wire, remove it
      if (activeSlots[index] !== null) {
        const updated = [...activeSlots]
        updated[index] = null
        setActiveSlots(updated)
      }
    }
  }

  // LAN Tester animation loop
  useEffect(() => {
    if (!isTesting) return

    const interval = window.setInterval(() => {
      setActiveLed(prev => (prev % 8) + 1)
    }, testSpeed)

    return () => {
      clearInterval(interval)
    }
  }, [isTesting, testSpeed])

  // Helper to get WireColor metadata
  const getWire = (id: string | null): WireColor | undefined => {
    if (!id) return undefined
    return WIRE_COLORS.find(w => w.id === id)
  }

  // Pin validation count for current end
  const correctCount = activeSlots.filter((id, i) => id === targetSequence[i]).length

  // Tester Diagnostics logic
  const getTestDiagnosis = () => {
    // Check End A and End B connections
    const isEndAFull = slotsA.every(s => s !== null)
    const isEndBFull = slotsB.every(s => s !== null)

    if (!isEndAFull || !isEndBFull) {
      return {
        status: 'INCOMPLETE',
        color: 'var(--graphite)',
        title: 'Circuit Incomplete (Open Pins)',
        detail: 'One or more wire pins are missing in RJ45 plug End A or End B.'
      }
    }

    const isEndAT568B = slotsA.every((s, i) => s === T568B_PINOUT[i])
    const isEndBT568B = slotsB.every((s, i) => s === T568B_PINOUT[i])
    const isEndAT568A = slotsA.every((s, i) => s === T568A_PINOUT[i])
    const isEndBT568A = slotsB.every((s, i) => s === T568A_PINOUT[i])

    if ((isEndAT568B && isEndBT568B) || (isEndAT568A && isEndBT568A)) {
      return {
        status: 'PASS',
        color: '#15803d',
        title: 'PASS — Straight-Through Cable Verified',
        detail: 'Continuous 1-to-1 pin alignment. Meets ANSI/TIA-568 standards for 1000BASE-T Gigabit Ethernet & PoE.'
      }
    }

    if ((isEndAT568A && isEndBT568B) || (isEndAT568B && isEndBT568A)) {
      return {
        status: 'CROSSOVER',
        color: '#2563eb',
        title: 'PASS — Valid Crossover Cable',
        detail: 'Pairs 2 and 3 (Pins 1/3 and 2/6) properly transposed. Suitable for direct PC-to-PC link without Auto-MDIX.'
      }
    }

    // Check fast ethernet (1, 2, 3, 6)
    const fastEthPins = [0, 1, 2, 5] // 1, 2, 3, 6 (0-indexed)
    const fastEthMatch = fastEthPins.every(i => slotsA[i] === slotsB[i] && slotsA[i] !== null)
    if (fastEthMatch) {
      return {
        status: 'DEGRADED',
        color: '#d97706',
        title: 'Partial Continuity — Fast Ethernet Only (100 Mbps)',
        detail: 'Data pairs (1, 2, 3, 6) communicate, but pins (4, 5, 7, 8) are miswired or faulty. Gigabit and PoE will fail.'
      }
    }

    return {
      status: 'FAULT',
      color: '#b91c1c',
      title: 'FAIL — Miswired / Crossed Conductors',
      detail: 'Pin mapping mismatch between Master and Remote unit. Check wire sequencing before crimping.'
    }
  }

  const diagnosis = getTestDiagnosis()

  // Calculate remote LED based on wire matching
  const getRemoteActiveLed = () => {
    if (activeLed === 0) return 0
    // ActiveLed is 1-indexed (1 to 8)
    const masterWire = slotsA[activeLed - 1]
    if (!masterWire) return 0 // open circuit
    // Find where this wire ends up on End B
    const remoteIndex = slotsB.indexOf(masterWire)
    return remoteIndex === -1 ? 0 : remoteIndex + 1
  }

  const remoteActiveLed = getRemoteActiveLed()

  return (
    <div className="rj45-lab-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Control Header & Standard Selector */}
      <div className="frame">
        <div className="frame-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="label">Interactive Crimping Workbench</span>
              <h2 style={{ margin: '4px 0 0 0' }}>RJ45 Modular Plug Simulator</h2>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="label" style={{ marginRight: '4px' }}>Standard:</span>
              <button
                type="button"
                className={`btn ${targetStandard === 'T568B' ? 'btn-solid' : ''}`}
                onClick={() => { setTargetStandard('T568B'); }}
              >
                T-568B (Standard)
              </button>
              <button
                type="button"
                className={`btn ${targetStandard === 'T568A' ? 'btn-solid' : ''}`}
                onClick={() => { setTargetStandard('T568A'); }}
              >
                T-568A
              </button>
              <button
                type="button"
                className={`btn ${targetStandard === 'CROSSOVER' ? 'btn-solid' : ''}`}
                onClick={() => { setTargetStandard('CROSSOVER'); }}
              >
                <ArrowRightLeft size={14} /> Crossover
              </button>
            </div>
          </div>

          {/* End A / End B Selector */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '20px' }}>
            <span className="label">Target Cable End:</span>
            <button
              type="button"
              className={`btn ${activeEnd === 'A' ? 'btn-solid' : ''}`}
              onClick={() => setActiveEnd('A')}
            >
              Connector End A {targetStandard === 'CROSSOVER' ? '(T-568A)' : `(${targetStandard})`}
            </button>
            <button
              type="button"
              className={`btn ${activeEnd === 'B' ? 'btn-solid' : ''}`}
              onClick={() => setActiveEnd('B')}
            >
              Connector End B {targetStandard === 'CROSSOVER' ? '(T-568B)' : `(${targetStandard})`}
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--steel)', marginLeft: 'auto' }}>
              Currently wiring: <strong style={{ color: 'var(--ink)' }}>End {activeEnd}</strong>
            </span>
          </div>

          {/* Workbench Controls & Shortcuts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={handleAutoFill} title="Arrange in standard order">
                <Zap size={14} /> Auto-Fill ({targetStandard === 'CROSSOVER' ? (activeEnd === 'A' ? 'T-568A' : 'T-568B') : targetStandard})
              </button>
              <button type="button" className="btn" onClick={handleShuffle} title="Scramble wire order">
                <Shuffle size={14} /> Scramble Order
              </button>
              <button type="button" className="btn" onClick={handleIntroduceError} title="Simulate a typical pin swap error">
                <AlertCircle size={14} /> Inject Pin Error
              </button>
              <button type="button" className="btn" onClick={handleClear} title="Clear all pins">
                <RotateCcw size={14} /> Clear Plug
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="label">Sequence Accuracy:</span>
              <span className="tag" style={{
                backgroundColor: correctCount === 8 ? '#dcfce7' : '#fef3c7',
                color: correctCount === 8 ? '#15803d' : '#92400e',
                border: `1px solid ${correctCount === 8 ? '#86efac' : '#fcd34d'}`,
                fontWeight: 600
              }}>
                {correctCount} / 8 Correct Pins
              </span>
            </div>
          </div>

          {/* Visual RJ45 Transparent Plug Graphic */}
          <div className="rj45-plug-display" style={{
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '2px solid #64748b',
            borderRadius: '4px',
            padding: '24px 20px',
            position: 'relative',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
            marginBottom: '28px'
          }}>
            {/* Top Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: '#d97706', borderRadius: '1px' }}></div>
                <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                  RJ-45 8P8C MODULAR CONNECTOR · GOLD PINS TOP VIEW (CLIP FACING DOWN)
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                PIN 1 (LEFT) ─── PIN 8 (RIGHT)
              </span>
            </div>

            {/* Gold Pin Teeth Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '8px',
              marginBottom: '10px',
              padding: '0 8px'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                <div key={p} style={{
                  height: '16px',
                  background: 'linear-gradient(180deg, #fef08a 0%, #ca8a04 100%)',
                  border: '1px solid #a16207',
                  borderRadius: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#713f12'
                }}>
                  P{p}
                </div>
              ))}
            </div>

            {/* RJ45 Wire Channels / Slots */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '8px',
              padding: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '3px'
            }}>
              {activeSlots.map((wireId, idx) => {
                const wire = getWire(wireId)
                const expectedId = targetSequence[idx]
                const expectedWire = getWire(expectedId)
                const isCorrect = wireId === expectedId

                return (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    style={{
                      border: wire
                        ? (isCorrect ? '2px solid #16a34a' : '2px solid #dc2626')
                        : '2px dashed #94a3b8',
                      backgroundColor: wire ? '#f8fafc' : '#f1f5f9',
                      borderRadius: '2px',
                      padding: '10px 6px',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    title={wire ? `Click to remove ${wire.name}` : `Click to place selected wire into Pin ${idx + 1}`}
                  >
                    {/* Pin number badge */}
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      borderBottom: '1px solid var(--line)',
                      width: '100%',
                      textAlign: 'center',
                      paddingBottom: '4px'
                    }}>
                      Pin {idx + 1}
                    </div>

                    {/* Wire Graphic Column */}
                    {wire ? (
                      <div style={{
                        width: '26px',
                        height: '70px',
                        borderRadius: '2px',
                        border: '1px solid rgba(0,0,0,0.25)',
                        background: wire.stripeColor
                          ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 6px, ${wire.stripeColor} 6px, ${wire.stripeColor} 12px)`
                          : wire.primaryColor,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        margin: '6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(255,255,255,0.92)',
                          color: '#0f172a',
                          padding: '1px 3px',
                          borderRadius: '2px',
                          border: '1px solid #cbd5e1'
                        }}>
                          {wire.shortName}
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        width: '24px',
                        height: '70px',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        +
                      </div>
                    )}

                    {/* Slot footer label & status */}
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      {wire ? (
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: isCorrect ? '#15803d' : '#b91c1c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}>
                          {isCorrect ? '✓ OK' : '✕ WRONG'}
                        </div>
                      ) : (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'var(--steel)'
                        }}>
                          Empty
                        </span>
                      )}

                      {/* Expected indicator */}
                      <div style={{
                        fontSize: '0.62rem',
                        color: 'var(--graphite)',
                        marginTop: '2px',
                        borderTop: '1px dotted var(--line)',
                        paddingTop: '2px'
                      }}>
                        Req: {expectedWire?.shortName}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cable Sheath / Jacket Clamping Wedge Visual */}
            <div style={{
              marginTop: '10px',
              padding: '10px 16px',
              background: '#334155',
              color: '#f8fafc',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span>▼ RETENTION WEDGE (CABLE JACKET MUST ENTER 6MM HERE)</span>
              <span>CAT 5e / CAT 6 UTP 4-PAIR</span>
            </div>
          </div>

          {/* Wire Palette / Color Tray */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="label">Wire Color Palette (Click a color, then click a slot above):</span>
              {selectedWireId && (
                <span className="tag" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                  Selected: {getWire(selectedWireId)?.name}
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
              gap: '10px'
            }}>
              {WIRE_COLORS.map(w => {
                const isPlaced = activeSlots.includes(w.id)
                const isSelected = selectedWireId === w.id

                return (
                  <button
                    type="button"
                    key={w.id}
                    onClick={() => handleSelectWire(w.id)}
                    style={{
                      border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                      background: isSelected ? '#f1f5f9' : 'var(--paper)',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 0 2px var(--ink)' : 'none',
                      opacity: isPlaced ? 0.75 : 1,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '24px',
                      borderRadius: '2px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      background: w.stripeColor
                        ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 5px, ${w.stripeColor} 5px, ${w.stripeColor} 10px)`
                        : w.primaryColor
                    }} />
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}>
                      {w.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: isPlaced ? 'var(--steel)' : '#16a34a'
                    }}>
                      {isPlaced ? '✓ In Plug' : '● Available'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LAN Continuity Cable Tester Simulator */}
      <div className="frame">
        <div className="frame-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="label">Diagnostic Bench Instrument</span>
              <h2 style={{ margin: '4px 0 0 0' }}>Virtual Dual-Unit LAN Cable Tester</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem' }}>
                Simulates standard Master (Tx) and Remote (Rx) LED pin-sweep continuity testing.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${isTesting ? 'btn-solid' : ''}`}
                onClick={() => {
                  if (isTesting) setActiveLed(0)
                  setIsTesting(prev => !prev)
                }}
              >
                {isTesting ? <><Pause size={14} /> Stop Sweep</> : <><Play size={14} /> Start LED Sweep</>}
              </button>

              <select
                value={testSpeed}
                onChange={(e) => setTestSpeed(Number(e.target.value))}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '7px 10px',
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  cursor: 'pointer'
                }}
              >
                <option value={800}>Speed: Slow (800ms)</option>
                <option value={450}>Speed: Normal (450ms)</option>
                <option value={200}>Speed: Fast (200ms)</option>
              </select>
            </div>
          </div>

          {/* Tester Hardware Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Master Unit */}
            <div style={{
              background: '#1e293b',
              border: '2px solid #0f172a',
              borderRadius: '4px',
              padding: '20px',
              color: '#f8fafc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94a3b8' }}>TRANSMITTER (TX)</div>
                  <strong style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>MASTER UNIT (END A)</strong>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  background: isTesting ? '#15803d' : '#475569',
                  borderRadius: '2px',
                  color: '#ffffff'
                }}>
                  {isTesting ? 'POWER ON' : 'STANDBY'}
                </div>
              </div>

              {/* Master LED Rack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(pin => {
                  const isActive = isTesting && activeLed === pin
                  const wire = getWire(slotsA[pin - 1])

                  return (
                    <div key={pin} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      background: isActive ? '#0f172a' : 'transparent',
                      borderRadius: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* LED bulb */}
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: isActive ? '#22c55e' : '#334155',
                          boxShadow: isActive ? '0 0 10px #22c55e, 0 0 4px #86efac' : 'none',
                          border: '1px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.1s'
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                          PIN {pin}
                        </span>
                      </div>

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: wire ? '#cbd5e1' : '#64748b' }}>
                        {wire ? `${wire.shortName} (${wire.name})` : 'EMPTY'}
                      </span>
                    </div>
                  )
                })}
                {/* Ground indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderTop: '1px dashed #334155',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#334155' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>G (Shield)</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>UTP Unshielded</span>
                </div>
              </div>
            </div>

            {/* Remote Unit */}
            <div style={{
              background: '#1e293b',
              border: '2px solid #0f172a',
              borderRadius: '4px',
              padding: '20px',
              color: '#f8fafc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94a3b8' }}>RECEIVER (RX)</div>
                  <strong style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>REMOTE UNIT (END B)</strong>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  background: isTesting ? '#15803d' : '#475569',
                  borderRadius: '2px',
                  color: '#ffffff'
                }}>
                  {isTesting ? 'RECEIVING' : 'STANDBY'}
                </div>
              </div>

              {/* Remote LED Rack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(pin => {
                  const isActive = isTesting && remoteActiveLed === pin
                  const wire = getWire(slotsB[pin - 1])

                  return (
                    <div key={pin} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      background: isActive ? '#0f172a' : 'transparent',
                      borderRadius: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* LED bulb */}
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: isActive ? '#22c55e' : '#334155',
                          boxShadow: isActive ? '0 0 10px #22c55e, 0 0 4px #86efac' : 'none',
                          border: '1px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.1s'
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                          PIN {pin}
                        </span>
                      </div>

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: wire ? '#cbd5e1' : '#64748b' }}>
                        {wire ? `${wire.shortName} (${wire.name})` : 'EMPTY'}
                      </span>
                    </div>
                  )
                })}
                {/* Ground indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderTop: '1px dashed #334155',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#334155' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>G (Shield)</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>UTP Unshielded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Result Banner */}
          <div style={{
            padding: '16px 20px',
            border: `2px solid ${diagnosis.color}`,
            background: 'var(--paper)',
            borderRadius: '2px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {diagnosis.status === 'PASS' || diagnosis.status === 'CROSSOVER' ? (
                <CheckCircle2 size={24} color={diagnosis.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={24} color={diagnosis.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <h4 style={{ margin: 0, color: diagnosis.color, fontSize: '0.95rem' }}>{diagnosis.title}</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--graphite)' }}>
                  {diagnosis.detail}
                </p>
              </div>
            </div>
          </div>

          {/* Pin Role Map Table */}
          <div style={{ marginTop: '24px' }}>
            <span className="label" style={{ display: 'block', marginBottom: '10px' }}>
              8P8C Conductor Electrical Transmission Roles (100BASE-TX vs 1000BASE-T):
            </span>
            <table className="spec-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>Pin #</th>
                  <th>Fast Ethernet (100 Mbps)</th>
                  <th>Gigabit (1000BASE-T)</th>
                  <th>Function & PoE Status</th>
                </tr>
              </thead>
              <tbody>
                {PIN_FUNCTIONS.map(pf => (
                  <tr key={pf.pin}>
                    <td><span className="mono" style={{ fontWeight: 600 }}>Pin {pf.pin}</span></td>
                    <td><span className="mono">{pf.role100BaseT}</span></td>
                    <td><span className="mono">{pf.role1000BaseT}</span></td>
                    <td>{pf.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
