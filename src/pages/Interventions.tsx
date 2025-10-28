import { Flag, LogOut, Grid3x3, Plus, Edit, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { Report } from "@/types/report";

export default function Interventions() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const currentUser = storage.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ resolved: 0, unresolved: 0, rejected: 0 });

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports = storage.getReports();
    const interventions = allReports.filter(r => r.type === 'intervention' && r.userId === currentUser?.id);
    setReports(interventions);
    
    // Calculate stats
    const resolved = interventions.filter(r => r.status === 'RESOLVED').length;
    const unresolved = interventions.filter(r => r.status === 'DRAFT' || r.status === 'UNDER INVESTIGATION').length;
    const rejected = interventions.filter(r => r.status === 'REJECTED').length;
    setStats({ resolved, unresolved, rejected });
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  const handleDelete = (reportId: string, status: string) => {
    if (status !== 'DRAFT') {
      alert("Cannot delete report - status has been changed by admin");
      return;
    }
    if (confirm("Are you sure you want to delete this report?")) {
      storage.deleteReport(reportId);
      loadReports();
    }
  };

  const handleEdit = (reportId: string, status: string) => {
    if (status !== 'DRAFT') {
      alert("Cannot edit report - status has been changed by admin");
      return;
    }
    navigate(`/create?id=${reportId}&type=intervention`);
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
          <Link to="/dashboard" className="nav-link">
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/red-flags" className="nav-link">
            <Flag size={20} />
            <span>Red Flags</span>
          </Link>

          <Link to="/interventions" className="nav-link nav-link-active">
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
              <Plus size={20} />
              <span>Interventions</span>
            </div>
            <h2 className="text-2xl font-semibold">My Interventions</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>{currentUser?.name}</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>{currentUser?.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
        </div>

        <div className="cards-grid mb-6">
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(142, 76%, 36%)' }}>{stats.resolved}</div>
            <div className="stat-label">Resolved Interventions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(221, 83%, 53%)' }}>{stats.unresolved}</div>
            <div className="stat-label">Unresolved Interventions</div>
            <div className="text-xs muted-foreground mt-1">(Draft or Under Investigation)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'hsl(0, 84%, 60%)' }}>{stats.rejected}</div>
            <div className="stat-label">Rejected Interventions</div>
          </div>
        </div>

        <Button onClick={() => navigate('/create?type=intervention')} className="mb-6">
          <Plus size={20} />
          Create Intervention
        </Button>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <Plus size={48} className="mx-auto mb-4 opacity-50" />
            <p className="muted-foreground">No interventions yet. Create your first report!</p>
          </div>
        ) : (
          <div className="cards-grid">
            {reports.map((report) => (
              <div key={report.id} className="record-card">
                <div className="record-body">
                  <span className="record-badge badge-secondary">Intervention</span>

                  <h4 className="text-lg font-semibold mb-2">{report.title}</h4>

                  <div className="space-y-2 text-sm muted-foreground mb-4">
                    <p><strong>Description:</strong></p>
                    <p>{report.description}</p>
                    <p><strong>Status:</strong></p>
                    <p className={report.status === "RESOLVED" ? 'status-resolved' : 'status-other'}>
                      {report.status}
                    </p>
                    <p><strong>Location:</strong></p>
                    <p>Lat: {report.latitude.toFixed(6)}, Lon: {report.longitude.toFixed(6)}</p>
                    <p className="text-xs">Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>

                  {report.image && (
                    <img src={report.image} alt={report.title} className="record-image" />
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(report.id, report.status)}
                      disabled={report.status !== 'DRAFT'}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(report.id, report.status)}
                      disabled={report.status !== 'DRAFT'}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
