import { Flag, LogOut, Grid3x3, Plus, Bell, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = storage.getCurrentUser();

  const [stats, setStats] = useState({
    redFlags: 0,
    interventions: 0,
    total: 0,
    draft: 0,
    underInvestigation: 0,
    resolved: 0,
    rejected: 0
  });

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

      const redFlagsCount = (redFlagsRes.data || []).filter(
        (r: any) => r.user_id.toString() === currentUser?.id
      ).length;

      const interventionsCount = (interventionsRes.data || []).filter(
        (r: any) => r.user_id.toString() === currentUser?.id
      ).length;

      setStats({
        redFlags: redFlagsCount,
        interventions: interventionsCount,
        total: redFlagsCount + interventionsCount,
        draft: 0,
        underInvestigation: 0,
        resolved: 0,
        rejected: 0
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
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`page-aside ${sidebarOpen ? "" : "mobile-hidden"}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <ThemeToggle />
        </div>

        <nav className="sidebar-nav">
          <Link to="/create" className="sidebar-link">
            <Plus size={18} /> Create Report
          </Link>
          <Link to="/red-flags" className="sidebar-link">
            <Flag size={18} /> Red Flags
          </Link>
          <Link to="/interventions" className="sidebar-link">
            <Grid3x3 size={18} /> Interventions
          </Link>
          <Link to="/notifications" className="sidebar-link">
            <Bell size={18} /> Notifications
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Welcome, {currentUser?.name}</h1>
          </div>

          {/* Logout button on top right of dashboard */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="logout-btn-header"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.25rem 0.5rem",
                border: "none",
                borderRadius: "0.25rem",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer"
              }}
              title="Logout"
            >
              <LogOut size={18} /> Logout
            </button>

            <div
              className="brand-icon"
              style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span>{currentUser?.name.split(" ").map((n) => n[0]).join("")}</span>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div
          className="cards-grid"
          style={{
            marginTop: "2rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
          }}
        >
          <div className="card">
            <h3>Total Reports</h3>
            <p>{stats.total}</p>
          </div>
          <div className="card">
            <h3>Red Flags</h3>
            <p>{stats.redFlags}</p>
          </div>
          <div className="card">
            <h3>Interventions</h3>
            <p>{stats.interventions}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
