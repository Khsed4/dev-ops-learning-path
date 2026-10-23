import React from 'react';
import { Globe, Shield, Server, Box, Database, Lock, ArrowDown } from 'lucide-react';

export default function ArchitectureView({ onJumpToModule }) {
  return (
    <div className="arch-view">
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          🏗️ Sama Production Topology & Security Isolation
        </h2>
        <p style={{ color: '#94a3b8' }}>
          Click any component in the architecture to jump directly to the module that teaches how to build, secure, and maintain it.
        </p>
      </div>

      <div className="arch-canvas">
        {/* Node 1: Public Internet */}
        <div className="arch-node" onClick={() => onJumpToModule('module-3')}>
          <div className="arch-node-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Globe size={26} />
          </div>
          <div className="arch-node-info">
            <h4>1. Client Web Browser</h4>
            <p>HTTPS Request to https://sama.seddiqi.co (DNS A Record at Hostinger)</p>
          </div>
        </div>

        <div className="arch-connector"></div>

        {/* Node 2: Nginx Reverse Proxy */}
        <div className="arch-node" onClick={() => onJumpToModule('module-7')}>
          <div className="arch-node-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Server size={26} />
          </div>
          <div className="arch-node-info">
            <h4>2. aaPanel Nginx (Ports 80 & 443)</h4>
            <p>SSL Termination (Let's Encrypt), Header Injection (X-Forwarded-For), Force HTTPS</p>
          </div>
        </div>

        <div className="arch-connector"></div>

        {/* Node 3: Next.js Web Client */}
        <div className="arch-node" onClick={() => onJumpToModule('module-2')}>
          <div className="arch-node-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Lock size={26} />
          </div>
          <div className="arch-node-info">
            <h4>3. Web Client Container (127.0.0.1:4200)</h4>
            <p>Next.js Standalone • BOUND STRICTLY TO LOOPBACK (Unreachable from WAN!)</p>
          </div>
        </div>

        <div className="arch-connector"></div>

        {/* Node 4: API Container */}
        <div className="arch-node" onClick={() => onJumpToModule('module-6')}>
          <div className="arch-node-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Box size={26} />
          </div>
          <div className="arch-node-info">
            <h4>4. API Container (api:3100)</h4>
            <p>NestJS API • Internal Docker Bridge Network (No host port published)</p>
          </div>
        </div>

        <div className="arch-connector"></div>

        {/* Node 5: PostgreSQL Database */}
        <div className="arch-node" onClick={() => onJumpToModule('module-8')}>
          <div className="arch-node-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Database size={26} />
          </div>
          <div className="arch-node-info">
            <h4>5. PostgreSQL 18 (postgres:5432)</h4>
            <p>Persistent Docker Volume + Nightly Automated pg_dump Backups at 02:30 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
