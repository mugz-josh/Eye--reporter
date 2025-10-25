import { Flag, LogOut, Grid3x3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const records = [
  {
    id: 1,
    type: "Red Flag",
    title: "Bad infrastructure",
    description: "See here.",
    status: "RESOLVED",
    lat: "6.8880319",
    lon: "9.53999",
    image: "https://images.unsplash.com/photo-1518876024007-c0c7c2826904?w=400",
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
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="page-dashboard">
      <aside className="page-aside">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter</h1>
        </div>

        <Link to="/create">
          <Button className="btn-full" style={{ marginBottom: '2rem' }}>CREATE RECORD</Button>
        </Link>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/red-flags" className="nav-link nav-link-active">
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
              <Flag size={20} />
              <span>Recent Records</span>
            </div>
            <h2 className="text-2xl font-semibold">Recent Records</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>John Doe</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>JD</span>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          <div className="stats-card" style={{ backgroundColor: 'hsl(var(--primary))' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={24} />
            </div>
            <span className="text-xl font-medium">Red Flag</span>
          </div>

          <div className="stats-card" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={24} />
            </div>
            <span className="text-xl font-medium">Intervention</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6">Recent Records</h3>

        <div className="cards-grid">
          {records.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-body">
                <span className={`record-badge ${record.type === "Red Flag" ? 'badge-destructive' : 'badge-secondary'}`}>
                  {record.type}
                </span>

                <h4 className="text-lg font-semibold mb-2">{record.title}</h4>

                <div className="space-y-2 text-sm muted-foreground mb-4">
                  <p>Description</p>
                  <p>{record.description}</p>
                  <p>Status</p>
                  <p className={record.status === "RESOLVED" ? 'status-resolved' : 'status-other'}>
                    {record.status}
                  </p>
                  <p>Lat {record.lat}</p>
                  <p>Lon {record.lon}</p>
                </div>

                <img src={record.image} alt={record.title} className="record-image" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
