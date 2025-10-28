import { Flag, LogOut, Grid3x3, Users, Eye, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { Report, User } from "@/types/report";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentUser = storage.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/");
      return;
    }
    setReports(storage.getReports());
    setUsers(storage.getUsers());
  }, []);

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  const handleStatusChange = (reportId: string, newStatus: Report['status']) => {
    const report = storage.getReportById(reportId);
    if (report) {
      const updatedReport = { ...report, status: newStatus, updatedAt: new Date().toISOString() };
      storage.saveReport(updatedReport);
      setReports(storage.getReports());
    }
  };

  const isUsersPage = location.pathname === '/admin/users';
  const getUserReports = (userId: string) => reports.filter(r => r.userId === userId);

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

            <div className="cards-grid">
              {reports.map((report) => (
                <div key={report.id} className="record-card">
                  <div className="record-body">
                    <span className={`record-badge ${report.type === "red-flag" ? 'badge-destructive' : 'badge-secondary'}`}>
                      {report.type === "red-flag" ? "Red Flag" : "Intervention"}
                    </span>
                    <h4 className="text-lg font-semibold mb-2">{report.title}</h4>
                    <div className="space-y-2 text-sm muted-foreground mb-4">
                      <p>{report.description}</p>
                      <p><strong>By:</strong> {report.userName}</p>
                      <p><strong>Status:</strong> {report.status}</p>
                    </div>
                    {report.image && <img src={report.image} alt={report.title} className="record-image" />}
                    <select value={report.status} onChange={(e) => handleStatusChange(report.id, e.target.value as Report['status'])} className="input mt-4">
                      <option value="DRAFT">Draft</option>
                      <option value="UNDER INVESTIGATION">Under Investigation</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
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
