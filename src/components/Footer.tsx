interface FooterProps {
  note?: string
}

export default function Footer({ note }: FooterProps) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">CSS_LAB / Computer Systems Servicing</div>
            <div className="footer-note">TESDA NC II Study Reference — {year}</div>
          </div>
          {note && <div className="footer-note">{note}</div>}
        </div>
      </div>
    </footer>
  )
}
