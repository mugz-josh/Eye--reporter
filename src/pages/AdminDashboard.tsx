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
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="text-xl font-semibold">iReporter Admin</h1>
        </div>

        <nav className="space-y-1">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent text-primary"
          >
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isUsersPage ? "bg-sidebar-accent text-primary" : "hover:bg-sidebar-accent text-foreground"
            }`}
          >
            <Users size={20} />
            <span>Users</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-foreground w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">
              {isUsersPage ? "User Management" : "Admin Dashboard"}
            </h2>
            <p className="text-muted-foreground">
              {isUsersPage ? "Manage all users" : "Manage all reports and users"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span>Admin User</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span>AU</span>
            </div>
          </div>
        </div>

        {!isUsersPage && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
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

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-6">All Reports</h3>
              
              <div className="space-y-4">
                {allRecords.map((record) => (
                  <div key={record.id} className="border border-border rounded-lg p-6 flex gap-6">
                    <img
                      src={record.image}
                      alt={record.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded text-sm mb-2 ${
                              record.type === "Red Flag"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {record.type}
                          </span>
                          <h4 className="text-lg font-semibold">{record.title}</h4>
                        </div>
                        
                        <div className="flex gap-2">
                          <select
                            value={record.status}
                            onChange={(e) => handleStatusChange(record.id, e.target.value)}
                            className="px-3 py-1 rounded border border-border bg-background text-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="UNDER INVESTIGATION">Under Investigation</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{record.description}</p>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Status: </span>
                          <span
                            className={
                              record.status === "RESOLVED"
                                ? "text-green-500"
                                : record.status === "PENDING"
                                ? "text-yellow-500"
                                : "text-blue-400"
                            }
                          >
                            {record.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">User: </span>
                          <span>{record.user}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created: </span>
                          <span>{record.createdAt}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location: </span>
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
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">All Users</h3>
              <div className="text-sm text-muted-foreground">
                Total Users: {mockUsers.length}
              </div>
            </div>

            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div key={user.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold">{user.name}</h4>
                          <span className={`px-3 py-1 rounded text-xs ${
                            user.status === "Active" 
                              ? "bg-green-500/20 text-green-500" 
                              : "bg-destructive/20 text-destructive"
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield size={16} className="text-muted-foreground" />
                            <span>{user.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-muted-foreground" />
                            <span>{user.reportsCount} Reports</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span>Joined {user.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user.id, "View Details")}
                      >
                        View Details
                      </Button>
                      <Button
                        variant={user.status === "Active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleUserAction(user.id, user.status === "Active" ? "Suspend" : "Activate")}
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </Button>
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
