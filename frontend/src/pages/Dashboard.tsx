import { Flag, LogOut, Grid3x3, Plus, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = storage.getCurrentUser();
  const [stats, setStats] = useState({ redFlags: 0, interventions: 0, total: 0, draft: 0, underInvestigation: 0, resolved: 0, rejected: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [redFlagsRes, interventionsRes] = await Promise.all([
        api.getRedFlags(),
        api.getInterventions()
      ]);

      let draft = 0, underInvestigation = 0, resolved = 0, rejected = 0;

      if (redFlagsRes.status === 200 && redFlagsRes.data) {
        const userReports = redFlagsRes.data.filter((r: any) => r.user_id.toString() === currentUser?.id);
        draft += userReports.filter((r: any) => r.status === 'draft').length;
        underInvestigation += userReports.filter((r: any) => r.status === 'under-investigation').length;
        resolved += userReports.filter((r: any) => r.status === 'resolved').length;
        rejected += userReports.filter((r: any) => r.status === 'rejected').length;
      }

      if (interventionsRes.status === 200 && interventionsRes.data) {
        const userReports = interventionsRes.data.filter((r: any) => r.user_id.toString() === currentUser?.id);
        draft += userReports.filter((r: any) => r.status === 'draft').length;
        underInvestigation += userReports.filter((r: any) => r.status === 'under-investigation').length;
        resolved += userReports.filter((r: any) => r.status === 'resolved').length;
        rejected += userReports.filter((r: any) => r.status === 'rejected').length;
      }
      
      setStats({
        redFlags: (redFlagsRes.data || []).filter((r: any) => r.user_id.toString() === currentUser?.id).length,
        interventions: (interventionsRes.data || []).filter((r: any) => r.user_id.toString() === currentUser?.id).length,
        total: draft + underInvestigation + resolved + rejected,
        draft,
        underInvestigation,
        resolved,
        rejected
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

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
            <span>My reports</span>
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

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid hsl(var(--border))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-subtitle">
              <Grid3x3 size={20} />
              <span>Overview</span>
            </div>
            <h2 className="text-2xl font-semibold">My Reports</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>{currentUser?.name}</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>{currentUser?.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
        </div>

        <div className="cards-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(var(--primary))' }}>{stats.total}</div>
            <div className="stat-label">Total Reports</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(var(--muted-foreground))' }}>{stats.draft}</div>
            <div className="stat-label">Draft</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(var(--chart-2))' }}>{stats.underInvestigation}</div>
            <div className="stat-label">Under Investigation</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(142, 76%, 36%)' }}>{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(var(--destructive))' }}>{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </main>
    </div>
  );
}
