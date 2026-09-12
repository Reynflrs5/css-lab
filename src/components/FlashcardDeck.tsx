import { useState, useCallback, useEffect, useRef } from 'react'
import { glossaryTerms, CATEGORIES, type GlossaryTerm } from '../data/glossaryTerms'

/* ── helpers ─────────────────────────────────────────────────────────── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuizChoices(term: GlossaryTerm, all: GlossaryTerm[]): string[] {
  // use pre-written distractors if available, else sample from other definitions
  const wrong =
    term.distractors && term.distractors.length >= 3
      ? term.distractors.slice(0, 3)
      : shuffle(all.filter(t => t.id !== term.id))
          .slice(0, 3)
          .map(t => t.definition)

  return shuffle([term.definition, ...wrong])
}

/* ── types ───────────────────────────────────────────────────────────── */
type Mode = 'menu' | 'flashcard' | 'quiz'
type QuizChoice = { text: string; isCorrect: boolean }

interface QuizState {
  choices: QuizChoice[]
  selected: number | null
  answered: boolean
}

/* ── FlashcardDeck ────────────────────────────────────────────────────── */
export default function FlashcardDeck() {
  const [mode, setMode] = useState<Mode>('menu')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [deck, setDeck] = useState<GlossaryTerm[]>([])

  // flashcard state
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  // quiz state
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })
  const [quizDone, setQuizDone] = useState(false)

  // progress tracking
  const [seen, setSeen] = useState<Set<string>>(new Set())

  const cardRef = useRef<HTMLDivElement>(null)

  /* build filtered deck */
  const buildDeck = useCallback((cat: string) => {
    const filtered =
      cat === 'All' ? glossaryTerms : glossaryTerms.filter(t => t.category === cat)
    return shuffle(filtered)
  }, [])

  function startMode(m: Mode) {
    const newDeck = buildDeck(categoryFilter)
    setDeck(newDeck)
    setCardIndex(0)
    setFlipped(false)
    setSeen(new Set())
    setQuizScore({ correct: 0, total: 0 })
    setQuizDone(false)
    if (m === 'quiz' && newDeck.length > 0) {
      setQuiz(buildQuizState(newDeck[0]))
    } else {
      setQuiz(null)
    }
    setMode(m)
  }

  function buildQuizState(term: GlossaryTerm): QuizState {
    const choices = buildQuizChoices(term, glossaryTerms).map(text => ({
      text,
      isCorrect: text === term.definition,
    }))
    return { choices, selected: null, answered: false }
  }

  /* flashcard navigation */
  function flipCard() {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => {
      setFlipped(f => !f)
      setIsFlipping(false)
    }, 150)
    if (deck[cardIndex]) setSeen(s => new Set(s).add(deck[cardIndex].id))
  }

  function nextCard() {
    if (cardIndex >= deck.length - 1) return
    setIsFlipping(true)
    setTimeout(() => {
      setFlipped(false)
      setCardIndex(i => i + 1)
      setIsFlipping(false)
    }, 150)
  }

  function prevCard() {
    if (cardIndex <= 0) return
    setIsFlipping(true)
    setTimeout(() => {
      setFlipped(false)
      setCardIndex(i => i - 1)
      setIsFlipping(false)
    }, 150)
  }

  /* quiz navigation */
  function selectAnswer(idx: number) {
    if (!quiz || quiz.answered) return
    const isCorrect = quiz.choices[idx].isCorrect
    setQuiz(q => q ? { ...q, selected: idx, answered: true } : q)
    setQuizScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }))
  }

  function nextQuestion() {
    const nextIdx = cardIndex + 1
    if (nextIdx >= deck.length) {
      setQuizDone(true)
      return
    }
    setCardIndex(nextIdx)
    setQuiz(buildQuizState(deck[nextIdx]))
  }

  /* keyboard shortcuts */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (mode === 'flashcard') {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard() }
        if (e.key === 'ArrowRight') nextCard()
        if (e.key === 'ArrowLeft') prevCard()
      }
      if (mode === 'quiz' && quiz && quiz.answered) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') nextQuestion()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, cardIndex, flipped, isFlipping, quiz])

  const currentTerm = deck[cardIndex]
  const progress = deck.length ? ((cardIndex + 1) / deck.length) * 100 : 0
  const quizPct = quizScore.total ? Math.round((quizScore.correct / quizScore.total) * 100) : 0

  /* ── MENU ─────────────────────────────────────────────────────────── */
  if (mode === 'menu') {
    return (
      <div className="fc-root">
        <div className="fc-menu">
          <div className="fc-menu-header">
            <span className="tag">Interactive Tool · 01</span>
            <h2 style={{ marginTop: 8 }}>Terminology Flashcards</h2>
            <p style={{ marginBottom: 0 }}>
              {glossaryTerms.length} terms covering structured cabling, fiber optics, protocols, and more.
              Choose a category and a study mode to begin.
            </p>
          </div>

          <hr className="rule" />

          {/* Category filter */}
          <div className="fc-filter-row">
            <span className="label">Filter by category</span>
            <div className="fc-filter-pills">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  id={`fc-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`fc-pill${categoryFilter === cat ? ' active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="fc-selected-count">
            <span className="mono">
              {categoryFilter === 'All'
                ? glossaryTerms.length
                : glossaryTerms.filter(t => t.category === categoryFilter).length}{' '}
              terms selected
            </span>
          </div>

          {/* Mode cards */}
          <div className="fc-mode-grid">
            <div className="fc-mode-card" id="fc-start-flashcard">
              <div className="fc-mode-icon">⟳</div>
              <h3>Flip-Card Review</h3>
              <p>
                Browse cards at your own pace. See the term, flip to reveal the definition,
                and continue through the deck. Use arrow keys to navigate.
              </p>
              <button
                className="btn btn-solid"
                style={{ marginTop: 16 }}
                onClick={() => startMode('flashcard')}
                id="fc-btn-start-flashcard"
              >
                Start Review →
              </button>
            </div>

            <div className="fc-mode-card" id="fc-start-quiz">
              <div className="fc-mode-icon">✓</div>
              <h3>Multiple-Choice Quiz</h3>
              <p>
                See a term and pick the correct definition from four options.
                Get instant feedback and a final score at the end.
              </p>
              <button
                className="btn btn-solid"
                style={{ marginTop: 16 }}
                onClick={() => startMode('quiz')}
                id="fc-btn-start-quiz"
              >
                Start Quiz →
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="fc-stats-strip">
            {CATEGORIES.map(cat => {
              const count = glossaryTerms.filter(t => t.category === cat).length
              return (
                <div key={cat} className="fc-stat">
                  <span className="label" style={{ fontSize: '0.65rem' }}>{cat}</span>
                  <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ── FLASHCARD MODE ─────────────────────────────────────────────────── */
  if (mode === 'flashcard') {
    return (
      <div className="fc-root">
        {/* Top bar */}
        <div className="fc-topbar">
          <button className="btn" onClick={() => setMode('menu')} id="fc-back-menu">
            ← Back
          </button>
          <div className="fc-progress-wrap">
            <div className="fc-progress-bar">
              <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="label" style={{ fontSize: '0.65rem' }}>
              {cardIndex + 1} / {deck.length}
            </span>
          </div>
          <span className="tag">{categoryFilter}</span>
        </div>

        {/* Card */}
        <div className="fc-stage">
          <div
            ref={cardRef}
            id="fc-card"
            className={`fc-card${isFlipping ? ' flipping' : ''}`}
            onClick={flipCard}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') flipCard() }}
            aria-label={flipped ? 'Card definition side' : 'Card term side — click to reveal definition'}
          >
            {/* Front */}
            <div className={`fc-face fc-front${flipped ? ' hidden' : ''}`}>
              <span className="label" style={{ marginBottom: 8 }}>{currentTerm?.category}</span>
              <div className="fc-term">{currentTerm?.term}</div>
              <div className="fc-hint">Click or press Space to reveal definition</div>
              {currentTerm?.example && (
                <div className="fc-tag-row">
                  <span className="tag">has example</span>
                </div>
              )}
            </div>

            {/* Back */}
            <div className={`fc-face fc-back${!flipped ? ' hidden' : ''}`}>
              <span className="label" style={{ marginBottom: 8 }}>{currentTerm?.category}</span>
              <div className="fc-term" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: 12 }}>
                {currentTerm?.term}
              </div>
              <p className="fc-definition">{currentTerm?.definition}</p>
              {currentTerm?.example && (
                <div className="callout" style={{ marginTop: 16, fontSize: '0.82rem' }}>
                  <span className="label" style={{ display: 'block', marginBottom: 4 }}>Example</span>
                  {currentTerm.example}
                </div>
              )}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="fc-nav">
            <button
              className="btn"
              onClick={prevCard}
              disabled={cardIndex === 0}
              id="fc-prev"
              aria-label="Previous card"
            >
              ← Prev
            </button>
            <button className="btn" onClick={flipCard} id="fc-flip">
              {flipped ? 'Show Term' : 'Reveal Definition'}
            </button>
            {cardIndex < deck.length - 1 ? (
              <button className="btn btn-solid" onClick={nextCard} id="fc-next">
                Next →
              </button>
            ) : (
              <button className="btn btn-solid" onClick={() => setMode('menu')} id="fc-finish">
                Finish ✓
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="fc-keys">
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--steel)' }}>
              ← → Navigate &nbsp;·&nbsp; Space / Enter Flip
            </span>
          </div>

          {/* Seen indicator */}
          <div className="fc-seen-strip">
            {deck.map((t, i) => (
              <div
                key={t.id}
                className={`fc-seen-dot${i === cardIndex ? ' current' : seen.has(t.id) ? ' seen' : ''}`}
                title={t.term}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── QUIZ MODE ──────────────────────────────────────────────────────── */
  if (mode === 'quiz') {
    /* Done screen */
    if (quizDone) {
      const grade = quizPct >= 90 ? 'EXCELLENT' : quizPct >= 70 ? 'GOOD' : quizPct >= 50 ? 'FAIR' : 'NEEDS REVIEW'
      return (
        <div className="fc-root">
          <div className="fc-quiz-done">
            <span className="tag">Quiz Complete</span>
            <div className="fc-score-display">{quizPct}%</div>
            <div className="label" style={{ fontSize: '1rem', letterSpacing: '0.15em' }}>{grade}</div>
            <p style={{ marginTop: 16 }}>
              You got <strong>{quizScore.correct}</strong> out of <strong>{quizScore.total}</strong> questions correct.
            </p>
            <div className="fc-quiz-done-btns">
              <button className="btn" onClick={() => startMode('quiz')} id="fc-retry-quiz">
                Retry Quiz
              </button>
              <button className="btn btn-solid" onClick={() => setMode('menu')} id="fc-back-menu-quiz">
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="fc-root">
        {/* Top bar */}
        <div className="fc-topbar">
          <button className="btn" onClick={() => setMode('menu')} id="fc-quiz-back">
            ← Back
          </button>
          <div className="fc-progress-wrap">
            <div className="fc-progress-bar">
              <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="label" style={{ fontSize: '0.65rem' }}>
              Q {cardIndex + 1} / {deck.length}
            </span>
          </div>
          <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--steel)' }}>
            {quizScore.correct}/{quizScore.total} correct
          </span>
        </div>

        <div className="fc-stage">
          {/* Question card */}
          <div className="fc-quiz-card" id="fc-quiz-question">
            <span className="label" style={{ display: 'block', marginBottom: 8 }}>{currentTerm?.category} · Term</span>
            <div className="fc-term">{currentTerm?.term}</div>
            <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--steel)' }}>
              Choose the correct definition:
            </p>
          </div>

          {/* Choices */}
          <div className="fc-choices" role="radiogroup" aria-label="Answer choices">
            {quiz?.choices.map((choice, idx) => {
              let state: 'default' | 'correct' | 'wrong' | 'missed' = 'default'
              if (quiz.answered) {
                if (choice.isCorrect) state = 'correct'
                else if (quiz.selected === idx) state = 'wrong'
                else state = 'missed'
              }
              return (
                <button
                  key={idx}
                  id={`fc-choice-${idx}`}
                  className={`fc-choice fc-choice-${state}`}
                  onClick={() => selectAnswer(idx)}
                  disabled={quiz.answered}
                  role="radio"
                  aria-checked={quiz.selected === idx}
                >
                  <span className="fc-choice-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="fc-choice-text">{choice.text}</span>
                  {quiz.answered && choice.isCorrect && <span className="fc-choice-mark">✓</span>}
                  {quiz.answered && quiz.selected === idx && !choice.isCorrect && (
                    <span className="fc-choice-mark">✗</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback + next */}
          {quiz?.answered && (
            <div className="fc-feedback">
              {quiz.choices[quiz.selected!]?.isCorrect ? (
                <div className="fc-feedback-correct">
                  <strong>Correct!</strong>
                </div>
              ) : (
                <div className="fc-feedback-wrong">
                  <strong>Incorrect.</strong> The right answer is highlighted above.
                </div>
              )}
              {currentTerm?.example && (
                <div style={{ fontSize: '0.82rem', marginTop: 8, color: 'var(--graphite)' }}>
                  <span className="label" style={{ marginRight: 6 }}>Example:</span>
                  {currentTerm.example}
                </div>
              )}
              <button
                className="btn btn-solid"
                style={{ marginTop: 16 }}
                onClick={nextQuestion}
                id="fc-next-question"
              >
                {cardIndex < deck.length - 1 ? 'Next Question →' : 'See Results →'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
