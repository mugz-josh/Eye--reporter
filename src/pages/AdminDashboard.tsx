import { Flag, LogOut, Grid3x3, Plus, Users, FileText, Shield, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const allRecords = [
  {
    id: 1,
    type: "Red Flag",
    title: "Bad infrastructure",
    description: "See here.",
    status: "RESOLVED",
    lat: "6.8880319",
    lon: "9.53999",
    image: "https://images.unsplash.com/photo-1518876024007-c0c7c2826904?w=400",
    user: "John Doe",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    type: "Intervention",
    title: "Bad Infrastructure",
    description: "long here.",
    status: "UNDER INVESTIGATION",
    lat: "15.42525",
    lon: "76.34874",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    user: "Jane Smith",
    createdAt: "2024-01-16"
  },
  {
    id: 3,
    type: "Red Flag",
    title: "Corruption Report",
    description: "Evidence of corruption in local office",
    status: "PENDING",
    lat: "9.0820",
    lon: "8.6753",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    user: "Mike Johnson",
    createdAt: "2024-01-17"
  }
];

const stats = [
  { title: "Total Reports", value: "156", icon: FileText, color: "bg-primary" },
  { title: "Red Flags", value: "89", icon: Flag, color: "bg-destructive" },
  { title: "Interventions", value: "67", icon: Plus, color: "bg-secondary" },
  { title: "Total Users", value: "1,234", icon: Users, color: "bg-accent" },
];

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    reportsCount: 5,
    joinedDate: "2024-01-10",
    status: "Active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    reportsCount: 8,
    joinedDate: "2024-01-12",
    status: "Active"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "User",
    reportsCount: 3,
    joinedDate: "2024-01-15",
    status: "Active"
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "User",
    reportsCount: 12,
    joinedDate: "2023-12-05",
    status: "Suspended"
  }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUsersPage = location.pathname === "/admin/users";

  const handleLogout = () => {
    navigate("/");
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    console.log(`Changing status of record ${id} to ${newStatus}`);
    // Mock status change - would connect to backend
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting record ${id}`);
    // Mock delete - would connect to backend
  };

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`);
    // Mock user action - would connect to backend
  };

  return (
    <div className="page-admin">
      <aside className="page-aside">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter Admin</h1>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link nav-link-active">
            <Grid3x3 size={20} />
            <span>Dashboard</span>
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
        <div className="page-header">
          <div>
            <h2 className="text-3xl font-semibold mb-2">{isUsersPage ? "User Management" : "Admin Dashboard"}</h2>
            <p className="muted-foreground">{isUsersPage ? "Manage all users" : "Manage all reports and users"}</p>
          </div>

          <div className="flex items-center gap-3">
            <span>Admin User</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>AU</span>
            </div>
          </div>
        </div>

        {!isUsersPage && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="text-white" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="record-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-xl font-semibold mb-6">All Reports</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allRecords.map((record) => (
                  <div key={record.id} className="record-card" style={{ display: 'flex', gap: '1.5rem', padding: '1rem', border: '1px solid hsl(var(--border))' }}>
                    <img src={record.image} alt={record.title} className="record-image" style={{ width: '8rem', height: '8rem' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                          <span className={`record-badge ${record.type === "Red Flag" ? 'badge-destructive' : 'badge-secondary'}`}>{record.type}</span>
                          <h4 className="text-lg font-semibold">{record.title}</h4>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select value={record.status} onChange={(e) => handleStatusChange(record.id, e.target.value)} className="input-with-margin" style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}>
                            <option value="PENDING">Pending</option>
                            <option value="UNDER INVESTIGATION">Under Investigation</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>
                        </div>
                      </div>

                      <p className="muted-foreground mb-3">{record.description}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                        <div>
                          <span className="muted-foreground">Status: </span>
                          <span className={record.status === "RESOLVED" ? 'status-resolved' : (record.status === 'PENDING' ? 'status-other' : 'status-other')}>{record.status}</span>
                        </div>
                        <div>
                          <span className="muted-foreground">User: </span>
                          <span>{record.user}</span>
                        </div>
                        <div>
                          <span className="muted-foreground">Created: </span>
                          <span>{record.createdAt}</span>
                        </div>
                        <div>
                          <span className="muted-foreground">Location: </span>
                          <span>{record.lat}, {record.lon}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isUsersPage && (
          <div className="record-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 className="text-xl font-semibold">All Users</h3>
              <div className="muted-foreground">Total Users: {mockUsers.length}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockUsers.map((user) => (
                <div key={user.id} className="record-card" style={{ padding: '1rem', border: '1px solid hsl(var(--border))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="brand-icon" style={{ width: '4rem', height: '4rem', fontSize: '1rem' }}>{user.name.split(' ').map(n => n[0]).join('')}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 className="text-lg font-semibold">{user.name}</h4>
                          <span className={`record-badge ${user.status === 'Active' ? '' : 'badge-destructive'}`}>{user.status}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Mail size={16} className="muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Shield size={16} className="muted-foreground" />
                            <span>{user.role}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <FileText size={16} className="muted-foreground" />
                            <span>{user.reportsCount} Reports</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Calendar size={16} className="muted-foreground" />
                            <span>Joined {user.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="outline" size="sm" onClick={() => handleUserAction(user.id, "View Details")}>View Details</Button>
                      <Button variant={user.status === "Active" ? "destructive" : "default"} size="sm" onClick={() => handleUserAction(user.id, user.status === "Active" ? "Suspend" : "Activate")}>{user.status === "Active" ? "Suspend" : "Activate"}</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
