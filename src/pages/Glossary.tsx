import FlashcardDeck from '../components/FlashcardDeck'
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react'
import '../styles/tech-pages.css'

export default function Glossary() {
  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── COMMAND DECK HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-rose" />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" />
            <span>TERMINOLOGY ENGINE // MODULE 06 // ACTIVE RECALL &amp; QUIZ MODES</span>
          </div>

          <h1 className="tech-page-title">
            <span className="tech-title-gradient-rose">Technical Glossary &amp; Flashcards</span>
          </h1>

          <p className="tech-page-desc">
            Master 35+ foundational computer systems servicing, networking, and cabling technical definitions.
            Features 3D flip-card memory training and an interactive multiple-choice certification quiz simulator.
          </p>

          <div className="tech-header-quicknav">
            <div className="tech-quicknav-item">
              <BookOpen size={14} color="#fb7185" />
              <span>Vocabulary: <strong>35+ Technical Terms</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <Sparkles size={14} color="#38bdf8" />
              <span>Modes: <strong>3D Flip Review &amp; Timed Quiz</strong></span>
            </div>
            <div className="tech-quicknav-item">
              <CheckCircle2 size={14} color="#10b981" />
              <span>Coverage: <strong>Hardware, Cabling &amp; Protocols</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        <FlashcardDeck />
      </div>
    </main>
  )
}
