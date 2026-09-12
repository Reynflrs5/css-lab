import FlashcardDeck from '../components/FlashcardDeck'

export default function Glossary() {
  return (
    <main className="page">
      <div className="container">
        <span className="tag" style={{ marginBottom: '16px' }}>Module 06</span>
        <h1 style={{ marginTop: '8px', marginBottom: '8px' }}>Glossary &amp; Flashcards</h1>
        <p>
          Master 35+ key networking and cabling terms with two study modes:
          flip-card review for self-paced learning and multiple-choice quiz to test your recall.
        </p>
        <hr className="rule-heavy" />

        <FlashcardDeck />
      </div>
    </main>
  )
}
