import { useState } from 'react'
import { Server, Users, Globe, Shield, FolderOpen } from 'lucide-react'
import '../styles/tech-pages.css'

export default function ServerSetup() {
  const [activeTab, setActiveTab] = useState<'adds' | 'dhcpdns' | 'gpo'>('adds')

  return (
    <main className="page" style={{ padding: 0 }}>
      {/* ── HEADER ─────────────────────────── */}
      <header className="tech-page-header">
        <div className="tech-page-glow glow-indigo" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)' }} />
        <div className="container">
          <div className="tech-header-badge">
            <span className="tech-pulse-dot" style={{ background: '#6366f1', boxShadow: '0 0 10px #6366f1' }} />
            <span>MOD-05 // SERVER ADMINISTRATION</span>
          </div>
          
          <h1 className="tech-page-title">
            <span style={{ 
              background: 'linear-gradient(to right, #ffffff, #c7d2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Server Setup</span>
          </h1>
          
          <p className="tech-page-desc">
            Deploy Windows Server, promote it to a Domain Controller with ADDS, configure automated IP addressing via DHCP, and manage network policies with GPO.
          </p>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '64px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button 
            className={`tech-tab-btn ${activeTab === 'adds' ? 'active' : ''}`}
            onClick={() => setActiveTab('adds')}
            style={activeTab === 'adds' ? { borderColor: '#6366f1', color: '#6366f1', background: 'rgba(99,102,241,0.05)' } : {}}
          >
            <Users size={16} /> Active Directory (ADDS)
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'dhcpdns' ? 'active' : ''}`}
            onClick={() => setActiveTab('dhcpdns')}
            style={activeTab === 'dhcpdns' ? { borderColor: '#6366f1', color: '#6366f1', background: 'rgba(99,102,241,0.05)' } : {}}
          >
            <Globe size={16} /> DHCP & DNS
          </button>
          <button 
            className={`tech-tab-btn ${activeTab === 'gpo' ? 'active' : ''}`}
            onClick={() => setActiveTab('gpo')}
            style={activeTab === 'gpo' ? { borderColor: '#6366f1', color: '#6366f1', background: 'rgba(99,102,241,0.05)' } : {}}
          >
            <Shield size={16} /> GPO & Folder Redirection
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'adds' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#0f172a' }}>Active Directory Domain Services (ADDS)</h2>
            <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
              ADDS is the heart of a Windows Server environment. It provides centralized authentication and authorization, allowing you to manage all users and computers from a single location rather than configuring each one individually (Workgroup).
            </p>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '16px' }}>Steps to Install ADDS:</h3>
              <ol style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                <li>Ensure the Server has a <strong>Static IP Address</strong> configured in Network Adapters.</li>
                <li>Open <strong>Server Manager</strong> and click "Add roles and features".</li>
                <li>Proceed with "Role-based or feature-based installation".</li>
                <li>Select your server from the pool.</li>
                <li>Check the box for <strong>Active Directory Domain Services</strong>. Click Add Features when prompted.</li>
                <li>Click Next until you reach Install, and wait for it to finish.</li>
                <li>After installation, click the flag icon with a warning in Server Manager and select <strong>"Promote this server to a domain controller"</strong>.</li>
                <li>Choose <strong>"Add a new forest"</strong> and type your Root domain name (e.g., <code>css.local</code>).</li>
                <li>Set a DSRM (Directory Services Restore Mode) password and click Next until you hit Install. The server will restart.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'dhcpdns' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#0f172a' }}>DHCP & DNS Configuration</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Globe size={20} /> DNS (Domain Name System)
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>
                  DNS acts as the phonebook of the network. It translates domain names (like <code>pc1.css.local</code>) into IP addresses (like <code>192.168.1.10</code>). ADDS heavily relies on DNS to function. Usually, DNS is installed automatically alongside ADDS. You will need to configure Forward Lookup Zones and Reverse Lookup Zones in the DNS Manager.
                </p>
              </div>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

              <div>
                <h3 style={{ color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Server size={20} /> DHCP (Dynamic Host Configuration Protocol)
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                  DHCP automatically hands out IP addresses, subnet masks, default gateways, and DNS server addresses to client computers so you don't have to configure them manually.
                </p>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Setting up a DHCP Scope:</h4>
                  <ul style={{ color: '#475569', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
                    <li>Open DHCP from Server Manager Tools.</li>
                    <li>Expand your server, right-click IPv4 and select <strong>New Scope...</strong></li>
                    <li>Give it a Name (e.g., "Main Network").</li>
                    <li>Enter the <strong>Start IP address</strong> and <strong>End IP address</strong> (e.g., 192.168.1.100 to 192.168.1.200).</li>
                    <li>Set the Subnet mask.</li>
                    <li>In Router (Default Gateway), enter the router's IP.</li>
                    <li>In Domain Name and DNS Servers, enter your server's IP.</li>
                    <li>Activate the scope. Client PCs on the network set to "Obtain an IP address automatically" will now receive an IP from this range.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gpo' && (
          <div className="tech-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#0f172a' }}>Group Policy & Folder Redirection</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div>
                <h3 style={{ color: '#4338ca', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Shield size={20} /> Group Policy Object (GPO)
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>
                  GPO allows administrators to implement specific configurations for users and computers. 
                  For example, you can use GPO to:
                </p>
                <ul style={{ color: '#475569', lineHeight: 1.6, paddingLeft: '20px' }}>
                  <li>Disable the Control Panel for standard users.</li>
                  <li>Set a mandatory desktop wallpaper.</li>
                  <li>Restrict access to Command Prompt or Registry Editor.</li>
                  <li>Automatically map network drives upon login.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: '#4338ca', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FolderOpen size={20} /> Folder Redirection
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>
                  Folder Redirection is a feature often deployed via GPO. It changes the path of specific user folders (like Documents, Desktop, Pictures) from the local hard drive to a shared folder on the server.
                </p>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>
                  <strong>Benefit:</strong> A user can log into ANY computer on the domain, and their files will be right there waiting for them, as they are pulled directly from the server over the network.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
