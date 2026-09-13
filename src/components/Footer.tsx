import './Footer.css'

interface FooterProps {
  note?: string
}

export default function Footer({ note }: FooterProps) {
  const year = new Date().getFullYear()
  
  return (
    <footer className="modern-footer" role="contentinfo">
      <div className="container">
        <div className="modern-footer-inner">
          <a href="#" className="modern-footer-brand">
            <h2 className="reyntech-name">ReynTech</h2>
          </a>
        </div>
        
        <div className="modern-footer-bottom">
          <div className="modern-footer-copyright">
            &copy; {year} ReynTech Innovations. All rights reserved.
          </div>
          <div className="modern-footer-note">
            {note ? note : "Empowering the future through technology."}
          </div>
        </div>
      </div>
    </footer>
  )
}
