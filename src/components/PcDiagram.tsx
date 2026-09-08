import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import {
  Box,
  Square,
  Sparkles,
  Power,
  Volume2,
  VolumeX,
  FileText,
  Wrench,
  Activity,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Server,
  Compass,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { pcParts, type PcPart } from '../data/pcParts'

type CameraPreset = 'isometric' | 'front' | 'interior' | 'rear' | 'exploded'

interface Rotation {
  x: number
  y: number
}

export interface PcDiagramProps {
  /** When provided, the component operates in controlled mode for part selection */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Hide the bottom selector grid and right detail panel (used when atlas layout provides them) */
  atlasMode?: boolean
}

const PRESET_ANGLES: Record<CameraPreset, Rotation> = {
  isometric: { x: 12, y: -18 },
  front: { x: 0, y: 70 },
  interior: { x: 0, y: 0 },
  rear: { x: 0, y: -70 },
  exploded: { x: 20, y: -24 },
}

export default function PcDiagram({ selectedId, onSelect, atlasMode = false }: PcDiagramProps = {}) {
  const [internalSelected, setInternalSelected] = useState<PcPart>(pcParts[1]) // Default to Motherboard
  // In controlled mode, derive selected from prop; fall back to internal state
  const selected = selectedId ? (pcParts.find(p => p.id === selectedId) ?? internalSelected) : internalSelected
  const [activePreset, setActivePreset] = useState<CameraPreset>('interior')
  const [rotation, setRotation] = useState<Rotation>(PRESET_ANGLES.interior)
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false)
  const [powerOn, setPowerOn] = useState<boolean>(true)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [glassPanelOn, setGlassPanelOn] = useState<boolean>(false) // Default OPEN CASE
  const [activeTab, setActiveTab] = useState<'specs' | 'install' | 'diagnostics'>('specs')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(1.0)

  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ clientX: number; clientY: number; rotX: number; rotY: number }>({
    clientX: 0,
    clientY: 0,
    rotX: 0,
    rotY: 0,
  })
  const audioCtxRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Reusable Web Audio API Click synthesizer
  const getAudioCtx = (): AudioContext | null => {
    if (typeof window === 'undefined') return null
    const AudioClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioClass) return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioClass()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {})
    }
    return audioCtxRef.current
  }

  const playClickSound = useCallback(
    (freq = 820, duration = 0.035) => {
      if (!soundEnabled) return
      const ctx = getAudioCtx()
      if (!ctx) return
      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + duration)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + duration)
      } catch {
        // audio unavailable
      }
    },
    [soundEnabled]
  )

  const select = (id: string) => {
    const part = pcParts.find(p => p.id === id)
    if (part) {
      playClickSound(1050, 0.04)
      setInternalSelected(part)
      onSelect?.(id)
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(id)
    }
  }

  const applyPreset = (preset: CameraPreset) => {
    playClickSound(880, 0.03)
    setIsAutoSpinning(false)
    setActivePreset(preset)
    setRotation(PRESET_ANGLES[preset])
  }

  const toggleAutoSpin = () => {
    playClickSound(isAutoSpinning ? 500 : 1100, 0.04)
    setIsAutoSpinning(prev => !prev)
  }

  const resetView = () => {
    playClickSound(750, 0.03)
    setIsAutoSpinning(false)
    setActivePreset('interior')
    setRotation(PRESET_ANGLES.interior)
    setZoom(1.0)
  }

  // 360 Turntable auto-rotation loop
  useEffect(() => {
    if (!isAutoSpinning) return

    let lastTime = performance.now()
    const spin = (time: number) => {
      const delta = (time - lastTime) / 1000
      lastTime = time
      setRotation(prev => ({
        x: prev.x,
        y: (prev.y + delta * 32) % 360,
      }))
      animFrameRef.current = requestAnimationFrame(spin)
    }
    animFrameRef.current = requestAnimationFrame(spin)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isAutoSpinning])

  // Drag-to-Rotate Pointer Handlers
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setIsAutoSpinning(false)
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartRef.current.clientX
    const deltaY = e.clientY - dragStartRef.current.clientY

    const newY = (dragStartRef.current.rotY + deltaX * 0.55) % 360
    const newX = Math.max(-55, Math.min(55, dragStartRef.current.rotX - deltaY * 0.45))

    setRotation({ x: Math.round(newX), y: Math.round(newY) })
  }

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [])

  // Scroll-to-Zoom (wheel) — attached as non-passive to allow preventDefault
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.08 : 0.08
      setZoom(prev => Math.min(2.5, Math.max(0.5, parseFloat((prev + delta).toFixed(2)))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const zoomIn = () => {
    playClickSound(1000, 0.03)
    setZoom(prev => Math.min(2.5, parseFloat((prev + 0.15).toFixed(2))))
  }
  const zoomOut = () => {
    playClickSound(700, 0.03)
    setZoom(prev => Math.max(0.5, parseFloat((prev - 0.15).toFixed(2))))
  }
  const zoomReset = () => {
    playClickSound(820, 0.03)
    setZoom(1.0)
  }

  const normalizedY = ((Math.round(rotation.y) % 360) + 360) % 360
  const zoomPct = Math.round(zoom * 100)

  return (
    <div className="pc-parts-workbench">
      {/* Controls Toolbar — hidden in atlasMode (atlas provides its own toolbar) */}
      {!atlasMode && <div className="workbench-toolbar">
        <div className="toolbar-group">
          <span className="mono-label">360° ORBIT:</span>
          <div className="view-presets" role="group" aria-label="3D View Angles">
            <button
              type="button"
              className={`view-btn${activePreset === 'interior' && !isAutoSpinning ? ' active' : ''}`}
              onClick={() => applyPreset('interior')}
              title="Open Interior View (Direct into all components)"
            >
              <Layers size={14} strokeWidth={1.75} aria-hidden="true" />
              OPEN INSIDE
            </button>
            <button
              type="button"
              className={`view-btn${activePreset === 'isometric' && !isAutoSpinning ? ' active' : ''}`}
              onClick={() => applyPreset('isometric')}
              title="Isometric 3D Perspective"
            >
              <Box size={14} strokeWidth={1.75} aria-hidden="true" />
              ISO 3D
            </button>
            <button
              type="button"
              className={`view-btn${activePreset === 'front' && !isAutoSpinning ? ' active' : ''}`}
              onClick={() => applyPreset('front')}
              title="Front Airflow Intake & I/O"
            >
              <Square size={14} strokeWidth={1.75} aria-hidden="true" />
              FRONT
            </button>
            <button
              type="button"
              className={`view-btn${activePreset === 'rear' && !isAutoSpinning ? ' active' : ''}`}
              onClick={() => applyPreset('rear')}
              title="Rear I/O Shield & Power Socket"
            >
              <Server size={14} strokeWidth={1.75} aria-hidden="true" />
              REAR I/O
            </button>
            <button
              type="button"
              className={`view-btn${activePreset === 'exploded' && !isAutoSpinning ? ' active' : ''}`}
              onClick={() => applyPreset('exploded')}
              title="Exploded layer separation"
            >
              <Sparkles size={14} strokeWidth={1.75} aria-hidden="true" />
              EXPLODED
            </button>
          </div>

          {/* Auto-Spin Turntable Button */}
          <button
            type="button"
            className={`auto-spin-btn${isAutoSpinning ? ' active' : ''}`}
            onClick={toggleAutoSpin}
            title={isAutoSpinning ? 'Pause turntable rotation' : 'Start continuous 360° rotation'}
          >
            {isAutoSpinning ? (
              <Pause size={13} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Play size={13} strokeWidth={2} aria-hidden="true" />
            )}
            {isAutoSpinning ? 'SPINNING...' : 'AUTO-SPIN 360°'}
          </button>

          {/* Case Open / Glass Toggle */}
          <button
            type="button"
            className={`glass-toggle-btn${glassPanelOn ? ' on' : ' off'}`}
            onClick={() => {
              playClickSound(950, 0.03)
              setGlassPanelOn(prev => !prev)
            }}
            title={glassPanelOn ? 'Remove side glass panel' : 'Put glass panel on'}
          >
            {glassPanelOn ? (
              <Eye size={13} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <EyeOff size={13} strokeWidth={1.75} aria-hidden="true" />
            )}
            {glassPanelOn ? 'SIDE GLASS: ON' : 'SIDE GLASS: OFF (BUKAS)'}
          </button>

          <button
            type="button"
            className="reset-btn"
            onClick={resetView}
            title="Reset to default interior view"
          >
            <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" />
            RESET
          </button>

          {/* Zoom Controls */}
          <span className="mono-label">ZOOM:</span>
          <div className="zoom-controls" role="group" aria-label="Zoom Controls">
            <button
              type="button"
              className="zoom-btn"
              onClick={zoomOut}
              title="Zoom Out (or scroll down)"
              disabled={zoom <= 0.5}
            >
              <ZoomOut size={13} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="zoom-pct-btn"
              onClick={zoomReset}
              title="Reset zoom to 100%"
            >
              {zoomPct}%
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={zoomIn}
              title="Zoom In (or scroll up)"
              disabled={zoom >= 2.5}
            >
              <ZoomIn size={13} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="zoom-btn zoom-fit"
              onClick={zoomReset}
              title="Fit to view (100%)"
            >
              <Maximize2 size={13} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={`power-toggle-btn${powerOn ? ' powered' : ''}`}
            onClick={() => {
              playClickSound(powerOn ? 450 : 1300, 0.05)
              setPowerOn(prev => !prev)
            }}
            title={powerOn ? 'Cut main system power' : 'Energize system power rail'}
          >
            <Power size={14} strokeWidth={2} aria-hidden="true" />
            <span className={`status-dot${powerOn ? ' live' : ''}`} />
            POWER: {powerOn ? 'ONLINE' : 'OFF'}
          </button>

          <button
            type="button"
            className="sound-toggle-btn"
            onClick={() => {
              if (!soundEnabled) playClickSound(900, 0.03)
              setSoundEnabled(prev => !prev)
            }}
            title={soundEnabled ? 'Mute mechanical clicks' : 'Enable audio feedback'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <VolumeX size={14} strokeWidth={1.75} aria-hidden="true" />
            )}
            {soundEnabled ? 'SFX ON' : 'MUTED'}
          </button>
        </div>
      </div>}

      {/* Main Grid */}
      <div className={`workbench-grid${atlasMode ? ' atlas-mode' : ''}`}>
        {/* Left: 3D Viewport with Orbit Drag & All 12 Visible Components */}
        <div className="viewport-column">
          <div
            ref={viewportRef}
            className={`chassis-viewport${isDragging ? ' dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* HUD: Top-Left telemetry */}
            <div className="viewport-hud top-left">
              <div className="hud-code">STATION // CSS-LAB-02 // OPEN-BENCH</div>
              <div className="hud-status">
                RAIL:{' '}
                <span className={powerOn ? 'txt-accent' : 'txt-dim'}>
                  {powerOn ? '+12.04V DC OK' : '0.00V STANDBY'}
                </span>
              </div>
              <div className="hud-angle">
                <Compass size={11} className="inline-icon" aria-hidden="true" />
                ORBIT: {rotation.x}° X / {normalizedY}° Y
              </div>
            </div>

            {/* HUD: Top-Right Q-Code & Active Part */}
            <div className="viewport-hud top-right">
              <div className="post-display" title="Motherboard Q-Code LED Display">
                <span className="post-label">Q-CODE</span>
                <span className={`post-digits${powerOn ? ' active' : ''}`}>
                  {powerOn ? 'AA' : '--'}
                </span>
              </div>
              <div className="active-part-indicator">
                INSPECTING: <strong>{selected.shortName.toUpperCase()}</strong>
              </div>
              <div className="hud-angle" style={{ marginTop: 4 }}>
                🔍 ZOOM: {zoomPct}%
              </div>
            </div>

            {/* 3D Scene Root */}
            <div className="scene-container">
              <div
                className={`pc-case-3d ${activePreset}${powerOn ? ' pwr-on' : ''}${
                  isDragging ? ' no-transition' : ''
                }`}
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                }}
              >
                {/* ── 1. CHASSIS OUTER FRAMEWORK ───────────────────── */}
                {/* Chassis Main Tray Backplane */}
                <div
                  className={`chassis-back-structure${selected.id === 'chassis' ? ' selected' : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    select('chassis')
                  }}
                  title="Chassis Frame & Cable Routing Grommets"
                >
                  <div className="grommet g-top" />
                  <div className="grommet g-right-1" />
                  <div className="grommet g-right-2" />
                  <div className="grommet g-bot" />
                </div>

                {/* Top Chassis Roof */}
                <div className="chassis-roof" />
                {/* Bottom Chassis Basement */}
                <div className="chassis-base" />

                {/* Rear Panel Frame (Left edge in open view) */}
                <div className="chassis-rear-edge">
                  {/* Rear I/O Ports */}
                  <div className="mini-rear-io">
                    <span className="mini-jack usb" />
                    <span className="mini-jack hdmi" />
                    <span className="mini-jack lan" />
                  </div>
                  {/* 12. Case Rear Exhaust Fan */}
                  <div
                    className={`hardware-layer comp-exhaust-fan${
                      selected.id === 'case-fans' ? ' selected' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      select('case-fans')
                    }}
                    onKeyDown={e => handleKey(e, 'case-fans')}
                    role="button"
                    tabIndex={0}
                    aria-label="Rear 120mm Exhaust Fan"
                    title="120mm PWM Rear Exhaust Fan"
                  >
                    <div className="exhaust-fan-frame">
                      <div className={`fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                    <div className="comp-tag mini">EXHAUST</div>
                  </div>
                </div>

                {/* Front Panel Frame (Right edge in open view) */}
                <div className="chassis-front-edge">
                  {/* Front I/O Controls */}
                  <div className="front-io-block">
                    <div
                      className={`front-pwr-btn${powerOn ? ' on' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        setPowerOn(p => !p)
                      }}
                      title="Front Power Switch"
                    />
                    <div className="front-port usb" />
                    <div className="front-port usbc" />
                  </div>
                  {/* 12. Case Front Intake Fans */}
                  <div
                    className={`hardware-layer comp-intake-fans${
                      selected.id === 'case-fans' ? ' selected' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      select('case-fans')
                    }}
                    onKeyDown={e => handleKey(e, 'case-fans')}
                    role="button"
                    tabIndex={0}
                    aria-label="Dual Front Intake Fans"
                    title="Dual 120mm Front Intake Fans"
                  >
                    <div className="intake-fan fan-top">
                      <div className={`fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                    <div className="intake-fan fan-bot">
                      <div className={`fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                    <div className="comp-tag mini">INTAKE</div>
                  </div>
                </div>

                {/* ── 2. MOTHERBOARD ───────────────────────────────── */}
                <div
                  className={`hardware-layer comp-mobo${
                    selected.id === 'motherboard' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('motherboard')
                  }}
                  onKeyDown={e => handleKey(e, 'motherboard')}
                  role="button"
                  tabIndex={0}
                  aria-label="Motherboard"
                >
                  <svg className="pcb-traces" viewBox="0 0 250 270" preserveAspectRatio="none">
                    <pattern id="moboGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                      <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#moboGrid)" />
                    {/* Gold Data Lines */}
                    <path d="M 40 60 L 80 60 L 100 90 L 160 90" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                    <path d="M 110 130 L 110 160 L 50 160 L 50 210" stroke="rgba(214, 213, 206, 0.4)" strokeWidth="1.5" fill="none" />
                    <path d="M 180 40 L 180 130" stroke="rgba(214, 213, 206, 0.5)" strokeWidth="2" fill="none" />
                    <circle cx="80" cy="60" r="2.5" fill="#eab308" />
                    <circle cx="100" cy="90" r="2.5" fill="#eab308" />
                  </svg>

                  {/* VRM Heatsinks */}
                  <div className="vrm-heatsink top" />
                  <div className="vrm-heatsink left" />
                  {/* Rear I/O Box */}
                  <div className="io-shield-block" />
                  {/* Chipset Heatsink */}
                  <div className="chipset-heatsink">
                    <span className="chipset-text">CHIPSET Z790</span>
                  </div>
                  {/* PCIe Slots */}
                  <div className="pcie-slot primary" />
                  <div className="pcie-slot secondary" />

                  <div className="comp-tag">MOTHERBOARD</div>
                </div>

                {/* ── 3. CPU ───────────────────────────────────────── */}
                <div
                  className={`hardware-layer comp-cpu${
                    selected.id === 'cpu' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('cpu')
                  }}
                  onKeyDown={e => handleKey(e, 'cpu')}
                  role="button"
                  tabIndex={0}
                  aria-label="CPU"
                >
                  <div className="cpu-socket-frame">
                    <div className="cpu-bracket-lever" />
                    <div className="cpu-ihs">
                      <div className="cpu-triangle" />
                      <span className="cpu-mark">CPU // X86-64</span>
                      <span className="cpu-clock">3.4 – 5.6 GHz</span>
                    </div>
                  </div>
                  <div className="comp-tag mini">CPU</div>
                </div>

                {/* ── 4. CPU COOLER ────────────────────────────────── */}
                <div
                  className={`hardware-layer comp-cooling${
                    selected.id === 'cooling' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('cooling')
                  }}
                  onKeyDown={e => handleKey(e, 'cooling')}
                  role="button"
                  tabIndex={0}
                  aria-label="CPU Cooler"
                >
                  <div className="cooler-tower">
                    <div className="heatpipe pipe-1" />
                    <div className="heatpipe pipe-2" />
                    <div className="heatpipe pipe-3" />
                    <div className="heatpipe pipe-4" />
                    <div className="fin-stack">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="cooler-fin" />
                      ))}
                    </div>
                    <div className={`fan-unit${powerOn ? ' spinning' : ''}`}>
                      <div className="fan-hub" />
                      <div className="fan-blade b1" />
                      <div className="fan-blade b2" />
                      <div className="fan-blade b3" />
                      <div className="fan-blade b4" />
                    </div>
                  </div>
                  <div className="comp-tag mini">COOLER</div>
                </div>

                {/* ── 5. RAM (DDR5 Dual Channel) ───────────────────── */}
                <div
                  className={`hardware-layer comp-ram${
                    selected.id === 'ram' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('ram')
                  }}
                  onKeyDown={e => handleKey(e, 'ram')}
                  role="button"
                  tabIndex={0}
                  aria-label="RAM Modules"
                >
                  <div className="dimm-slot slot-a">
                    <div className="ram-stick">
                      <div className="ram-ridges" />
                      <span className="ram-text">DDR5</span>
                      <div className="ram-gold-pins" />
                    </div>
                  </div>
                  <div className="dimm-slot slot-b">
                    <div className="ram-stick">
                      <div className="ram-ridges" />
                      <span className="ram-text">DDR5</span>
                      <div className="ram-gold-pins" />
                    </div>
                  </div>
                  <div className="comp-tag mini">RAM (DDR5)</div>
                </div>

                {/* ── 6. STORAGE (M.2 NVMe SSD) ────────────────────── */}
                <div
                  className={`hardware-layer comp-storage${
                    selected.id === 'storage' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('storage')
                  }}
                  onKeyDown={e => handleKey(e, 'storage')}
                  role="button"
                  tabIndex={0}
                  aria-label="M.2 NVMe Storage"
                >
                  <div className="m2-stick">
                    <div className="m2-heatsink-fins" />
                    <span className="m2-text">M.2 NVMe 2TB</span>
                    <div className="m2-screw-notch" />
                  </div>
                  <div className="comp-tag mini">NVMe M.2</div>
                </div>

                {/* ── 7. CMOS BATTERY (CR2032) ─────────────────────── */}
                <div
                  className={`hardware-layer comp-cmos${
                    selected.id === 'cmos-battery' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('cmos-battery')
                  }}
                  onKeyDown={e => handleKey(e, 'cmos-battery')}
                  role="button"
                  tabIndex={0}
                  aria-label="CMOS Battery"
                  title="CR2032 3V CMOS Battery"
                >
                  <div className="cmos-coin-socket">
                    <div className="cmos-coin-cell">
                      <span className="cmos-plus">+</span>
                      <span className="cmos-text">CR2032</span>
                    </div>
                  </div>
                  <div className="comp-tag mini">CMOS 3V</div>
                </div>

                {/* ── 8. FRONT PANEL HEADERS (FPANEL) ──────────────── */}
                <div
                  className={`hardware-layer comp-fpanel${
                    selected.id === 'fpanel' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('fpanel')
                  }}
                  onKeyDown={e => handleKey(e, 'fpanel')}
                  role="button"
                  tabIndex={0}
                  aria-label="Front Panel Headers"
                  title="9-pin FPANEL Headers & Ribbon Cables"
                >
                  <div className="fpanel-pins-block">
                    <div className="pin-pair pwr" title="PWR_SW" />
                    <div className="pin-pair rst" title="RESET_SW" />
                    <div className="pin-pair led" title="HDD_LED" />
                  </div>
                  <div className="fpanel-ribbon-wires">
                    <div className="fwire w-red" />
                    <div className="fwire w-blk" />
                    <div className="fwire w-blu" />
                    <div className="fwire w-wht" />
                  </div>
                  <div className="comp-tag mini">FPANEL</div>
                </div>

                {/* ── 9. GPU (Graphics Accelerator) ────────────────── */}
                <div
                  className={`hardware-layer comp-gpu${
                    selected.id === 'gpu' ? ' selected' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    select('gpu')
                  }}
                  onKeyDown={e => handleKey(e, 'gpu')}
                  role="button"
                  tabIndex={0}
                  aria-label="Graphics Accelerator"
                >
                  <div className="gpu-shroud">
                    <div className="gpu-bracket" />
                    <div className="gpu-badge">
                      <span>PCIe 5.0 x16</span>
                      <span className={`gpu-led${powerOn ? ' active' : ''}`} />
                    </div>
                    <div className="gpu-fans-row">
                      <div className={`gpu-fan${powerOn ? ' spinning' : ''}`}>
                        <div className="fan-hub" />
                        <div className="fan-blade b1" />
                        <div className="fan-blade b2" />
                        <div className="fan-blade b3" />
                      </div>
                      <div className={`gpu-fan${powerOn ? ' spinning-reverse' : ''}`}>
                        <div className="fan-hub" />
                        <div className="fan-blade b1" />
                        <div className="fan-blade b2" />
                        <div className="fan-blade b3" />
                      </div>
                    </div>
                    <div className="gpu-power-cable">
                      <div className="cable-wire" />
                      <div className="cable-wire" />
                      <div className="cable-wire" />
                    </div>
                  </div>
                  <div className="comp-tag">GPU ACCELERATOR</div>
                </div>

                {/* ── LOWER BASEMENT CHAMBER ───────────────────────── */}
                <div className="chassis-basement-cover">
                  {/* 10. SATA HDD / SSD Bay */}
                  <div
                    className={`hardware-layer comp-sata-hdd${
                      selected.id === 'sata-hdd' ? ' selected' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      select('sata-hdd')
                    }}
                    onKeyDown={e => handleKey(e, 'sata-hdd')}
                    role="button"
                    tabIndex={0}
                    aria-label="SATA HDD Bay"
                    title="3.5-inch SATA Hard Drive Bay"
                  >
                    <div className="hdd-caddy">
                      <div className="hdd-metal-body">
                        <div className="hdd-label-sticker">
                          <span className="hdd-brand">SATA 3.5" HDD</span>
                          <span className="hdd-cap">4 TB // 7200 RPM</span>
                        </div>
                        <div className="hdd-sata-cables">
                          <span className="sata-data-cable" title="7-pin SATA Data" />
                          <span className="sata-power-cable" title="15-pin SATA Power" />
                        </div>
                      </div>
                    </div>
                    <div className="comp-tag mini">SATA HDD</div>
                  </div>

                  {/* 11. POWER SUPPLY UNIT (PSU) */}
                  <div
                    className={`hardware-layer comp-psu${
                      selected.id === 'psu' ? ' selected' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      select('psu')
                    }}
                    onKeyDown={e => handleKey(e, 'psu')}
                    role="button"
                    tabIndex={0}
                    aria-label="Power Supply Unit"
                  >
                    <div className="psu-shroud">
                      <div className="psu-grill">
                        <div className={`psu-fan-rotor${powerOn ? ' spinning' : ''}`} />
                      </div>
                      <div className="psu-specs-badge">
                        <span className="psu-wattage">850W</span>
                        <span className="psu-cert">80+ GOLD</span>
                      </div>
                      <div className="psu-modular-harness">
                        <div className="wire-bundle" />
                        <div className="wire-bundle" />
                      </div>
                    </div>
                    <div className="comp-tag mini">PSU 850W</div>
                  </div>
                </div>

                {/* Optional Glass Side Panel (Only rendered if toggled ON) */}
                {glassPanelOn && (
                  <div
                    className="tempered-glass-cover on"
                    onClick={e => {
                      e.stopPropagation()
                      select('chassis')
                    }}
                    title="Tempered Glass Side Panel (Click to inspect Case)"
                  >
                    <span className="glass-screw tl" />
                    <span className="glass-screw tr" />
                    <span className="glass-screw bl" />
                    <span className="glass-screw br" />
                  </div>
                )}
              </div>
            </div>

            {/* Viewport Footer / Atlas Mode Dock */}
            {atlasMode ? (
              <div className="atlas-viewport-dock" role="toolbar" aria-label="3D Viewport Controls">
                <div className="atlas-dock-group">
                  <button
                    type="button"
                    className={`atlas-dock-btn${activePreset === 'interior' && !isAutoSpinning ? ' active' : ''}`}
                    onClick={() => applyPreset('interior')}
                    title="Inside Perspective"
                  >
                    <Layers size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>Inside</span>
                  </button>
                  <button
                    type="button"
                    className={`atlas-dock-btn${activePreset === 'isometric' && !isAutoSpinning ? ' active' : ''}`}
                    onClick={() => applyPreset('isometric')}
                    title="Isometric Perspective"
                  >
                    <Box size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>Iso</span>
                  </button>
                  <button
                    type="button"
                    className={`atlas-dock-btn${activePreset === 'exploded' && !isAutoSpinning ? ' active' : ''}`}
                    onClick={() => applyPreset('exploded')}
                    title="Exploded Layer Separation"
                  >
                    <Sparkles size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>Explode</span>
                  </button>
                  <button
                    type="button"
                    className={`atlas-dock-btn${isAutoSpinning ? ' active' : ''}`}
                    onClick={toggleAutoSpin}
                    title="360° Continuous Orbit"
                  >
                    <Play size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>{isAutoSpinning ? 'Pause' : '360°'}</span>
                  </button>
                </div>

                <div className="atlas-dock-sep" />

                <div className="atlas-dock-group">
                  <button
                    type="button"
                    className="atlas-dock-btn icon-only"
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                    title="Zoom Out (or scroll down)"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut size={13} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="atlas-dock-btn pct"
                    onClick={zoomReset}
                    title="Reset Zoom to 100%"
                    aria-label="Reset Zoom"
                  >
                    {zoomPct}%
                  </button>
                  <button
                    type="button"
                    className="atlas-dock-btn icon-only"
                    onClick={zoomIn}
                    disabled={zoom >= 2.5}
                    title="Zoom In (or scroll up)"
                    aria-label="Zoom In"
                  >
                    <ZoomIn size={13} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="atlas-dock-btn icon-only"
                    onClick={zoomReset}
                    title="Reset Zoom / Angle"
                    aria-label="Reset View"
                  >
                    <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>

                <div className="atlas-dock-sep" />

                <div className="atlas-dock-group">
                  <button
                    type="button"
                    className={`atlas-dock-btn power${powerOn ? ' pwr-on' : ''}`}
                    onClick={() => {
                      playClickSound(powerOn ? 450 : 1300, 0.05)
                      setPowerOn(prev => !prev)
                    }}
                    title={powerOn ? 'Cut 12V Power Rail' : 'Energize 12V Power Rail'}
                  >
                    <Power size={13} strokeWidth={2} aria-hidden="true" />
                    <span>{powerOn ? '+12V' : 'PWR'}</span>
                  </button>
                  <button
                    type="button"
                    className={`atlas-dock-btn${glassPanelOn ? ' active' : ''}`}
                    onClick={() => setGlassPanelOn(prev => !prev)}
                    title={glassPanelOn ? 'Open Case (remove glass)' : 'Close Case (install tempered glass)'}
                  >
                    {glassPanelOn ? (
                      <Eye size={13} strokeWidth={1.75} aria-hidden="true" />
                    ) : (
                      <EyeOff size={13} strokeWidth={1.75} aria-hidden="true" />
                    )}
                    <span>{glassPanelOn ? 'Glass' : 'Open'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Viewport Footer */
              <div className="viewport-footer">
                <span className="mono-help">
                  🖱️ Drag to orbit • Scroll wheel or ＋/－ to zoom • Click any component to inspect
                </span>
              </div>
            )}
          </div>

          {/* Quick Selection Matrix: All 12 Components */}
          {!atlasMode && (
          <div className="component-selector-matrix">
            <div className="selector-title">SELECT FROM 12 PC HARDWARE SUBSYSTEMS:</div>
            <div className="selector-grid">
              {pcParts.map(part => (
                <button
                  key={part.id}
                  type="button"
                  id={`btn-${part.id}`}
                  className={`comp-card-btn${selected.id === part.id ? ' active' : ''}`}
                  onClick={() => select(part.id)}
                >
                  <div className="btn-top">
                    <span className="part-category-tag">{part.category}</span>
                    <span className="part-draw">{part.powerDraw}</span>
                  </div>
                  <div className="part-name-label">{part.shortName}</div>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Right: Technical Workstation Detail Panel — only in standalone mode */}
        {!atlasMode && (
        <div className="detail-column">
          <div className="workstation-panel">
            <div className="panel-header">
              <div className="badge-row">
                <span className="telemetry-badge category">CAT // {selected.category.toUpperCase()}</span>
                <span className="telemetry-badge power">{selected.powerDraw}</span>
                <span className="telemetry-badge temp">{selected.temperature}</span>
              </div>
              <h2 className="component-title">{selected.name}</h2>
              <p className="component-summary">{selected.body}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="workstation-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'specs'}
                className={`ws-tab${activeTab === 'specs' ? ' active' : ''}`}
                onClick={() => {
                  playClickSound(800, 0.02)
                  setActiveTab('specs')
                }}
              >
                <FileText size={14} strokeWidth={1.75} aria-hidden="true" />
                Technical specs
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'install'}
                className={`ws-tab${activeTab === 'install' ? ' active' : ''}`}
                onClick={() => {
                  playClickSound(800, 0.02)
                  setActiveTab('install')
                }}
              >
                <Wrench size={14} strokeWidth={1.75} aria-hidden="true" />
                Installation guide
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'diagnostics'}
                className={`ws-tab${activeTab === 'diagnostics' ? ' active' : ''}`}
                onClick={() => {
                  playClickSound(800, 0.02)
                  setActiveTab('diagnostics')
                }}
              >
                <Activity size={14} strokeWidth={1.75} aria-hidden="true" />
                Diagnostics
              </button>
            </div>

            {/* Tab Body */}
            <div className="tab-viewport">
              {activeTab === 'specs' && (
                <div className="specs-section">
                  <div className="section-label">Hardware parameters &amp; architecture</div>
                  <div className="specs-grid">
                    {selected.specs.map(s => (
                      <div key={s.label} className="spec-card">
                        <div className="spec-key">{s.label}</div>
                        <div className="spec-val">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'install' && (
                <div className="guide-section">
                  <div className="section-label">TESDA CSS NC II assembly &amp; handling protocol</div>
                  <ol className="protocol-list">
                    {selected.installGuide.map((step, idx) => (
                      <li key={idx} className="protocol-item">
                        <span className="step-number">{String(idx + 1).padStart(2, '0')}</span>
                        <div className="step-text">{step}</div>
                      </li>
                    ))}
                  </ol>
                  <div className="safety-alert">
                    <AlertTriangle size={18} strokeWidth={1.75} className="alert-symbol" aria-hidden="true" />
                    <div>
                      <strong>Safety precaution:</strong> Always disconnect the AC power cord and wear a grounded anti-static ESD wrist strap before touching internal components.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'diagnostics' && (
                <div className="diagnostics-section">
                  <div className="section-label">Common faults &amp; servicing tips</div>
                  <div className="faults-stack">
                    {selected.troubleshootingTips.map((tip, idx) => (
                      <div key={idx} className="fault-card">
                        <div className="fault-indicator">Fault diagnosis #{idx + 1}</div>
                        <div className="fault-desc">{tip}</div>
                      </div>
                    ))}
                  </div>
                  <div className="diagnostic-summary">
                    <span className="summary-title">Servicing rule of thumb</span>
                    <p>
                      Verify electrical power rails first, check physical seating and connections second, inspect firmware/BIOS third, and test software configuration last.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}