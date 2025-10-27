import { Flag, LogOut, Grid3x3, Plus, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = storage.getCurrentUser();
  const [stats, setStats] = useState({ redFlags: 0, interventions: 0, total: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const reports = storage.getReports();
    const userReports = reports.filter(r => r.userId === currentUser.id);
    const redFlags = userReports.filter(r => r.type === 'red-flag').length;
    const interventions = userReports.filter(r => r.type === 'intervention').length;
    
    setStats({
      redFlags,
      interventions,
      total: redFlags + interventions
    });
  }, []);

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  return (
    <div className="page-dashboard">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`page-aside ${sidebarOpen ? '' : 'mobile-hidden'}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter</h1>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '2rem' }}>
          <Link to="/dashboard" className="nav-link nav-link-active">
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/red-flags" className="nav-link">
            <Flag size={20} />
            <span>Red Flags</span>
          </Link>

          <Link to="/interventions" className="nav-link">
            <Plus size={20} />
            <span>Interventions</span>
          </Link>

          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-subtitle">
              <Grid3x3 size={20} />
              <span>Overview</span>
            </div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>{currentUser?.name}</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>{currentUser?.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
        </div>

        <div className="cards-grid" style={{ marginBottom: '2rem' }}>
          <div className="stats-card" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid3x3 size={24} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm muted-foreground">Total Reports</div>
            </div>
          </div>

          <div className="stats-card" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'hsl(var(--destructive))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={24} className="text-destructive-foreground" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.redFlags}</div>
              <div className="text-sm muted-foreground">Red Flags</div>
            </div>
          </div>

          <div className="stats-card" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={24} className="text-secondary-foreground" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.interventions}</div>
              <div className="text-sm muted-foreground">Interventions</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link to="/red-flags" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Flag size={20} />
                  <div>
                    <div className="font-medium">View Red Flags</div>
                    <div className="text-sm muted-foreground">Manage your red flag reports</div>
                  </div>
                </div>
              </Link>
              <Link to="/interventions" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Plus size={20} />
                  <div>
                    <div className="font-medium">View Interventions</div>
                    <div className="text-sm muted-foreground">Manage your intervention requests</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">About iReporter</h3>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm muted-foreground mb-3">
                iReporter enables citizens to bring any form of corruption to the notice of appropriate authorities and the general public.
              </p>
              <p className="text-sm muted-foreground">
                You can report incidents requiring government intervention (interventions) or instances of corruption (red-flags).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
