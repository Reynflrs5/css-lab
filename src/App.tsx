import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Hardware from './pages/Hardware'
import PcParts from './pages/PcParts'
import Networking from './pages/Networking'
import Troubleshooting from './pages/Troubleshooting'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/lessons"        element={<Lessons />} />
        <Route path="/hardware"       element={<Hardware />} />
        <Route path="/pc-parts"       element={<PcParts />} />
        <Route path="/networking"     element={<Networking />} />
        <Route path="/troubleshooting" element={<Troubleshooting />} />
      </Routes>
      <Footer note="CSS NC II Study Reference — Academic use only" />
    </>
  )
}
