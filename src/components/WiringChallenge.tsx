import { useState, useEffect, useCallback } from 'react'
import {
  WIRE_COLORS,
  T568B_PINOUT,
  T568A_PINOUT,
  type WireColor,
} from '../data/cablingData'
import {
  Timer,
  Trophy,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  Shuffle,
  Flame,
  Star,
  TrendingUp,
} from 'lucide-react'

/* ── Types ────────────────────────────────────────────── */
type Standard = 'T568B' | 'T568A' | 'CROSSOVER_A' | 'CROSSOVER_B'
type GameState = 'idle' | 'countdown' | 'playing' | 'result'

interface AttemptRecord {
  standard: Standard
  timeMs: number
  mistakes: number[]   // 0-indexed pins that were wrong on first submit
  passed: boolean
  date: string
}

/* ── Helpers ──────────────────────────────────────────── */
const TARGET: Record<Standard, string[]> = {
  T568B: T568B_PINOUT,
  T568A: T568A_PINOUT,
  CROSSOVER_A: T568A_PINOUT,
  CROSSOVER_B: T568B_PINOUT,
}

const STANDARD_LABEL: Record<Standard, string> = {
  T568B:       'T-568B (Straight-Through)',
  T568A:       'T-568A (Straight-Through)',
  CROSSOVER_A: 'Crossover — End A (T-568A)',
  CROSSOVER_B: 'Crossover — End B (T-568B)',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000)
  const centis = Math.floor((ms % 1000) / 10)
  return `${String(s).padStart(2, '0')}:${String(centis).padStart(2, '0')}`
}

function getRating(ms: number, mistakes: number): { stars: number; label: string; color: string } {
  if (mistakes === 0 && ms < 20000) return { stars: 3, label: 'Perfect – Assessment Ready!', color: '#15803d' }
  if (mistakes === 0 && ms < 40000) return { stars: 2, label: 'Excellent – Almost Perfect!', color: '#2563eb' }
  if (mistakes <= 2 && ms < 60000) return { stars: 1, label: 'Good – Keep Practicing!', color: '#d97706' }
  return { stars: 0, label: 'Needs More Practice', color: '#b91c1c' }
}

/* ── Wire Swatch ──────────────────────────────────────── */
function WireSwatch({ wire, size = 'md' }: { wire: WireColor; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? '16px' : '22px'
  const w = size === 'sm' ? '36px' : '52px'
  return (
    <div style={{
      width: w, height: h,
      border: '1px solid rgba(0,0,0,0.22)',
      borderRadius: '2px',
      background: wire.stripeColor
        ? `repeating-linear-gradient(45deg, #fff, #fff 5px, ${wire.stripeColor} 5px, ${wire.stripeColor} 10px)`
        : wire.primaryColor,
      flexShrink: 0,
    }} />
  )
}

/* ── Slot ─────────────────────────────────────────────── */
function Slot({
  pinIndex,
  wireId,
  targetId,
  showResult,
  onClick,
}: {
  pinIndex: number
  wireId: string | null
  targetId: string
  showResult: boolean
  onClick: () => void
}) {
  const wire = WIRE_COLORS.find(w => w.id === wireId)
  const targetWire = WIRE_COLORS.find(w => w.id === targetId)!
  const isCorrect = wireId === targetId
  const borderColor = showResult
    ? (isCorrect ? '#16a34a' : '#dc2626')
    : wireId ? '#64748b' : '#cbd5e1'

  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${borderColor}`,
        background: showResult && !isCorrect ? '#fef2f2' : '#f8fafc',
        borderRadius: '3px',
        padding: '8px 6px',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Pin label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--ink)',
        borderBottom: '1px solid var(--line)',
        width: '100%',
        textAlign: 'center',
        paddingBottom: '4px',
      }}>
        P{pinIndex + 1}
      </div>

      {/* Wire body */}
      {wire ? (
        <div style={{
          width: '28px',
          height: '56px',
          border: '1px solid rgba(0,0,0,0.22)',
          borderRadius: '2px',
          background: wire.stripeColor
            ? `repeating-linear-gradient(45deg,#fff,#fff 6px,${wire.stripeColor} 6px,${wire.stripeColor} 12px)`
            : wire.primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '4px 0',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.92)',
            color: '#0f172a',
            padding: '1px 3px',
            borderRadius: '2px',
          }}>
            {wire.shortName}
          </span>
        </div>
      ) : (
        <div style={{
          width: '26px',
          height: '56px',
          border: '1px dashed #cbd5e1',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '1.1rem',
        }}>+</div>
      )}

      {/* Status + expected */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        {showResult && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: isCorrect ? '#15803d' : '#b91c1c',
            marginBottom: '2px',
          }}>
            {isCorrect ? '✓ OK' : '✕ WRONG'}
          </div>
        )}
        <div style={{
          fontSize: '0.6rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--steel)',
          borderTop: '1px dotted var(--line)',
          paddingTop: '2px',
        }}>
          {showResult ? targetWire.shortName : 'Empty'}
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ───────────────────────────────────── */
export default function WiringChallenge() {
  const [standard, setStandard] = useState<Standard>('T568B')
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [countdown, setCountdown] = useState(3)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // The plug slots (8 slots), each holds a wire id or null
  const [slots, setSlots] = useState<(string | null)[]>(new Array(8).fill(null))
  // Wire palette (shuffled pool to pick from)
  const [palette, setPalette] = useState<string[]>([])
  const [selectedWire, setSelectedWire] = useState<string | null>(null)

  const [showResult, setShowResult] = useState(false)
  const [mistakePins, setMistakePins] = useState<number[]>([])
  const [passed, setPassed] = useState(false)
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])

  const target = TARGET[standard]

  // Time limit per difficulty
  const timeLimit: Record<string, number | null> = {
    easy: null,      // no limit
    normal: 90000,   // 90 s
    hard: 45000,     // 45 s
  }
  const limit = timeLimit[difficulty]

  // Countdown before game starts
  useEffect(() => {
    if (gameState !== 'countdown') return
    if (countdown === 0) {
      setGameState('playing')
      setStartTime(Date.now())
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, countdown])

  // Running clock
  useEffect(() => {
    if (gameState !== 'playing') return
    const t = setInterval(() => {
      const elapsed = startTime ? Date.now() - startTime : 0
      setElapsedMs(elapsed)
      // Auto-fail if hard / normal time runs out
      if (limit && elapsed >= limit) {
        handleTimeUp()
      }
    }, 50)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, startTime, limit])

  const handleTimeUp = useCallback(() => {
    const elapsed = startTime ? Date.now() - startTime : 0
    const wrong = target.map((id, i) => slots[i] !== id ? i : -1).filter(i => i !== -1)
    setMistakePins(wrong)
    setShowResult(true)
    setPassed(false)
    setGameState('result')
    const record: AttemptRecord = {
      standard,
      timeMs: elapsed,
      mistakes: wrong,
      passed: false,
      date: new Date().toLocaleTimeString(),
    }
    setAttempts(prev => [record, ...prev].slice(0, 20))
  }, [slots, target, startTime, standard])

  const startGame = () => {
    setSlots(new Array(8).fill(null))
    setPalette(shuffle(WIRE_COLORS.map(w => w.id)))
    setSelectedWire(null)
    setShowResult(false)
    setMistakePins([])
    setPassed(false)
    setElapsedMs(0)
    setStartTime(null)
    setCountdown(3)
    setGameState('countdown')
  }

  const handleSlotClick = (idx: number) => {
    if (gameState !== 'playing') return
    if (selectedWire) {
      const updated = [...slots]
      const existingIdx = updated.indexOf(selectedWire)
      if (existingIdx !== -1 && existingIdx !== idx) updated[existingIdx] = null
      updated[idx] = selectedWire
      setSlots(updated)
      setSelectedWire(null)
    } else {
      if (slots[idx] !== null) {
        const updated = [...slots]
        updated[idx] = null
        setSlots(updated)
      }
    }
  }

  const handlePaletteClick = (id: string) => {
    if (gameState !== 'playing') return
    setSelectedWire(prev => prev === id ? null : id)
  }

  const handleSubmit = () => {
    if (gameState !== 'playing') return
    const elapsed = startTime ? Date.now() - startTime : 0
    const wrong = target.map((id, i) => slots[i] !== id ? i : -1).filter(i => i !== -1)
    const ok = wrong.length === 0
    setMistakePins(wrong)
    setShowResult(true)
    setPassed(ok)
    setGameState('result')
    const record: AttemptRecord = {
      standard,
      timeMs: elapsed,
      mistakes: wrong,
      passed: ok,
      date: new Date().toLocaleTimeString(),
    }
    setAttempts(prev => [record, ...prev].slice(0, 20))
  }

  const rating = passed ? getRating(elapsedMs, mistakePins.length) : null

  // Progress bar (time limit)
  const progress = limit ? Math.min((elapsedMs / limit) * 100, 100) : 0
  const progressColor = progress < 60 ? '#16a34a' : progress < 85 ? '#d97706' : '#dc2626'

  // Best time for current standard
  const bestRecord = attempts.filter(a => a.standard === standard && a.passed)
    .sort((a, b) => a.timeMs - b.timeMs)[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Header + Config ────────────────────────────────── */}
      <div className="frame">
        <div className="frame-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="label">TESDA Practical Assessment Simulator</span>
              <h2 style={{ margin: '4px 0 0 0' }}>⏱ Timed Wiring Challenge</h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem' }}>
                Arrange the 8 wire conductors into correct pin order before time runs out.
                Simulates the pressure of a real TESDA practical skills assessment.
              </p>
            </div>

            {bestRecord && (
              <div style={{
                padding: '10px 14px',
                border: '1px solid #fcd34d',
                background: '#fefce8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <Trophy size={20} color="#ca8a04" />
                <div className="label" style={{ marginTop: '4px', color: '#92400e' }}>Best Time</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: '#92400e' }}>
                  {fmtTime(bestRecord.timeMs)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a16207', fontFamily: 'var(--font-mono)' }}>
                  {STANDARD_LABEL[bestRecord.standard].split(' ')[0]}
                </div>
              </div>
            )}
          </div>

          {/* Config row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Standard */}
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '8px' }}>Wiring Standard:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(['T568B', 'T568A', 'CROSSOVER_A', 'CROSSOVER_B'] as Standard[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    disabled={gameState === 'playing' || gameState === 'countdown'}
                    className={`btn ${standard === s ? 'btn-solid' : ''}`}
                    style={{ fontSize: '0.72rem', textAlign: 'left', justifyContent: 'flex-start' }}
                    onClick={() => setStandard(s)}
                  >
                    {STANDARD_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '8px' }}>Difficulty / Time Limit:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {([
                  { id: 'easy',   label: 'Easy — No time limit',    detail: 'Relaxed, no pressure' },
                  { id: 'normal', label: 'Normal — 90 seconds',      detail: 'Standard assessment pace' },
                  { id: 'hard',   label: 'Hard — 45 seconds',        detail: 'Speed test for exam readiness' },
                ] as const).map(d => (
                  <button
                    key={d.id}
                    type="button"
                    disabled={gameState === 'playing' || gameState === 'countdown'}
                    className={`btn ${difficulty === d.id ? 'btn-solid' : ''}`}
                    style={{ fontSize: '0.72rem', textAlign: 'left', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '7px 14px' }}
                    onClick={() => setDifficulty(d.id)}
                  >
                    <span style={{ fontWeight: 700 }}>{d.label}</span>
                    <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.65rem' }}>{d.detail}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats summary */}
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '8px' }}>Session Stats:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Total Attempts', val: String(attempts.length) },
                  { label: 'Passed', val: String(attempts.filter(a => a.passed).length) },
                  { label: 'Failed', val: String(attempts.filter(a => !a.passed).length) },
                  { label: 'Pass Rate', val: attempts.length ? `${Math.round(attempts.filter(a => a.passed).length / attempts.length * 100)}%` : '—' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', border: '1px solid var(--line)', background: 'var(--paper)' }}>
                    <span className="label">{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem' }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Start / Restart button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-solid"
              style={{ padding: '12px 28px', fontSize: '0.85rem' }}
              onClick={startGame}
              disabled={gameState === 'countdown'}
            >
              {gameState === 'idle' ? <><Play size={16} /> Start Challenge</> :
               gameState === 'result' ? <><RotateCcw size={16} /> Try Again</> :
               gameState === 'playing' ? <><Shuffle size={16} /> Restart</> : 'Starting...'}
            </button>

            {gameState === 'playing' && (
              <button
                type="button"
                className="btn btn-solid"
                style={{ padding: '12px 28px', fontSize: '0.85rem', background: '#16a34a', borderColor: '#15803d' }}
                onClick={handleSubmit}
              >
                <CheckCircle2 size={16} /> Submit Answer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Countdown Overlay ──────────────────────────────── */}
      {gameState === 'countdown' && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          border: '2px solid var(--ink)',
          background: 'var(--ink)',
          color: 'var(--paper)',
        }}>
          <div className="label" style={{ color: 'var(--mist)', marginBottom: '8px' }}>Challenge begins in</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '6rem', fontWeight: 700, lineHeight: 1, color: '#fbbf24' }}>
            {countdown}
          </div>
          <div style={{ marginTop: '12px', color: 'var(--mist)', fontSize: '0.9rem' }}>
            {STANDARD_LABEL[standard]} — {difficulty.toUpperCase()} mode
          </div>
        </div>
      )}

      {/* ── Workbench (Visible when playing or result) ─────── */}
      {(gameState === 'playing' || gameState === 'result') && (
        <div className="frame">
          <div className="frame-inner">
            {/* Timer bar + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Timer size={20} color={gameState === 'result' && !passed ? '#b91c1c' : 'var(--ink)'} />
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: gameState === 'result' && !passed ? '#b91c1c' : 'var(--ink)',
                  letterSpacing: '0.05em',
                }}>
                  {fmtTime(elapsedMs)}
                </div>
                {limit && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--steel)' }}>
                    / {fmtTime(limit)}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="tag">{STANDARD_LABEL[standard]}</span>
                <span className="tag" style={{
                  background: difficulty === 'hard' ? '#fef2f2' : difficulty === 'normal' ? '#fefce8' : '#f0fdf4',
                  color: difficulty === 'hard' ? '#b91c1c' : difficulty === 'normal' ? '#92400e' : '#15803d',
                }}>
                  {difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Time progress bar */}
            {limit && gameState === 'playing' && (
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: progressColor,
                  transition: 'width 0.05s linear, background 0.3s',
                }} />
              </div>
            )}

            {/* Result banner */}
            {gameState === 'result' && (
              <div style={{
                padding: '16px 20px',
                border: `2px solid ${passed ? '#16a34a' : '#dc2626'}`,
                background: passed ? '#f0fdf4' : '#fef2f2',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}>
                {passed
                  ? <CheckCircle2 size={28} color="#15803d" />
                  : <XCircle size={28} color="#b91c1c" />
                }
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: passed ? '#15803d' : '#b91c1c', fontSize: '1.1rem' }}>
                    {passed ? `PASSED — ${fmtTime(elapsedMs)}` : 'FAILED'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: passed ? '#166534' : '#991b1b' }}>
                    {passed
                      ? `${rating?.label} · ${mistakePins.length === 0 ? 'Zero mistakes — perfect crimp!' : `${mistakePins.length} mistake(s) corrected.`}`
                      : mistakePins.length > 0
                        ? `${mistakePins.length} wrong pin(s): Pins ${mistakePins.map(i => i + 1).join(', ')}.`
                        : 'Time expired before completion.'}
                  </p>
                </div>

                {/* Star rating */}
                {rating && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => (
                      <Star
                        key={i}
                        size={24}
                        fill={i < rating.stars ? '#f59e0b' : 'none'}
                        color={i < rating.stars ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── RJ45 Plug ────────────────────────────────── */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="label">
                  RJ45 Connector — Pin 1 (Left) to Pin 8 (Right) — Gold Contacts Facing Up
                </span>
                {gameState === 'playing' && selectedWire && (
                  <span className="tag" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                    Selected: {WIRE_COLORS.find(w => w.id === selectedWire)?.name}
                  </span>
                )}
              </div>

              {/* Gold pin header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', padding: '0 2px', marginBottom: '6px' }}>
                {[1,2,3,4,5,6,7,8].map(p => (
                  <div key={p} style={{
                    height: '14px',
                    background: 'linear-gradient(180deg, #fef08a 0%, #ca8a04 100%)',
                    border: '1px solid #a16207',
                    borderRadius: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#713f12',
                  }}>P{p}</div>
                ))}
              </div>

              {/* Slots grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
                {slots.map((wid, i) => (
                  <Slot
                    key={i}
                    pinIndex={i}
                    wireId={wid}
                    targetId={target[i]}
                    showResult={showResult}
                    onClick={() => handleSlotClick(i)}
                  />
                ))}
              </div>

              {/* Cable jacket bar */}
              <div style={{
                marginTop: '8px',
                padding: '8px 14px',
                background: '#334155',
                color: '#f8fafc',
                borderRadius: '2px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>▼ CABLE JACKET / STRAIN-RELIEF WEDGE</span>
                <span>CAT 5e / CAT 6 UTP</span>
              </div>
            </div>

            {/* ── Wire Palette ──────────────────────────────── */}
            {gameState === 'playing' && (
              <div>
                <span className="label" style={{ display: 'block', marginBottom: '10px' }}>
                  Available Wires — Click to select, then click a slot above:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                  {palette.map(id => {
                    const wire = WIRE_COLORS.find(w => w.id === id)!
                    const inSlot = slots.includes(id)
                    const isSelected = selectedWire === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handlePaletteClick(id)}
                        style={{
                          border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                          background: isSelected ? '#f1f5f9' : 'var(--paper)',
                          padding: '8px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 0 2px var(--ink)' : 'none',
                          opacity: inSlot ? 0.55 : 1,
                          transition: 'all 0.1s',
                        }}
                      >
                        <WireSwatch wire={wire} />
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 600, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2 }}>
                          {wire.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: inSlot ? '#94a3b8' : '#15803d' }}>
                          {inSlot ? '✓ Placed' : '● Available'}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Submit row */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-solid"
                    style={{ background: '#16a34a', borderColor: '#15803d', padding: '10px 22px' }}
                    onClick={handleSubmit}
                    disabled={slots.some(s => s === null)}
                  >
                    <CheckCircle2 size={15} /> Submit & Check Wiring
                  </button>
                  {slots.some(s => s === null) && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--steel)' }}>
                      Fill all 8 pins first
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Answer Key (shown after result) ───────────── */}
            {gameState === 'result' && (
              <div style={{ marginTop: '24px' }}>
                <span className="label" style={{ display: 'block', marginBottom: '10px' }}>Answer Key — Correct Pinout:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {target.map((id, i) => {
                    const wire = WIRE_COLORS.find(w => w.id === id)!
                    const yourWire = WIRE_COLORS.find(w => w.id === slots[i])
                    const isWrong = mistakePins.includes(i)
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 10px',
                        background: isWrong ? '#fef2f2' : '#f0fdf4',
                        border: `1px solid ${isWrong ? '#fca5a5' : '#86efac'}`,
                        borderRadius: '2px',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.78rem', minWidth: '40px' }}>Pin {i + 1}</span>
                        {isWrong ? <XCircle size={14} color="#b91c1c" /> : <CheckCircle2 size={14} color="#15803d" />}
                        <WireSwatch wire={wire} size="sm" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{wire.name}</span>
                        {isWrong && yourWire && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#b91c1c', marginLeft: 'auto' }}>
                            You placed: {yourWire.name}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Idle Instruction Card ─────────────────────────── */}
      {gameState === 'idle' && (
        <div className="panel-dark">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🎯', title: 'How to Play', desc: 'Select a standard and difficulty, then click Start. Wires will be shuffled — arrange them correctly into the 8 pin slots.' },
              { icon: '⏱', title: 'Time Pressure', desc: 'Normal mode gives you 90 seconds, Hard mode gives 45. Easy mode has no limit — good for beginners.' },
              { icon: '⭐', title: 'Star Rating', desc: 'Earn 3 stars for perfect wiring under 20 seconds. 2 stars under 40s, 1 star under 60s.' },
              { icon: '📊', title: 'Mistake Tracking', desc: 'Every wrong pin is tracked. Review the answer key after each attempt to identify your recurring mistakes.' },
            ].map(c => (
              <div key={c.title}>
                <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{c.icon}</div>
                <strong style={{ color: 'var(--paper)', display: 'block', marginBottom: '4px' }}>{c.title}</strong>
                <p style={{ color: 'var(--mist)', fontSize: '0.83rem', margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Attempt History ───────────────────────────────── */}
      {attempts.length > 0 && (
        <div className="frame">
          <div className="frame-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="label">Performance Log</span>
                <h3 style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} /> Session Attempt History
                </h3>
              </div>
              <button
                type="button"
                className="btn"
                style={{ fontSize: '0.7rem' }}
                onClick={() => setAttempts([])}
              >
                Clear History
              </button>
            </div>

            <table className="spec-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>Standard</th>
                  <th>Duration</th>
                  <th>Mistakes</th>
                  <th>Wrong Pins</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i}>
                    <td><span className="mono">{attempts.length - i}</span></td>
                    <td><span className="mono" style={{ fontSize: '0.72rem' }}>{a.date}</span></td>
                    <td><span className="mono" style={{ fontSize: '0.72rem' }}>{STANDARD_LABEL[a.standard]}</span></td>
                    <td>
                      <span className="mono" style={{ fontWeight: 700 }}>{fmtTime(a.timeMs)}</span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: a.mistakes.length === 0 ? '#15803d' : '#b91c1c',
                      }}>
                        {a.mistakes.length}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--graphite)' }}>
                        {a.mistakes.length > 0 ? `Pin ${a.mistakes.map(m => m + 1).join(', ')}` : '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: a.passed ? '#15803d' : '#b91c1c',
                      }}>
                        {a.passed ? '✓ PASS' : '✕ FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Recurring mistake pattern */}
            {attempts.length >= 3 && (() => {
              const pinFreq = new Array(8).fill(0)
              attempts.forEach(a => a.mistakes.forEach(m => { pinFreq[m]++ }))
              const worst = pinFreq
                .map((count, i) => ({ pin: i + 1, count }))
                .filter(p => p.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
              if (worst.length === 0) return null
              return (
                <div className="callout" style={{ marginTop: '16px' }}>
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Flame size={14} /> Recurring Mistakes — Focus Area:
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {worst.map(w => {
                      const wireId = target[w.pin - 1]
                      const wire = WIRE_COLORS.find(c => c.id === wireId)
                      return (
                        <div key={w.pin} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          border: '1px solid #fca5a5',
                          background: '#fef2f2',
                          borderRadius: '2px',
                        }}>
                          {wire && <WireSwatch wire={wire} size="sm" />}
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700 }}>
                            Pin {w.pin}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#b91c1c' }}>
                            {w.count}× wrong
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
