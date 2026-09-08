import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',               label: 'Home' },
  { to: '/lessons',        label: 'Lessons' },
  { to: '/hardware',       label: 'Hardware' },
  { to: '/pc-parts',       label: 'PC Parts' },
  { to: '/networking',     label: 'Networking' },
  { to: '/troubleshooting',label: 'Troubleshooting' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <div className="nav-brand-mark">CS</div>
          CSS_LAB
        </NavLink>

        <div className={`nav-links${open ? ' open' : ''}`}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
