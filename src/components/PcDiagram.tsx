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
  Focus,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { pcParts, type PcPart } from '../data/pcParts'
import '../styles/pc-workbench.css'

type CameraPreset = 'isometric' | 'front' | 'interior' | 'rear' | 'exploded'

interface Rotation {
  x: number
  y: number
}

interface Pan {
  x: number
  y: number
}

export interface PcDiagramProps {
  /** When provided, the component operates in controlled mode for part selection */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Hide the bottom selector grid and right detail panel (used when atlas layout provides them) */
  atlasMode?: boolean
  initialZoom?: number
  isFullscreen?: boolean
  systemType?: 'pc' | 'server' | 'laptop' | 'networking'
  /** Increment this to trigger a clean view reset without entering focus mode */
  viewResetKey?: number
}

const PRESET_ANGLES: Record<CameraPreset, Rotation> = {
  isometric: { x: 12, y: -18 },
  front: { x: 0, y: 70 },
  interior: { x: 0, y: 0 },
  rear: { x: 0, y: -70 },
  exploded: { x: 20, y: -24 },
}

// case is 330×420px, center = (165, 210)
// pan = -(partCenter - caseCenter) to move camera toward the part
const COMPONENT_FOCUS_PRESETS: Record<string, { zoom: number; rotation: Rotation; pan: Pan }> = {
  motherboard: { zoom: 1.85, rotation: { x: 2, y: -4  }, pan: { x: -20,  y: 44   } },
  cpu:         { zoom: 2.4,  rotation: { x: 4, y: -6  }, pan: { x: 0,    y: 141  } },
  cooling:     { zoom: 2.2,  rotation: { x: 8, y: -12 }, pan: { x: 0,    y: 141  } },
  ram:         { zoom: 2.4,  rotation: { x: 6, y: -8  }, pan: { x: -80,  y: 136  } },
  gpu:         { zoom: 2.1,  rotation: { x: 10, y: -14}, pan: { x: -30,  y: 6    } },
  storage:     { zoom: 2.4,  rotation: { x: 4, y: -5  }, pan: { x: -10,  y: 62   } },
  'sata-hdd':  { zoom: 2.1,  rotation: { x: 6, y: -10 }, pan: { x: -65,  y: -162 } },
  psu:         { zoom: 2.0,  rotation: { x: 6, y: -12 }, pan: { x: 25,   y: -162 } },
  'case-fans': { zoom: 1.6,  rotation: { x: 8, y: 15  }, pan: { x: -35,  y: 15   } },
  'cmos-battery': { zoom: 2.5, rotation: { x: 4, y: -5}, pan: { x: -75,  y: -1   } },
  fpanel:      { zoom: 2.4,  rotation: { x: 4, y: -5  }, pan: { x: -145, y: -189 } },
  chassis:     { zoom: 1.35, rotation: { x: 12, y: -18}, pan: { x: -20,  y: 0    } },

  // Server Parts
  'server-mobo':    { zoom: 1.6,  rotation: { x: 0, y: -4  }, pan: { x: 0,   y: 0   } },
  'server-cpu':     { zoom: 2.4,  rotation: { x: 0, y: -6  }, pan: { x: 0,   y: 40  } },
  'server-ram':     { zoom: 2.2,  rotation: { x: 0, y: -8  }, pan: { x: 0,   y: 40  } },
  'server-cooling': { zoom: 1.8,  rotation: { x: 0, y: -12 }, pan: { x: 0,   y: 100 } },
  'server-psu':     { zoom: 2.0,  rotation: { x: 0, y: -12 }, pan: { x: 60,  y: -150} },
  'server-storage': { zoom: 2.1,  rotation: { x: 0, y: 10  }, pan: { x: -60, y: 180 } },
  'server-chassis': { zoom: 1.1,  rotation: { x: 12, y: -18}, pan: { x: 0,   y: 0   } },
}

// Helper to get focus presets adjusted for fullscreen vs windowed vs mobile mode
function getFocusPreset(id: string, isFs: boolean, isMobile: boolean = false) {
  const base = COMPONENT_FOCUS_PRESETS[id]
  if (!base) return null
  if (isFs && !isMobile) return base

  // When on mobile or NOT in fullscreen, scale down zoom so parts don't over-magnify or crop out
  const zoomFactor = isMobile ? 0.44 : 0.68
  const minZoom = isMobile ? 0.80 : 1.18
  const adjustedZoom = Math.max(minZoom, +(base.zoom * zoomFactor).toFixed(2))
  const panFactor = isMobile ? 0.52 : (adjustedZoom / base.zoom)

  return {
    zoom: adjustedZoom,
    rotation: base.rotation,
    pan: {
      x: Math.round(base.pan.x * panFactor),
      y: Math.round(base.pan.y * panFactor),
    },
  }
}

export default function PcDiagram({
  selectedId,
  onSelect,
  atlasMode = false,
  initialZoom,
  isFullscreen: isFsProp,
  systemType = 'pc',
  viewResetKey,
}: PcDiagramProps = {}) {
  const [internalFs, setInternalFs] = useState<boolean>(() =>
    typeof document !== 'undefined' ? !!document.fullscreenElement : false
  )

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  const getMobileFitZoom = useCallback(() => {
    if (typeof window === 'undefined') return 0.64
    const w = window.innerWidth
    // Fits a 330px case with rotation within mobile screen width
    return Math.min(0.70, Math.max(0.48, parseFloat(((w - 32) / 460).toFixed(2))))
  }, [])

  useEffect(() => {
    const onFsChange = () => setInternalFs(!!document.fullscreenElement)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    document.addEventListener('fullscreenchange', onFsChange)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const isFs = isFsProp ?? internalFs
  const defaultZoom = initialZoom ?? (
    isMobile
      ? getMobileFitZoom()
      : (atlasMode ? (isFs ? 1.35 : 1.1) : 1.0)
  )
  const [internalSelected, setInternalSelected] = useState<PcPart>(pcParts[1]) // Default to Motherboard
  // In controlled mode, derive selected from prop; fall back to internal state
  const selected = selectedId ? (pcParts.find(p => p.id === selectedId) ?? internalSelected) : internalSelected
  const [activePreset, setActivePreset] = useState<CameraPreset>('interior')
  const [rotation, setRotation] = useState<Rotation>(PRESET_ANGLES.interior)
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false)
  const [wiringMode, setWiringMode] = useState<boolean>(false)
  const [workbenchProps, setWorkbenchProps] = useState<boolean>(false)
  const [buildStep, setBuildStep] = useState<number>(10) // 10 = fully assembled
  const [powerOn, setPowerOn] = useState<boolean>(true)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [glassPanelOn, setGlassPanelOn] = useState<boolean>(false) // Default OPEN CASE
  const [activeTab, setActiveTab] = useState<'specs' | 'install' | 'diagnostics'>('specs')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(defaultZoom)
  const [focusMode, setFocusMode] = useState<boolean>(false)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })

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

  const select = (id: string, forceFocus?: boolean) => {
    const part = pcParts.find(p => p.id === id)
    if (!part) return
    playClickSound(1050, 0.04)
    const alreadyFocused = focusMode && selected.id === id
    setInternalSelected(part)
    onSelect?.(id)
    // Always zoom in on click; if already focused on same part, toggle off
    if (alreadyFocused && forceFocus !== true) {
      setFocusMode(false)
      setZoom(isMobile ? getMobileFitZoom() : defaultZoom)
      setRotation(PRESET_ANGLES.interior)
      setPan({ x: 0, y: 0 })
    } else {
      setFocusMode(true)
      setIsAutoSpinning(false)
      const preset = getFocusPreset(id, isFs, isMobile)
      if (preset) {
        setZoom(preset.zoom)
        setRotation(preset.rotation)
        setPan(preset.pan)
      }
    }
  }


  const exitFocusMode = () => {
    playClickSound(750, 0.03)
    setFocusMode(false)
    setZoom(isMobile ? getMobileFitZoom() : defaultZoom)
    setRotation(PRESET_ANGLES.interior)
    setPan({ x: 0, y: 0 })
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
    setFocusMode(false)
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
    setFocusMode(false)
    setActivePreset('interior')
    setRotation(PRESET_ANGLES.interior)
    setZoom(isMobile ? getMobileFitZoom() : defaultZoom)
    setPan({ x: 0, y: 0 })
  }

  const prevSelectedId = useRef(selectedId)

  // Auto-focus whenever selectedId changes (controlled mode from AtlasExplorer)
  useEffect(() => {
    if (!selectedId) return

    if (selectedId === prevSelectedId.current) {
      // If it hasn't changed, this is either initial mount, strict mode re-run, or an isFs change.
      // We only apply preset adjustments if we are ALREADY focused.
      if (focusMode) {
        const preset = getFocusPreset(selectedId, isFs, isMobile)
        if (preset) {
          setZoom(preset.zoom)
          setRotation(preset.rotation)
          setPan(preset.pan)
        }
      }
      return
    }

    prevSelectedId.current = selectedId
    setFocusMode(true)
    setIsAutoSpinning(false)
    const preset = getFocusPreset(selectedId, isFs, isMobile)
    if (preset) {
      setZoom(preset.zoom)
      setRotation(preset.rotation)
      setPan(preset.pan)
    }
  }, [selectedId, isFs, isMobile, focusMode])

  // When viewResetKey changes (system type switch), exit focus and reset camera
  const prevResetKey = useRef(viewResetKey)
  useEffect(() => {
    if (viewResetKey === undefined) return
    if (viewResetKey === prevResetKey.current) return
    prevResetKey.current = viewResetKey
    setFocusMode(false)
    setIsAutoSpinning(false)
    setZoom(isMobile ? getMobileFitZoom() : defaultZoom)
    setRotation(PRESET_ANGLES.interior)
    setPan({ x: 0, y: 0 })
  }, [viewResetKey, isMobile, getMobileFitZoom, defaultZoom])

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

  // 2-Finger Pinch-to-Zoom touch handling
  const touchDistanceRef = useRef<number | null>(null)
  const initialPinchZoomRef = useRef<number>(1)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        touchDistanceRef.current = Math.hypot(dx, dy)
        initialPinchZoomRef.current = zoom
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDistanceRef.current !== null) {
        if (e.cancelable) e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const currentDist = Math.hypot(dx, dy)
        const scale = currentDist / touchDistanceRef.current
        const nextZoom = Math.min(2.5, Math.max(0.45, parseFloat((initialPinchZoomRef.current * scale).toFixed(2))))
        setZoom(nextZoom)
      }
    }

    const onTouchEnd = () => {
      touchDistanceRef.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [zoom])

  const zoomIn = () => {
    playClickSound(1000, 0.03)
    setZoom(prev => Math.min(2.5, parseFloat((prev + 0.15).toFixed(2))))
  }
  const zoomOut = () => {
    playClickSound(700, 0.03)
    setZoom(prev => Math.max(0.45, parseFloat((prev - 0.15).toFixed(2))))
  }
  const zoomReset = () => {
    playClickSound(820, 0.03)
    setZoom(isMobile ? getMobileFitZoom() : defaultZoom)
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
              <div className={`active-part-indicator${focusMode ? ' focus-active' : ''}`}>
                <span>{focusMode ? '🎯 FOCUSED:' : 'INSPECTING:'} <strong>{selected.shortName.toUpperCase()}</strong></span>
                <div className="hud-actions-row" style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {focusMode && (
                    <button
                      type="button"
                      className="unfocus-hud-btn"
                      onClick={exitFocusMode}
                      title="Exit focus mode and show all parts"
                    >
                      SHOW ALL
                    </button>
                  )}
                  <button
                    type="button"
                    className="fit-screen-hud-btn"
                    onClick={resetView}
                    title="Fit 3D PC to Screen"
                  >
                    <Focus size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                    FIT VIEW
                  </button>
                </div>
              </div>
              <div className="hud-angle" style={{ marginTop: 4 }}>
                🔍 ZOOM: {zoomPct}%
              </div>
            </div>

            {/* 3D Scene Root */}
            <div className={`scene-container build-step-${buildStep}`}>
              {systemType === 'pc' && (
              <div
                className={`pc-case-3d ${activePreset}${powerOn ? ' pwr-on' : ''}${
                  isDragging ? ' no-transition' : ''
                }${focusMode ? ` focus-mode focusing-${selected.id}` : ''}`}
                style={{
                  transform: `translateX(${pan.x}px) translateY(${pan.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* ⚡ WIRING SVG OVERLAY ⚡ */}
                {wiringMode && (
                  <svg className="wiring-svg-overlay" width="280" height="280" viewBox="0 0 280 280">
                     <path className="wire-power" d="M120,240 C120,200 230,200 230,120" />
                     <path className="wire-data" d="M180,240 C180,220 180,180 180,160 C180,140 140,140 140,140" />
                     <path className="wire-eps" d="M110,240 C110,240 -10,240 -10,80 C-10,30 50,30 50,30" />
                  </svg>
                )}

                {/* 🔧 WORKBENCH PROPS 🔧 */}
                {workbenchProps && (
                  <div className="workbench-props-layer">
                    <div className="prop-wrist-strap" />
                    <div className="prop-multimeter">
                      <div className="multimeter-screen">12.0V</div>
                    </div>
                    <div className="prop-screwdriver" />
                  </div>
                )}
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
              )}
              {systemType === 'server' && (
                <div
                  className={`server-case-3d ${activePreset}${powerOn ? ' pwr-on' : ''}${
                    isDragging ? ' no-transition' : ''
                  }${focusMode ? ` focus-mode focusing-${selected.id}` : ''}`}
                  style={{
                    transform: `translateX(${pan.x}px) translateY(${pan.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Chassis Outer Structure */}
                  <div
                    className={`server-backplane${selected.id === 'server-chassis' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-chassis')
                    }}
                    title="2U Rackmount Server Chassis"
                  >
                  </div>
                  <div className="server-roof" />
                  <div className="server-base" />

                  {/* Fan Wall */}
                  <div
                    className={`hardware-layer server-fan-wall${selected.id === 'server-cooling' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-cooling')
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="server-fan">
                        <div className={`fan-rotor${powerOn ? ' spinning' : ''}`} />
                      </div>
                    ))}
                    <div className="comp-tag mini">FAN WALL</div>
                  </div>

                  {/* Dual Socket Motherboard */}
                  <div
                    className={`hardware-layer server-mobo-plane${selected.id === 'server-mobo' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-mobo')
                    }}
                  >
                  </div>

                  {/* CPU 1 & 2 */}
                  <div
                    className={`hardware-layer server-cpu cpu-1${selected.id === 'server-cpu' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-cpu')
                    }}
                  >
                    <div className="comp-tag mini">CPU 0</div>
                  </div>
                  <div
                    className={`hardware-layer server-cpu cpu-2${selected.id === 'server-cpu' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-cpu')
                    }}
                  >
                    <div className="comp-tag mini">CPU 1</div>
                  </div>

                  {/* RAM Banks */}
                    <div
                      className={`hardware-layer server-ram-banks${selected.id === 'server-ram' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-ram')
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className={`ram-stick bank-${i}`} />
                      ))}
                      <div className="comp-tag mini">ECC RDIMM</div>
                    </div>

                    {/* GPU */}
                    <div
                      className={`hardware-layer server-gpu${selected.id === 'server-gpu' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-gpu')
                      }}
                      title="GPU Accelerator"
                    >
                      <div className="comp-tag mini">GPU</div>
                    </div>

                    {/* RAID Controller */}
                    <div
                      className={`hardware-layer server-raid${selected.id === 'server-raid' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-raid')
                      }}
                      title="RAID Controller"
                    >
                      <div className="comp-tag mini">RAID</div>
                    </div>

                    {/* NIC */}
                    <div
                      className={`hardware-layer server-nic${selected.id === 'server-nic' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-nic')
                      }}
                      title="Network Interface Card"
                    >
                      <div className="comp-tag mini">NIC</div>
                    </div>

                    {/* Expansion Cards */}
                    <div
                      className={`hardware-layer server-expansion${selected.id === 'server-expansion' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-expansion')
                      }}
                      title="PCIe Expansion"
                    >
                      <div className="comp-tag mini">EXP</div>
                    </div>

                    {/* BMC */}
                    <div
                      className={`hardware-layer server-bmc${selected.id === 'server-bmc' ? ' selected' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        select('server-bmc')
                      }}
                      title="BMC/IPMI Controller"
                    >
                      <div className="comp-tag mini">BMC</div>
                    </div>

                  {/* Rear Network Ports */}
                  <div
                    className={`hardware-layer server-network-ports${selected.id === 'server-network-ports' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-network-ports')
                    }}
                    title="Rear I/O Network Ports"
                  >
                    <div className="comp-tag mini">I/O PORTS</div>
                  </div>

                  {/* Hot Swap Drive Bays (Front) */}
                  <div
                    className={`hardware-layer server-front-bays${selected.id === 'server-storage' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-storage')
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="hot-swap-bay">
                        <div className="bay-handle" />
                        <div className={`bay-led${powerOn ? ' active' : ''}`} />
                      </div>
                    ))}
                    <div className="comp-tag mini">SAS/SATA BAYS</div>
                  </div>

                  {/* Redundant PSU (Rear) */}
                  <div
                    className={`hardware-layer server-psu-block${selected.id === 'server-psu' ? ' selected' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      select('server-psu')
                    }}
                  >
                    <div className="server-psu-module psu-1">
                      <div className="psu-handle" />
                      <div className={`psu-fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                    <div className="server-psu-module psu-2">
                      <div className="psu-handle" />
                      <div className={`psu-fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                    <div className="comp-tag mini">REDUNDANT PSU</div>
                  </div>

                </div>
              )}
              {systemType === 'laptop' && (
                <div className="laptop-case-3d">
                  <div className="laptop-palmrest" />
                  <div className="laptop-screen-hinge" />
                  
                  {/* Motherboard / Logic Board */}
                  <div
                    className={`hardware-layer laptop-mobo${selected.id === 'laptop-mobo' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-mobo') }}
                  />

                  {/* Battery */}
                  <div
                    className={`hardware-layer laptop-battery${selected.id === 'laptop-battery' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-battery') }}
                  >
                    <div className="comp-tag mini">LITHIUM-ION</div>
                  </div>

                  {/* Cooling / Heatpipes */}
                  <div
                    className={`hardware-layer laptop-cooling${selected.id === 'laptop-cooling' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-cooling') }}
                  >
                    <div className="laptop-heatpipe" />
                    <div className="laptop-blower-fan">
                      <div className={`fan-rotor${powerOn ? ' spinning' : ''}`} />
                    </div>
                  </div>

                  {/* RAM (SO-DIMM) */}
                  <div
                    className={`hardware-layer laptop-ram${selected.id === 'laptop-ram' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-ram') }}
                  >
                    <div className="sodimm-stick stick-1" />
                    <div className="sodimm-stick stick-2" />
                    <div className="comp-tag mini">SO-DIMM</div>
                  </div>

                  {/* NVMe SSD */}
                  <div
                    className={`hardware-layer laptop-storage${selected.id === 'laptop-storage' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-storage') }}
                  >
                    <div className="comp-tag mini">M.2 NVMe</div>
                  </div>

                  {/* Wi-Fi Card */}
                  <div
                    className={`hardware-layer laptop-wifi${selected.id === 'laptop-wifi' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('laptop-wifi') }}
                  >
                    <div className="comp-tag mini">WLAN</div>
                  </div>
                </div>
              )}

              {systemType === 'networking' && (
                <div className="networking-rack-3d">
                  <div className="rack-frame" />
                  
                  {/* Wi-Fi Router */}
                  <div
                    className={`hardware-layer net-wifi-router${selected.id === 'wifi-router' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('wifi-router') }}
                  >
                    <div className="router-antennas">
                      <div className="antenna" />
                      <div className="antenna" />
                      <div className="antenna" />
                      <div className="antenna" />
                    </div>
                    <div className="comp-tag mini">ROUTER</div>
                  </div>

                  {/* Network Switch */}
                  <div
                    className={`hardware-layer net-switch${selected.id === 'network-switch' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('network-switch') }}
                  >
                    <div className="switch-ports">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className={`rj45-port${powerOn ? ' active' : ''}`} />
                      ))}
                    </div>
                    <div className="comp-tag mini">24-PORT SWITCH</div>
                  </div>

                  {/* Patch Panel */}
                  <div
                    className={`hardware-layer net-patch-panel${selected.id === 'patch-panel' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('patch-panel') }}
                  >
                    <div className="patch-ports">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="rj45-port patched" />
                      ))}
                    </div>
                    <div className="comp-tag mini">PATCH PANEL</div>
                  </div>

                  {/* LAN Tester (prop on side) */}
                  <div
                    className={`hardware-layer net-lan-tester${selected.id === 'lan-tester' ? ' selected' : ''}`}
                    onClick={e => { e.stopPropagation(); select('lan-tester') }}
                  >
                    <div className="tester-leds">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`tester-led${powerOn ? ' active' : ''}`} />
                      ))}
                    </div>
                    <div className="comp-tag mini">TESTER</div>
                  </div>
                </div>
              )}
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
                    className={`atlas-dock-btn${wiringMode ? ' active' : ''}`}
                    onClick={() => setWiringMode(prev => !prev)}
                    title="Toggle Wiring & Power Flow Mode"
                  >
                    <Zap size={13} strokeWidth={1.75} />
                    <span>Wiring</span>
                  </button>
                  <button
                    type="button"
                    className={`atlas-dock-btn${workbenchProps ? ' active' : ''}`}
                    onClick={() => setWorkbenchProps(prev => !prev)}
                    title="Toggle Workbench Tools (Multimeter, Strap)"
                  >
                    <Wrench size={13} strokeWidth={1.75} />
                    <span>Props</span>
                  </button>
                </div>

                <div className="atlas-dock-sep" />

                <div className="atlas-dock-group" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    className="atlas-dock-btn icon-only"
                    onClick={() => setBuildStep(s => Math.max(0, s - 1))}
                    disabled={buildStep === 0}
                    title="Previous Build Step"
                  >
                    <ChevronLeft size={13} strokeWidth={1.75} />
                  </button>
                  <span style={{ fontSize: '11px', color: '#9ca3af', minWidth: '40px', textAlign: 'center' }}>
                    Step {buildStep}/10
                  </span>
                  <button
                    type="button"
                    className="atlas-dock-btn icon-only"
                    onClick={() => setBuildStep(s => Math.min(10, s + 1))}
                    disabled={buildStep === 10}
                    title="Next Build Step"
                  >
                    <ChevronRight size={13} strokeWidth={1.75} />
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
                  <button
                    type="button"
                    className={`atlas-dock-btn focus-pill${focusMode ? ' active' : ''}`}
                    onClick={() => {
                      if (focusMode) {
                        exitFocusMode()
                      } else {
                        select(selected.id, true)
                      }
                    }}
                    title={focusMode ? 'Show All Parts' : `Focus & Isolate ${selected.shortName} (Blur other parts)`}
                  >
                    <Focus size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>{focusMode ? 'Isolated' : 'Isolate'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Viewport Footer */
              <div className="viewport-footer">
                <span className="mono-help">
                  🖱️ Drag to orbit • Scroll to zoom • Click part to isolate • Click again to show all
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