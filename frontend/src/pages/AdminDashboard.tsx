import { Flag, LogOut, Grid3x3, Users, Eye, X, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { Report, User } from "@/types/report";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentUser = storage.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const FILE_BASE = (API_URL).replace(/\/api$/, '');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/");
      return;
    }
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [redFlagsRes, interventionsRes] = await Promise.all([
        api.getRedFlags(),
        api.getInterventions()
      ]);

      const allReports: Report[] = [];

      if (redFlagsRes.status === 200 && redFlagsRes.data) {
        const redFlags = redFlagsRes.data.map((item: any) => ({
          id: item.id.toString(),
          type: 'red-flag' as const,
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
        allReports.push(...redFlags);
      }

      if (interventionsRes.status === 200 && interventionsRes.data) {
        const interventions = interventionsRes.data.map((item: any) => ({
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
        allReports.push(...interventions);
      }

      setReports(allReports);
      setUsers(storage.getUsers());
    } catch (error) {
      toast({ title: "Error", description: "Failed to load reports", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  const handleStatusChange = async (reportId: string, reportType: string, newStatus: Report['status']) => {
    try {
      const apiStatus = newStatus.toLowerCase().replace(' ', '-');
      
      if (reportType === 'red-flag') {
        await api.updateRedFlagStatus(reportId, apiStatus);
      } else {
        await api.updateInterventionStatus(reportId, apiStatus);
      }

      toast({ title: "Success", description: "Status updated successfully" });
      loadReports();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const isUsersPage = location.pathname === '/admin/users';
  const getUserReports = (userId: string) => reports.filter(r => r.userId === userId);

  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.id.toLowerCase().includes(query) ||
      report.userName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-admin">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`page-aside ${sidebarOpen ? '' : 'mobile-hidden'}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter Admin</h1>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '2rem' }}>
          <Link to="/admin" className={`nav-link ${!isUsersPage ? 'nav-link-active' : ''}`}>
            <Grid3x3 size={20} />
            <span>All Reports</span>
          </Link>

          <Link to="/admin/users" className={`nav-link ${isUsersPage ? 'nav-link-active' : ''}`}>
            <Users size={20} />
            <span>Users</span>
          </Link>

          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {!isUsersPage ? (
          <>
            <div className="page-header">
              <h2 className="text-2xl font-semibold">All Reports</h2>
              <div className="flex items-center gap-3">
                <span>Admin</span>
                <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}><span>AD</span></div>
              </div>
            </div>

            <div className="mb-6" style={{ position: 'relative', maxWidth: '500px' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              <Input 
                type="text" 
                placeholder="Search by Report ID or User Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>

            <div className="cards-grid mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'hsl(var(--primary))' }}>{reports.length}</div>
                <div className="stat-label">Total Reports</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'hsl(var(--muted-foreground))' }}>{reports.filter(r => r.status === 'DRAFT').length}</div>
                <div className="stat-label">Draft</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'hsl(var(--chart-2))' }}>{reports.filter(r => r.status === 'UNDER INVESTIGATION').length}</div>
                <div className="stat-label">Under Investigation</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'hsl(142, 76%, 36%)' }}>{reports.filter(r => r.status === 'RESOLVED').length}</div>
                <div className="stat-label">Resolved</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'hsl(var(--destructive))' }}>{reports.filter(r => r.status === 'REJECTED').length}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="muted-foreground">Loading reports...</p>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredReports.map((report) => (
                  <div key={report.id} className="record-card">
                    <div className="record-body">
                      <span className={`record-badge ${report.type === "red-flag" ? 'badge-destructive' : 'badge-secondary'}`}>
                        {report.type === "red-flag" ? "Red Flag" : "Intervention"}
                      </span>
                      <h4 className="text-lg font-semibold mb-2">{report.title}</h4>
                      <div className="space-y-2 text-sm muted-foreground mb-4">
                        <p>{report.description}</p>
                        <p><strong>Report ID:</strong> {report.id}</p>
                        <p><strong>By:</strong> {report.userName}</p>
                        <p><strong>Status:</strong> {report.status}</p>
                      </div>
                      
                      {report.images && report.images.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {report.images.map((img: string, idx: number) => (
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

                      <select value={report.status} onChange={(e) => handleStatusChange(report.id, report.type, e.target.value as Report['status'])} className="input mt-4">
                        <option value="DRAFT">Draft</option>
                        <option value="UNDER INVESTIGATION">Under Investigation</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="page-header">
              <h2 className="text-2xl font-semibold">Users</h2>
              <div className="flex items-center gap-3">
                <span>Admin</span>
                <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}><span>AD</span></div>
              </div>
            </div>

            <div className="cards-grid">
              {users.map((user) => (
                <div key={user.id} className="record-card">
                  <div className="record-body">
                    <h4 className="text-lg font-semibold mb-2">{user.name}</h4>
                    <div className="space-y-2 text-sm muted-foreground mb-4">
                      <p><strong>User ID:</strong> {user.id}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Reports:</strong> {getUserReports(user.id).length}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setSelectedUser(user)}>
                      <Eye size={16} />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedUser && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setSelectedUser(null)}>
                <div className="bg-card" style={{ maxWidth: '40rem', width: '100%', borderRadius: '1rem', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedUser(null)}><X size={20} /></Button>
                  </div>
                  <div className="space-y-4">
                    <p className="muted-foreground">{selectedUser.email}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Reports</h4>
                      {getUserReports(selectedUser.id).map((report) => (
                        <div key={report.id} className="p-3 border border-border rounded-lg mb-2">
                          <p className="font-medium text-sm">{report.title}</p>
                          <p className="text-xs muted-foreground">{report.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
