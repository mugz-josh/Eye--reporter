import { Flag, LogOut, Grid3x3, Plus, Menu, X, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useUser } from "@/contexts/UserContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useUser();
  const [stats, setStats] = useState({
    redFlags: 0,
    interventions: 0,
    total: 0,
    draft: 0,
    underInvestigation: 0,
    resolved: 0,
    rejected: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

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
        api.getInterventions(),
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
        rejected: 0,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleEditProfile = () => {
    if (currentUser) {
      setProfileData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
      });
    }
    setShowProfileModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await api.updateProfile(profileData);
      if (res.status === 200 && res.data) {
        
       const updatedUser = { ...currentUser, ...profileData };
        setUser(updatedUser);
        setShowProfileModal(false);
        loadStats();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="page-dashboard">
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`mobile-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`page-aside ${sidebarOpen ? "" : "mobile-hidden"}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter</h1>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: "2rem" }}>
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

          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ width: "100%", textAlign: "left" }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "1rem",
            borderTop: "1px solid hsl(var(--border))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem" }}>Theme</span>
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
            <NotificationBell />
            <span>
              {currentUser?.first_name} {currentUser?.last_name}
            </span>
            <button
              onClick={handleEditProfile}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "hsl(var(--muted-foreground))",
                padding: "0.25rem",
                borderRadius: "0.25rem",
              }}
              title="Edit Profile"
            >
              <Edit size={16} />
            </button>
            <div
              className="brand-icon"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <span>{`${currentUser?.first_name?.[0] || ""}${
                currentUser?.last_name?.[0] || ""
              }`}</span>
            </div>
          </div>

          {showProfileModal && (
            <div
              className="profile-edit-modal"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                className="profile-edit-content"
                style={{
                  background: "hsl(var(--background))",
                  padding: "2rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  maxWidth: "400px",
                  width: "100%",
                  margin: "1rem",
                }}
              >
                <h3
                  style={{
                    marginBottom: "1.5rem",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Edit Profile
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          first_name: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                        background: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        fontSize: "0.875rem",
                      }}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          last_name: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                        background: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        fontSize: "0.875rem",
                      }}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                        background: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        fontSize: "0.875rem",
                      }}
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "hsl(var(--muted))",
                      color: "hsl(var(--muted-foreground))",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cards-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div
              className="stat-value"
              style={{ color: "hsl(var(--primary))" }}
            >
              {stats.total}
            </div>
            <div className="stat-label">Total Reports</div>
          </div>

          <div className="stat-card">
            <div
              className="stat-value"
              style={{ color: "hsl(var(--destructive))" }}
            >
              {stats.redFlags}
            </div>
            <div className="stat-label">Red Flags</div>
          </div>

          <div className="stat-card">
            <div
              className="stat-value"
              style={{ color: "hsl(var(--chart-2))" }}
            >
              {stats.interventions}
            </div>
            <div className="stat-label">Interventions</div>
          </div>
        </div>
      </main>
    </div>
  );
}
