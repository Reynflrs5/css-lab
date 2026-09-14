import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Hardware from './pages/Hardware'
import PcParts from './pages/PcParts'
import Networking from './pages/Networking'
import CableLab from './pages/CableLab'
import Troubleshooting from './pages/Troubleshooting'
import Glossary from './pages/Glossary'
import Assessment from './pages/Assessment'

import History from './pages/History'
import OsInstallation from './pages/OsInstallation'
import ServerSetup from './pages/ServerSetup'

export default function App() {
  const location = useLocation()
  const isPcParts = location.pathname === '/pc-parts'

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/lessons"        element={<Lessons />} />
        <Route path="/history"        element={<History />} />
        <Route path="/hardware"       element={<Hardware />} />
        <Route path="/pc-parts"       element={<PcParts />} />
        <Route path="/os-installation" element={<OsInstallation />} />
        <Route path="/networking"     element={<Networking />} />
        <Route path="/cable-lab"      element={<CableLab />} />
        <Route path="/server-setup"   element={<ServerSetup />} />
        <Route path="/troubleshooting" element={<Troubleshooting />} />
        <Route path="/glossary"        element={<Glossary />} />
        <Route path="/assessment"      element={<Assessment />} />
      </Routes>
      {!isPcParts && <Footer note="CSS NC II Study Reference — Academic use only" />}
    </>
  )
}
