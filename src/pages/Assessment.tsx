import { useState, useEffect } from 'react'
import { Cpu, Layers, Network, Cable, Wrench, ClipboardCheck, CheckCircle2, Lock, ChevronRight, History, MonitorPlay, Server } from 'lucide-react'
import { hardwareQuizQuestions } from '../data/hardwareQuiz'
import { networkingQuizQuestions } from '../data/networkingQuiz'
import { cableLabQuizQuestions } from '../data/cableLabQuiz'
import { troubleshootingQuizQuestions } from '../data/troubleshootingQuiz'
import { pcPartsQuizQuestions } from '../data/pcPartsQuiz'
import { historyQuiz } from '../data/historyQuiz'
import { osQuiz } from '../data/osQuiz'
import { serverQuiz } from '../data/serverQuiz'
import AssessmentQuiz from '../components/AssessmentQuiz'
import '../styles/tech-pages.css'
import type { QuizQuestion } from '../data/hardwareQuiz'

interface ModuleInfo {
  id: string
  code: string
  coc: string
  title: string
  desc: string
  icon: any
  color: string
  glowColor: string
  hours: string
  questions: QuizQuestion[]
}

const modules: ModuleInfo[] = [
  {
    id: 'history',
    code: 'MOD-00',
    coc: 'Core',
    title: 'Fundamentals & History',
    desc: 'Evolution of computers, ARPANET to Internet, IT basic concepts, and Occupational Health & Safety (OHS).',
    icon: History,
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.15)',
    hours: '4 hrs',
    questions: historyQuiz,
  },
  {
    id: 'hardware',
    code: 'MOD-01',
    coc: 'COC 1',
    title: 'Computer Hardware Architecture',
    desc: 'Assembly, disassembly, ESD safety, motherboard anatomy, and CPU sockets.',
    icon: Cpu,
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    hours: '12 hrs',
    questions: hardwareQuizQuestions,
  },
  {
    id: 'pcparts',
    code: 'MOD-02',
    coc: 'COC 1',
    title: 'PC Parts 3D Atlas & Chassis',
    desc: 'Component identification, PCIe slots, form factors, storage interfaces, and power rails.',
    icon: Layers,
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    hours: '8 hrs',
    questions: pcPartsQuizQuestions,
  },
  {
    id: 'osinstallation',
    code: 'MOD-03',
    coc: 'COC 1',
    title: 'OS Installation & Configuration',
    desc: 'BIOS/UEFI setup, creating bootable media, installing Windows 10/11, and device driver configuration.',
    icon: MonitorPlay,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.15)',
    hours: '10 hrs',
    questions: osQuiz,
  },
  {
    id: 'networking',
    code: 'MOD-04',
    coc: 'COC 3',
    title: 'Networking & IP Subnetting',
    desc: 'OSI 7-layer model, IPv4 subnetting, topologies, TCP/UDP, and routing concepts.',
    icon: Network,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.15)',
    hours: '14 hrs',
    questions: networkingQuizQuestions,
  },
  {
    id: 'cablelab',
    code: 'LAB-01',
    coc: 'COC 3',
    title: 'RJ45 Cable Crimping Lab',
    desc: 'T568A/B standards, straight-through vs crossover, crimping SOP, and continuity testing.',
    icon: Cable,
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    hours: '6 hrs',
    questions: cableLabQuizQuestions,
  },
  {
    id: 'serversetup',
    code: 'MOD-05',
    coc: 'COC 3',
    title: 'Server Setup & Administration',
    desc: 'Deploying Windows Server, Active Directory Domain Services, DHCP, DNS, and Group Policy Objects.',
    icon: Server,
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    hours: '16 hrs',
    questions: serverQuiz,
  },
  {
    id: 'troubleshooting',
    code: 'MOD-06',
    coc: 'COC 1 & 4',
    title: 'Troubleshooting & Diagnostics',
    desc: 'POST sequence, BIOS beep codes, BSOD stop codes, multimeter PSU testing, and preventive maintenance.',
    icon: Wrench,
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    hours: '10 hrs',
    questions: troubleshootingQuizQuestions,
  },
]

const STORAGE_KEY = 'csslab_assessment_scores'

interface ScoreRecord {
  pct: number
  passed: boolean
  date: string
}

export default function Assessment() {
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null)
  const [scores, setScores] = useState<Record<string, ScoreRecord>>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setScores(JSON.parse(stored))
    } catch {}
  }, [])

  const saveScore = (moduleId: string, pct: number, passed: boolean) => {
    const updated = { ...scores, [moduleId]: { pct, passed, date: new Date().toLocaleDateString('en-PH') } }
    setScores(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  if (selectedModule) {
    return (
      <main className="page" style={{ padding: 0 }}>
        <header className="tech-page-header">
          <div className="tech-page-glow glow-emerald" />
          <div className="container">
            <div className="tech-header-badge">
              <span className="tech-pulse-dot" />
              <span>ASSESSMENT HUB // {selectedModule.code} // {selectedModule.coc}</span>
            </div>
            <h1 className="tech-page-title">
              <span className="tech-title-gradient-emerald">{selectedModule.title}</span>
            </h1>
            <p className="tech-page-desc">Module Assessment — TESDA CSS NC II Competency Standard</p>
          </div>
        </header>
        <div className="container" style={{ paddingBottom: 64 }}>
          <AssessmentQuizWrapper
            module={selectedModule}
            onReset={() => setSelectedModule(null)}
            onComplete={(pct, passed) => saveScore(selectedModule.id, pct, passed)}
          />
        </div>
      </main>
    )
  }

  const totalPassed = Object.values(scores).filter(s => s.passed).length

  return (
    <main className="page" style={{ padding: 0 }}>
      <header className="tech-page-header">
        <div className="tech-page-glow glow-emerald" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>ASSESSMENT HUB // TESDA CSS NC II // ALL COMPETENCY UNITS</span>
          </div>
          <h1 className="tech-page-title">
            <span className="tech-title-gradient-emerald">Module Assessment Hub</span>
          </h1>
          <p className="tech-page-desc">
            Piliin ang module na gusto mong i-assess. Bawat module ay may 10 multiple-choice questions 
            batay sa TESDA CSS NC II competency standards. Passing score: <strong style={{ color: '#34d399' }}>75%</strong>.
          </p>
          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <ClipboardCheck size={14} color="#34d399" />
              <span>Modules: <strong>{modules.length} Available</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <CheckCircle2 size={14} color="#34d399" />
              <span>Completed: <strong>{totalPassed} / {modules.length} Passed</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: 64 }}>
        {/* Progress Bar */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
              Overall Progress
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
              {totalPassed} / {modules.length} Modules Passed
            </span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 99, height: 10, overflow: 'hidden' }}>
            <div style={{ width: `${(totalPassed / modules.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        {/* Module Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {modules.map(mod => {
            const Icon = mod.icon
            const score = scores[mod.id]
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModule(mod)}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${score?.passed ? '#86efac' : (score ? '#fca5a5' : '#e2e8f0')}`,
                  borderRadius: 14,
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${mod.glowColor}` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Colored top strip */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: mod.color, borderRadius: '14px 14px 0 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: mod.glowColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={mod.color} />
                  </div>
                  {score ? (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, color: score.passed ? '#15803d' : '#c2410c', lineHeight: 1 }}>
                        {score.pct}%
                      </div>
                      <div style={{ fontSize: '0.65rem', color: score.passed ? '#16a34a' : '#dc2626', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {score.passed ? '✓ PASSED' : '✗ FAILED'}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: 4 }}>
                      NOT TAKEN
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="tech-badge tech-badge-indigo">{mod.code}</span>
                    <span className="tech-badge tech-badge-emerald">{mod.coc}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '4px 0 6px', lineHeight: 1.3 }}>{mod.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{mod.desc}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94a3b8' }}>{mod.hours} • {mod.questions.length} items</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 700, color: mod.color }}>
                    {score ? 'Retake' : 'Take Quiz'} <ChevronRight size={14} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Score Summary Table */}
        {Object.keys(scores).length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>// ASSESSMENT HISTORY</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>Your Score Summary</h3>
            </div>
            <div className="tech-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(m => {
                    const s = scores[m.id]
                    if (!s) return null
                    return (
                      <tr key={m.id}>
                        <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{m.code}</strong></td>
                        <td>{m.title}</td>
                        <td><strong style={{ fontFamily: 'var(--font-mono)', color: s.passed ? '#15803d' : '#c2410c' }}>{s.pct}%</strong></td>
                        <td><span className={`tech-badge ${s.passed ? 'tech-badge-emerald' : 'tech-badge-amber'}`}>{s.passed ? 'PASSED' : 'FAILED'}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#64748b' }}>{s.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// Wrapper to intercept completion and save score
function AssessmentQuizWrapper({ module: mod, onReset, onComplete }: { module: ModuleInfo; onReset: () => void; onComplete: (pct: number, passed: boolean) => void }) {
  return (
    <AssessmentQuizWithCallback
      questions={mod.questions}
      moduleTitle={mod.title}
      onReset={onReset}
      onComplete={onComplete}
    />
  )
}

function AssessmentQuizWithCallback({ questions, moduleTitle, onReset, onComplete }: { questions: QuizQuestion[]; moduleTitle: string; onReset: () => void; onComplete: (pct: number, passed: boolean) => void }) {
  const [quizState, setQuizState] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: number; selectedIndex: number; isCorrect: boolean }[]>([])
  const [shuffled, setShuffled] = useState<QuizQuestion[]>([])
  const [scoreSaved, setScoreSaved] = useState(false)

  const startQuiz = () => {
    const s = [...questions].sort(() => Math.random() - 0.5)
    setShuffled(s)
    setCurrentIdx(0)
    setSelectedChoice(null)
    setIsAnswered(false)
    setAnswers([])
    setQuizState('quiz')
    setScoreSaved(false)
  }

  const handleChoiceClick = (idx: number) => {
    if (isAnswered) return
    setSelectedChoice(idx)
    setIsAnswered(true)
    const q = shuffled[currentIdx]
    setAnswers(prev => [...prev, { questionId: q.id, selectedIndex: idx, isCorrect: idx === q.correctIndex }])
  }

  const handleNext = () => {
    if (currentIdx + 1 >= shuffled.length) {
      setQuizState('result')
    } else {
      setCurrentIdx(prev => prev + 1)
      setSelectedChoice(null)
      setIsAnswered(false)
    }
  }

  const score = answers.filter(a => a.isCorrect).length
  const total = shuffled.length
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = pct >= 75

  useEffect(() => {
    if (quizState === 'result' && !scoreSaved && total > 0) {
      onComplete(pct, passed)
      setScoreSaved(true)
    }
  }, [quizState])

  if (quizState === 'intro') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}>
          <ClipboardCheck size={32} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{moduleTitle} Assessment</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
          {questions.length} multiple-choice questions. Passing score: <strong>75%</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[{ label: 'Items', value: `${questions.length} Qs` }, { label: 'Passing', value: '75%' }, { label: 'Standard', value: 'TESDA NC II' }].map(s => (
            <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 8px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={onReset} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Choose Module
          </button>
          <button type="button" onClick={startQuiz} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)' }}>
            Start Assessment <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (quizState === 'result') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 40px' }}>
        <div style={{ textAlign: 'center', padding: '32px 24px', background: passed ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: `1px solid ${passed ? '#86efac' : '#fed7aa'}`, borderRadius: 16, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: passed ? '#22c55e' : '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: `0 8px 32px ${passed ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.3)'}` }}>
            {passed ? <CheckCircle2 size={32} color="#fff" /> : <ClipboardCheck size={32} color="#fff" />}
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: passed ? '#15803d' : '#c2410c', lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: passed ? '#166534' : '#9a3412', marginTop: 8 }}>{passed ? 'PASSED — Magaling!' : 'FAILED — Subukan ulit!'}</div>
          <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 6 }}>Nakuha mo ang <strong>{score} sa {total}</strong> tanong nang tama.</div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Review ng mga Sagot</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {answers.map((ans, i) => {
            const q = shuffled.find(q => q.id === ans.questionId)!
            return (
              <div key={ans.questionId} style={{ border: `1px solid ${ans.isCorrect ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: '12px 14px', background: ans.isCorrect ? '#f0fdf4' : '#fff1f2' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                  {ans.isCorrect ? <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />}
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Q{i + 1}: {q.question}</span>
                </div>
                {!ans.isCorrect && (
                  <div style={{ marginLeft: 24, fontSize: '0.8rem' }}>
                    <div style={{ color: '#ef4444', marginBottom: 3 }}>Iyong sagot: <em>{q.choices[ans.selectedIndex]}</em></div>
                    <div style={{ color: '#15803d', marginBottom: 6 }}>Tamang sagot: <strong>{q.choices[q.correctIndex]}</strong></div>
                  </div>
                )}
                <div style={{ marginLeft: 24, fontSize: '0.78rem', color: '#475569', background: 'rgba(0,0,0,0.04)', borderRadius: 6, padding: '7px 10px' }}>💡 {q.explanation}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={onReset} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            ← All Modules
          </button>
          <button type="button" onClick={startQuiz} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <RotateCcw size={14} /> Retake
          </button>
        </div>
      </div>
    )
  }

  const q = shuffled[currentIdx]
  const progress = ((currentIdx + 1) / total) * 100

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: '#64748b' }}>Tanong {currentIdx + 1} ng {total}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: '#10b981', fontWeight: 700 }}>{answers.filter(a => a.isCorrect).length} Tama</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: 99, height: 7, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', marginBottom: 12 }}>ITEM {currentIdx + 1} — MULTIPLE CHOICE</div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.55, margin: 0 }}>{q.question}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {q.choices.map((choice, idx) => {
          let bg = '#ffffff', border = '1px solid #e2e8f0', color = '#334155'
          if (isAnswered) {
            if (idx === q.correctIndex) { bg = '#f0fdf4'; border = '2px solid #22c55e'; color = '#15803d' }
            else if (idx === selectedChoice) { bg = '#fff1f2'; border = '2px solid #ef4444'; color = '#9f1239' }
          }
          return (
            <button key={idx} type="button" onClick={() => handleChoiceClick(idx)} disabled={isAnswered}
              style={{ background: bg, border, borderRadius: 8, padding: '12px 14px', textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', color, fontWeight: isAnswered && idx === q.correctIndex ? 700 : 500, fontSize: '0.88rem', lineHeight: 1.4 }}
              onMouseEnter={e => { if (!isAnswered) e.currentTarget.style.borderColor = '#94a3b8' }}
              onMouseLeave={e => { if (!isAnswered) e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
              <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: isAnswered && idx === q.correctIndex ? '#22c55e' : (isAnswered && idx === selectedChoice ? '#ef4444' : '#f1f5f9'), color: (isAnswered && (idx === q.correctIndex || idx === selectedChoice)) ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700 }}>
                {isAnswered && (idx === q.correctIndex || idx === selectedChoice) ? (idx === q.correctIndex ? '✓' : '✗') : String.fromCharCode(65 + idx)}
              </span>
              <span style={{ flex: 1 }}>{choice}</span>
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '0 8px 8px 0', padding: '12px 14px', marginBottom: 16, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>
          <strong style={{ color: '#0f172a' }}>💡 Paliwanag:</strong> {q.explanation}
        </div>
      )}

      {isAnswered && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={handleNext} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}>
            {currentIdx + 1 >= total ? 'Tingnan ang Resulta' : 'Susunod'} <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

// need to import this inline since it is used inside the file
function XCircle({ size, color, style }: { size: number; color: string; style?: React.CSSProperties }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
}
function RotateCcw({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
}
