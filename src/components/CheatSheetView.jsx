import React, { useState } from 'react';
import { Copy, Check, Search, FileCode } from 'lucide-react';

const commandsList = [
  { cmd: "sudo fallocate -l 4G /swapfile", cat: "Linux Memory", desc: "Instantly creates a 4 Gigabyte swap file to prevent out-of-memory crashes during builds." },
  { cmd: "sudo chmod 600 /swapfile", cat: "Security", desc: "Locks the swap file so only root can access memory swap content." },
  { cmd: "sudo mkswap /swapfile && sudo swapon /swapfile", cat: "Linux Memory", desc: "Formats and enables the swap space immediately in the Linux kernel." },
  { cmd: "echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab", cat: "Linux OS", desc: "Persists swap configuration so it reactivates automatically on server reboots." },
  { cmd: "sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT", cat: "Firewall", desc: "Inserts a rule at position 6 allowing incoming HTTP port 80 traffic." },
  { cmd: "sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT", cat: "Firewall", desc: "Inserts a rule at position 6 allowing incoming HTTPS port 443 traffic." },
  { cmd: "sudo netfilter-persistent save", cat: "Firewall", desc: "Saves active iptables rules permanently so they survive reboots." },
  { cmd: "dig +short sama.seddiqi.co", cat: "DNS", desc: "Queries DNS to verify that the domain points to your server public IP." },
  { cmd: "ssh-keygen -t ed25519 -C sama-server -f ~/.ssh/id_ed25519 -N ''", cat: "SSH", desc: "Generates an unpassphrased modern Ed25519 SSH key pair for automated server deploy keys." },
  { cmd: "chmod 600 .env", cat: "Security", desc: "Restricts .env access strictly to the owner (read/write only), blocking all other users." },
  { cmd: "openssl rand -hex 24", cat: "Security", desc: "Generates a 48-character high-entropy cryptographic password with URL-safe characters." },
  { cmd: "docker compose -f docker-compose.prod.yml build", cat: "Docker", desc: "Pre-builds production Docker images in the background without causing downtime." },
  { cmd: "docker compose -f docker-compose.prod.yml up -d", cat: "Docker", desc: "Starts all containers in detached mode; runs database migrations first." },
  { cmd: "docker compose -f docker-compose.prod.yml ps", cat: "Docker", desc: "Checks health status and uptime of all production services." },
  { cmd: "docker compose -f docker-compose.prod.yml run --rm migrate node prisma/operator.ts you@seddiqi.co", cat: "Docker", desc: "Runs a one-off database script inside an ephemeral container and removes it upon exit." },
  { cmd: "docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U sama -Fc -f /backups/sama-$(date +%F).dump sama", cat: "Database", desc: "Creates a compressed logical snapshot backup of PostgreSQL." },
  { cmd: "find /opt/sama/deploy/backups -name 'sama-*.dump' -mtime +30 -delete", cat: "Automation", desc: "Deletes database backups older than 30 days to prevent disk space exhaustion." },
  { cmd: "docker compose -f docker-compose.prod.yml logs -f --tail=100 api web", cat: "Troubleshooting", desc: "Follows real-time logs of the API and Web services to diagnose runtime errors." },
  { cmd: "docker image prune -f", cat: "Maintenance", desc: "Removes untagged dangling Docker images to reclaim SSD disk space." },
  { cmd: "sudo bt", cat: "aaPanel", desc: "Opens the aaPanel command-line troubleshooting menu to reset passwords or change ports." }
];

export default function CheatSheetView() {
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (cmd, idx) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const filtered = commandsList.filter(c => 
    c.cmd.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase()) ||
    c.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cheatsheet-view">
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>⚡ deploy.md Command Cheat Sheet</h2>
        <p style={{ color: '#94a3b8' }}>
          Every single terminal command used in the Sama production deployment with full English explanations.
        </p>
      </div>

      <div className="search-input-wrapper" style={{ maxWidth: '400px' }}>
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          className="search-input"
          placeholder="Filter commands by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="cheatsheet-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Terminal Command</th>
            <th>Description & Purpose</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, idx) => (
            <tr key={idx}>
              <td>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                  {item.cat}
                </span>
              </td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontSize: '0.85rem' }}>
                  {item.cmd}
                </code>
              </td>
              <td style={{ color: '#cbd5e1' }}>{item.desc}</td>
              <td>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(item.cmd, idx)}
                >
                  {copiedIdx === idx ? <><Check size={14} color="#10b981" /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
