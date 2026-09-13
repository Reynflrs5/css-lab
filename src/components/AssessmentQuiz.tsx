import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, AlertTriangle, BookOpen } from 'lucide-react'
import { type QuizQuestion } from '../data/hardwareQuiz'

interface AssessmentQuizProps {
  questions: QuizQuestion[]
  moduleTitle: string
  onReset?: () => void
}

export default function AssessmentQuiz({ questions, moduleTitle, onReset }: AssessmentQuizProps) {
  const [quizState, setQuizState] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: number; selectedIndex: number; isCorrect: boolean }[]>([])
  const [shuffled, setShuffled] = useState<QuizQuestion[]>([])

  const startQuiz = () => {
    const s = [...questions].sort(() => Math.random() - 0.5)
    setShuffled(s)
    setCurrentIdx(0)
    setSelectedChoice(null)
    setIsAnswered(false)
    setAnswers([])
    setQuizState('quiz')
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

  if (quizState === 'intro') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}>
          <BookOpen size={32} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
          {moduleTitle} Assessment
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
          {questions.length} multiple-choice questions. Passing score: <strong>75%</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[{ label: 'Items', value: `${questions.length} Questions` }, { label: 'Passing', value: '75%' }, { label: 'Standard', value: 'TESDA NC II' }].map(s => (
            <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 8px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {onReset && (
            <button type="button" onClick={onReset} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              ← Choose Module
            </button>
          )}
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
            {passed ? <Trophy size={32} color="#fff" /> : <AlertTriangle size={32} color="#fff" />}
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: passed ? '#15803d' : '#c2410c', lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: passed ? '#166534' : '#9a3412', marginTop: 8 }}>{passed ? 'PASSED — Magaling!' : 'FAILED — Subukan ulit!'}</div>
          <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 6 }}>Nakuha mo ang <strong>{score} sa {total}</strong> tanong.</div>
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
          {onReset && (
            <button type="button" onClick={onReset} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 24px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              ← Choose Module
            </button>
          )}
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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 40px' }}>
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
            <button key={idx} type="button" onClick={() => handleChoiceClick(idx)} disabled={isAnswered} style={{ background: bg, border, borderRadius: 8, padding: '12px 14px', textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', color, fontWeight: isAnswered && idx === q.correctIndex ? 700 : 500, fontSize: '0.88rem', lineHeight: 1.4 }}
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
