import { useState } from 'react'
import { MonitorPlay, Usb, Cpu, Settings } from 'lucide-react'
import '../styles/tech-pages.css'

export default function OsInstallation() {
  const [activeTab, setActiveTab] = useState<'bios' | 'bootable' | 'install'>('bios')

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-yellow" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(234, 179, 8, 0.15) 0%, transparent 60%)' }} />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" style={{ background: '#eab308', boxShadow: '0 0 10px #eab308' }} />
            <span>MOD-03 // OS INSTALLATION & CONFIGURATION</span>
          </div>
          
          <h1 className="tech-page-title">
            <span style={{ 
              background: 'linear-gradient(to right, #ffffff, #fef08a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>OS Installation</span>
          </h1>
          
          <p className="tech-page-desc">
            Learn to configure the BIOS/UEFI, create bootable flash drives, properly partition disks, and install the Windows Operating System along with device drivers.
          </p>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button 
            className={`tech-tab-btn ${activeTab === 'bios' ? 'active' : ''}`}
            onClick={() => setActiveTab('bios')}
            style={activeTab === 'bios' ? { borderColor: '#eab308', color: '#eab308', background: 'rgba(234,179,8,0.05)' } : {}}
          >
            <Settings size={16} /> BIOS vs UEFI
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'bootable' ? 'active' : ''}`}
            onClick={() => setActiveTab('bootable')}
            style={activeTab === 'bootable' ? { borderColor: '#eab308', color: '#eab308', background: 'rgba(234,179,8,0.05)' } : {}}
          >
            <Usb size={16} /> Bootable Media
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'install' ? 'active' : ''}`}
            onClick={() => setActiveTab('install')}
            style={activeTab === 'install' ? { borderColor: '#eab308', color: '#eab308', background: 'rgba(234,179,8,0.05)' } : {}}
          >
            <MonitorPlay size={16} /> Windows Install
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'bios' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>Understanding BIOS and UEFI</h2>
            
            <div className="grid-responsive-2">
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={20} /> Legacy BIOS</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '12px' }}>Basic Input/Output System. The older standard that uses a simple text interface, keyboard-only navigation, and relies on the MBR (Master Boot Record) partition style which limits drives to 2TB.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #eab308' }}>
                <h3 style={{ color: '#ca8a04', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={20} /> Modern UEFI</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '12px' }}>Unified Extensible Firmware Interface. The modern replacement supporting mouse input, faster boot times, Secure Boot, and GPT (GUID Partition Table) for drives larger than 2TB.</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '16px', color: '#1e293b' }}>How to Change Boot Priority</h3>
            <ol style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li>Turn on the PC and repeatedly press the BIOS key (usually <strong>DEL, F2, F10, or F12</strong> depending on the brand).</li>
              <li>Navigate to the <strong>Boot</strong> tab using your keyboard or mouse.</li>
              <li>Select <strong>Boot Option #1</strong> and change it to your USB Flash Drive.</li>
              <li>Press <strong>F10</strong> to Save and Exit. The PC will restart and boot from the USB.</li>
            </ol>
          </div>
        )}

        {activeTab === 'bootable' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>Creating a Bootable USB</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>To install Windows, you cannot just copy the ISO file to a flash drive. You must use a tool to extract and make the drive "bootable". We recommend using <strong>Rufus</strong>.</p>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #eab308' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '16px' }}>Steps using Rufus:</h3>
              <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                <li>Insert a USB Flash Drive (at least 8GB). <strong>Warning: All data on the USB will be erased!</strong></li>
                <li>Open Rufus and select your USB drive under "Device".</li>
                <li>Click "SELECT" and browse for your Windows ISO file.</li>
                <li>Partition Scheme: Choose <strong>GPT</strong> for modern UEFI PCs, or <strong>MBR</strong> for old Legacy PCs.</li>
                <li>File System: Leave as NTFS or FAT32 as selected by Rufus.</li>
                <li>Click <strong>START</strong> and wait for the process to complete.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'install' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#0f172a' }}>Windows Installation Process</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div style={{ background: '#eab308', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Boot from USB</h4>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Ensure the PC boots from the USB. You will see the Windows Setup screen. Choose your Language, Time, and Keyboard layout, then click Next.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div style={{ background: '#eab308', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Install Now & Product Key</h4>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Click "Install Now". If prompted for a product key, enter it. If you don't have one right now, you can click "I don't have a product key" to activate later. Accept the license terms.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div style={{ background: '#eab308', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Installation Type & Partitioning</h4>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Choose <strong>Custom: Install Windows only (advanced)</strong>. Delete existing partitions if doing a clean install until you see "Drive 0 Unallocated Space". Click "New" to create a partition, then format it. Select the primary partition and click Next.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div style={{ background: '#eab308', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>4</div>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>OOBE (Out-of-Box Experience) & Drivers</h4>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>The PC will restart. Follow the on-screen instructions to set up your account. Once on the desktop, install the <strong>Device Drivers</strong> (Chipset, VGA, Audio, LAN) from the motherboard manufacturer's website or CD to ensure hardware works correctly.</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  )
}
