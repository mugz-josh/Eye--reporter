import { Flag, LogOut, Grid3x3, Plus, Edit, Trash2, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { Report } from "@/types/report";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import MapPicker from "@/components/MapPicker";

export default function Interventions() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const currentUser = storage.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ resolved: 0, unresolved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState<{ id?: string; lat: number; lng: number; open: boolean; } | null>(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const FILE_BASE = (API_URL).replace(/\/api$/, '');
  

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await api.getInterventions();
      
      if (response.status === 200 && response.data) {
        // Map backend data to frontend Report type
        const mappedReports = response.data.map((item: any) => ({
          id: item.id.toString(),
          type: 'intervention' as const,
          title: item.title,
          description: item.description,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          status: item.status.toUpperCase().replace('-', ' ') as Report['status'],
          userId: item.user_id.toString(),
          userName: `${item.first_name} ${item.last_name}`,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          images: item.images || [],
          videos: item.videos || []
        }));

        // Backend already filters by user, no need to filter again
        setReports(mappedReports);
        
        // Calculate stats
        const resolved = mappedReports.filter((r: Report) => r.status === 'RESOLVED').length;
        const unresolved = mappedReports.filter((r: Report) => r.status === 'DRAFT' || r.status === 'UNDER INVESTIGATION').length;
        const rejected = mappedReports.filter((r: Report) => r.status === 'REJECTED').length;
        setStats({ resolved, unresolved, rejected });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load interventions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  const handleDelete = async (reportId: string, status: string) => {
    if (status !== 'DRAFT') {
      toast({ title: "Error", description: "Cannot delete report - status has been changed by admin", variant: "destructive" });
      return;
    }
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        await api.deleteIntervention(reportId);
        toast({ title: "Success", description: "Intervention deleted successfully" });
        loadReports();
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete intervention", variant: "destructive" });
      }
    }
  };

  const handleEdit = (reportId: string, status: string) => {
    if (status !== 'DRAFT') {
      alert("Cannot edit report - status has been changed by admin");
      return;
    }
    navigate(`/create?id=${reportId}&type=intervention`);
  };

  const openLocationEditor = (report: Report) => {
    if (report.status !== 'DRAFT') {
      toast({ title: 'Error', description: 'Cannot update location - status changed', variant: 'destructive' });
      return;
    }
    setEditingLocation({ id: report.id, lat: report.latitude, lng: report.longitude, open: true });
  };

  const saveLocation = async () => {
    if (!editingLocation?.id) return;
    try {
      const resp = await api.updateInterventionLocation(editingLocation.id, editingLocation.lat, editingLocation.lng);
      if (resp.status >= 400) {
        toast({ title: 'Error', description: resp.message || 'Failed to update location', variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Location updated' });
      setEditingLocation(null);
      loadReports();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update location', variant: 'destructive' });
    }
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

        <div className="cards-grid mb-10">
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

        {loading ? (
          <div className="text-center py-12">
            <p className="muted-foreground">Loading interventions...</p>
          </div>
        ) : reports.length === 0 ? (
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

                  {(report as any).images && (report as any).images.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {(report as any).images.map((img: string, idx: number) => (
                        <img key={idx} src={`${FILE_BASE}/uploads/${img}`} alt={`${report.title} ${idx + 1}`} className="record-image" />
                      ))}
                    </div>
                  )}

                  {report.videos && report.videos.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {report.videos.map((vid: string, idx: number) => (
                        <video key={idx} controls className="record-image">
                          <source src={`${FILE_BASE}/uploads/${vid}`} />
                        </video>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
  <Button 
    size="sm" 
    variant="outline"
    onClick={() => handleEdit(report.id, report.status)}
    disabled={report.status !== 'DRAFT'}
  >
    <Edit size={16} />
    Edit Report
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
        {editingLocation && editingLocation.open && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setEditingLocation(null)}>
            <div className="bg-card" style={{ width: '90%', maxWidth: '800px', padding: '1.5rem', borderRadius: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Update Location</h3>
              <MapPicker latitude={editingLocation.lat} longitude={editingLocation.lng} onLocationChange={(lat, lng) => setEditingLocation({ ...editingLocation, lat, lng })} />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setEditingLocation(null)}>Cancel</Button>
                <Button onClick={saveLocation}>Save Location</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
