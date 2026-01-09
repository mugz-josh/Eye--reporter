import { Flag, LogOut, Grid3x3, Plus, Menu, X, Edit, Bell, HelpCircle, Calendar, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useUser } from "@/contexts/UserContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalendarView from '@/components/CalendarView';
import ActivityTimeline from '@/components/ActivityTimeline';

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

  const [recentReports, setRecentReports] = useState<any[]>([]);

  const [chartData, setChartData] = useState({
    typeDistribution: [] as { name: string; value: number; color: string }[],
    statusDistribution: [] as { name: string; value: number; color: string }[],
    monthlyData: [] as { month: string; redFlags: number; interventions: number }[],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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

      const userRedFlags = (redFlagsRes.data || []).filter(
        (r: any) => r.user_id.toString() === currentUser?.id
      );
      const userInterventions = (interventionsRes.data || []).filter(
        (r: any) => r.user_id.toString() === currentUser?.id
      );

      // Get recent reports (combine and sort by created_at, take latest 3)
      const allUserReports = [...userRedFlags, ...userInterventions];
      const sortedReports = allUserReports
        .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
        .slice(0, 3);
      setRecentReports(sortedReports);

      const redFlagsCount = userRedFlags.length;
      const interventionsCount = userInterventions.length;

      // Calculate status distribution
      const allUserReportsForStats = [...userRedFlags, ...userInterventions];
      const statusCounts = {
        draft: 0,
        underInvestigation: 0,
        resolved: 0,
        rejected: 0,
      };

      allUserReports.forEach((report: any) => {
        const status = report.status?.toLowerCase().replace(/\s+/g, '') || 'draft';
        if (status === 'draft') statusCounts.draft++;
        else if (status === 'underinvestigation') statusCounts.underInvestigation++;
        else if (status === 'resolved') statusCounts.resolved++;
        else if (status === 'rejected') statusCounts.rejected++;
      });

      // Prepare chart data
      const typeDistribution = [
        { name: 'Red Flags', value: redFlagsCount, color: 'hsl(var(--destructive))' },
        { name: 'Interventions', value: interventionsCount, color: 'hsl(var(--chart-2))' },
      ];

      const statusDistribution = [
        { name: 'Draft', value: statusCounts.draft, color: 'hsl(var(--muted-foreground))' },
        { name: 'Under Investigation', value: statusCounts.underInvestigation, color: 'hsl(var(--chart-2))' },
        { name: 'Resolved', value: statusCounts.resolved, color: 'hsl(var(--chart-3))' },
        { name: 'Rejected', value: statusCounts.rejected, color: 'hsl(var(--destructive))' },
      ];

      // Process real monthly data from user's reports
      const monthlyStats: { [key: string]: { redFlags: number; interventions: number } } = {};

      // Initialize last 6 months
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyStats[monthKey] = { redFlags: 0, interventions: 0 };
      }

      // Count reports by month
      allUserReportsForStats.forEach((report: any) => {
        if (report.created_at || report.createdAt) {
          const createdDate = new Date(report.created_at || report.createdAt);
          const monthKey = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

          // Only count if it's within the last 6 months
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          if (createdDate >= sixMonthsAgo) {
            if (monthlyStats[monthKey]) {
              // Check if it's a red flag or intervention based on the data structure
              const isRedFlag = report.type === 'red-flag' || report.type === 'redflag' ||
                               (report.title && report.title.toLowerCase().includes('red flag')) ||
                               userRedFlags.some((rf: any) => rf.id === report.id);

              if (isRedFlag) {
                monthlyStats[monthKey].redFlags++;
              } else {
                monthlyStats[monthKey].interventions++;
              }
            }
          }
        }
      });

      // Convert to array format for the chart
      const monthlyData = Object.entries(monthlyStats).map(([month, counts]) => ({
        month: month.split(' ')[0], // Just the month abbreviation
        redFlags: counts.redFlags,
        interventions: counts.interventions,
      }));

      setStats({
        redFlags: redFlagsCount,
        interventions: interventionsCount,
        total: redFlagsCount + interventionsCount,
        draft: statusCounts.draft,
        underInvestigation: statusCounts.underInvestigation,
        resolved: statusCounts.resolved,
        rejected: statusCounts.rejected,
      });

      setChartData({
        typeDistribution,
        statusDistribution,
        monthlyData,
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

      let updatedUser = { ...currentUser };

      // Upload profile picture if selected
      if (profilePictureFile) {
        const uploadRes = await api.uploadProfilePicture(profilePictureFile);
        if (uploadRes.status === 200 && uploadRes.data && uploadRes.data[0]) {
          updatedUser.profile_picture = uploadRes.data[0].profile_picture;
        } else {
          alert("Failed to upload profile picture");
          return;
        }
      }

      // Update profile data
      const res = await api.updateProfile(profileData);
      if (res.status === 200 && res.data) {
        updatedUser = { ...updatedUser, ...profileData };
        setUser(updatedUser);
        setProfilePictureFile(null);
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
      {/* Welcome Animation */}
      <div className="welcome-animation" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'hsl(var(--background))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeOut 2s ease-in-out 1s forwards'
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'slideIn 0.8s ease-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--destructive)))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            ✓
          </div>
          <h2 style={{
            color: 'hsl(var(--foreground))',
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {currentUser?.first_name}!
          </h2>
          <p style={{
            color: 'hsl(var(--muted-foreground))',
            fontSize: '1rem'
          }}>
            Ready to make a difference today?
          </p>
        </div>
      </div>

      <style >{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

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
          {/* User Profile Section */}
          {currentUser && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  className="brand-icon"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid hsl(var(--border))",
                  }}
                >
                  {currentUser.profile_picture ? (
                    <img
                      src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000").replace('/api', '')}${currentUser.profile_picture}`}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "hsl(var(--primary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "hsl(var(--primary-foreground))",
                        fontWeight: "bold",
                      }}
                    >
                      {`${currentUser.first_name?.[0] || ""}${currentUser.last_name?.[0] || ""}`}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "hsl(var(--foreground))",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {`${currentUser.first_name} ${currentUser.last_name}`}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Citizen Reporter
                  </div>
                </div>
              </div>
            </div>
          )}

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
              style={{ width: "2.5rem", height: "2.5rem", overflow: "hidden", borderRadius: "50%" }}
            >
              {currentUser?.profile_picture ? (
                <img
                  src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000").replace('/api', '')}${currentUser.profile_picture}`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    // Hide broken image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <span
                style={{
                  display: currentUser?.profile_picture ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'hsl(var(--muted))',
                  color: 'hsl(var(--muted-foreground))',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {`${currentUser?.first_name?.[0] || ""}${
                  currentUser?.last_name?.[0] || ""
                }`}
              </span>
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
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfilePictureFile(file);
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                        background: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        fontSize: "0.875rem",
                      }}
                    />
                    {profilePictureFile && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <p style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "hsl(var(--muted-foreground))" }}>
                          Selected: {profilePictureFile.name}
                        </p>
                        <img
                          src={URL.createObjectURL(profilePictureFile)}
                          alt="Profile preview"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid hsl(var(--border))"
                          }}
                        />
                      </div>
                    )}
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

        {/* Quick Actions Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "1rem" }}>
            Quick Actions
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <button
              onClick={() => navigate("/create?type=red-flag")}
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Flag size={24} style={{ color: "hsl(var(--destructive))" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>
                Create Red Flag
              </span>
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                Report corruption or issues
              </span>
            </button>

            <button
              onClick={() => navigate("/create?type=intervention")}
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Plus size={24} style={{ color: "hsl(var(--chart-2))" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>
                Create Intervention
              </span>
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                Request government help
              </span>
            </button>

            <button
              onClick={() => navigate("/notifications")}
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Bell size={24} style={{ color: "hsl(var(--primary))" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>
                View Notifications
              </span>
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                Check recent updates
              </span>
            </button>

            <button
              onClick={() => navigate("/support")}
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <HelpCircle size={24} style={{ color: "hsl(var(--chart-3))" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>
                Get Support
              </span>
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                Help and resources
              </span>
            </button>

            <button
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                padding: "1.5rem",
                background: showCalendar ? "hsl(var(--primary))" : "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Calendar size={24} style={{ color: showCalendar ? "hsl(var(--primary-foreground))" : "hsl(var(--chart-4))" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: showCalendar ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}>
                {showCalendar ? "Hide Calendar" : "View Calendar"}
              </span>
              <span style={{ fontSize: "0.75rem", color: showCalendar ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}>
                Deadlines & reminders
              </span>
            </button>
          </div>
        </div>

        {/* Activity Timeline Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "1.5rem" }}>
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <ActivityTimeline limit={8} showHeader={false} />
            </div>

            {/* Recent Reports Section */}
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                  Recent Reports
                </h4>
                <button
                  onClick={() => navigate("/red-flags")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "hsl(var(--primary))",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}
                >
                  View All →
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {recentReports.length > 0 ? (
                  recentReports.map((report: any, index: number) => {
                    const isRedFlag = report.type === 'red-flag' || report.type === 'redflag' ||
                                       (report.title && report.title.toLowerCase().includes('red flag'));
                    const priority = isRedFlag ? 'High Priority' : 'Medium Priority';
                    const priorityColor = isRedFlag ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))';
                    const priorityBg = isRedFlag ? 'hsl(var(--destructive) / 0.1)' : 'hsl(var(--chart-2) / 0.1)';

                    // Calculate time ago
                    const createdDate = new Date(report.created_at || report.createdAt);
                    const now = new Date();
                    const diffMs = now.getTime() - createdDate.getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    const timeAgo = diffDays > 0 ? `${diffDays}d ago` : `${diffHours}h ago`;

                    // Placeholder location - in real app, you might reverse geocode lat/lng
                    const lat = parseFloat(report.latitude);
                    const lng = parseFloat(report.longitude);
                    const location = (!isNaN(lat) && !isNaN(lng)) ?
                      `${lat.toFixed(2)}, ${lng.toFixed(2)}` : 'Unknown Location';

                    return (
                      <div key={report.id || index} style={{
                        padding: "0.75rem",
                        background: "hsl(var(--muted))",
                        borderRadius: "0.5rem",
                        border: "1px solid hsl(var(--border))"
                      }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))", marginBottom: "0.25rem" }}>
                          {report.title || 'Untitled Report'}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{
                            fontSize: "0.75rem",
                            color: priorityColor,
                            background: priorityBg,
                            padding: "0.125rem 0.5rem",
                            borderRadius: "9999px"
                          }}>
                            {priority}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                            {location} • {timeAgo}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem"
                  }}>
                    No recent reports found. Create your first report to see it here!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
              Analytics Overview
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={loadStats}
                style={{
                  padding: "0.5rem 1rem",
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
            {/* Report Type Distribution Pie Chart */}
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                  Report Types
                </h4>
                <div style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                  {stats.total} total
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData.typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {chartData.typeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--popover-foreground))"
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} reports (${((value / stats.total) * 100).toFixed(1)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
                {chartData.typeDistribution.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: item.color
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                  Report Status
                </h4>
                <div style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                  {stats.total} total
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1000}
                  >
                    {chartData.statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--popover-foreground))"
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} reports (${stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : 0}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginTop: "1rem" }}>
                {chartData.statusDistribution.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: item.color
                      }}
                    />
                    <span style={{ fontSize: "0.7rem", color: "hsl(var(--muted-foreground))" }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend Bar Chart */}
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                gridColumn: "1 / -1",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                  Monthly Report Trends
                </h4>
                <div style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                  Last 6 months
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={chartData.monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--popover-foreground))"
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} ${name.toLowerCase()}`,
                      name
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "1rem" }}
                  />
                  <Bar
                    dataKey="redFlags"
                    fill="hsl(var(--destructive))"
                    name="Red Flags"
                    radius={[4, 4, 0, 0]}
                    animationBegin={400}
                    animationDuration={1200}
                  />
                  <Bar
                    dataKey="interventions"
                    fill="hsl(var(--chart-2))"
                    name="Interventions"
                    radius={[4, 4, 0, 0]}
                    animationBegin={600}
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem"
          }}>
            <div style={{
              padding: "1rem",
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "hsl(var(--primary))" }}>
                {stats.draft}
              </div>
              <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                Draft Reports
              </div>
            </div>
            <div style={{
              padding: "1rem",
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "hsl(var(--chart-2))" }}>
                {stats.underInvestigation}
              </div>
              <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                Under Investigation
              </div>
            </div>
            <div style={{
              padding: "1rem",
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "hsl(var(--chart-3))" }}>
                {stats.resolved}
              </div>
              <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                Resolved
              </div>
            </div>
            <div style={{
              padding: "1rem",
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "hsl(var(--destructive))" }}>
                {stats.rejected}
              </div>
              <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                Rejected
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Integration Section */}
        {showCalendar && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                📅 Report Calendar & Reminders
              </h3>
            </div>
            <CalendarView />
          </div>
        )}
      </main>

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => window.open('https://wa.me/0754316375', '_blank')}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
        }}
        title="Contact us on WhatsApp"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0007 2.66675C8.64065 2.66675 2.66732 8.64008 2.66732 16.0001C2.66732 18.1201 3.22732 20.1201 4.24065 21.8801L2.66732 29.3334L10.2407 27.7867C11.9473 28.6934 13.9207 29.3334 16.0007 29.3334C23.3607 29.3334 29.334 23.3601 29.334 16.0001C29.334 8.64008 23.3607 2.66675 16.0007 2.66675ZM16.0007 26.6667C14.2007 26.6667 12.4407 26.1867 10.8807 25.2801L10.2407 24.9334L5.334 26.2401L6.64065 21.3867L6.294 20.7467C5.334 19.1601 4.80065 17.1201 4.80065 16.0001C4.80065 10.1201 9.57332 5.33341 15.4673 5.33341C21.334 5.33341 26.134 10.1201 26.134 16.0001C26.134 21.8801 21.334 26.6667 15.4673 26.6667H16.0007Z"
            fill="white"
          />
          <path
            d="M21.7873 18.9334C21.5473 18.8001 20.2407 18.1601 20.0273 18.0801C19.814 18.0001 19.654 17.9601 19.494 18.2001C19.334 18.4401 18.8807 19.0401 18.7473 19.2001C18.614 19.3601 18.4807 19.3867 18.2407 19.2534C18.0007 19.1201 17.2007 18.8534 16.2407 17.9867C15.494 17.3334 15.0007 16.8267 14.8673 16.5867C14.734 16.3467 14.8807 16.2267 15.014 16.0934C15.1473 15.9601 15.2807 15.8134 15.414 15.6801C15.5473 15.5467 15.6007 15.4401 15.734 15.5734C15.8673 15.7067 16.3473 16.3201 16.9073 16.8534C17.6273 17.5201 18.0807 17.6534 18.2407 17.7867C18.4007 17.9201 18.534 17.8934 18.6673 17.7601C18.8007 17.6267 19.334 17.0401 19.4673 16.9067C19.6007 16.7734 19.734 16.8267 19.8673 16.9601C20.0007 17.0934 20.534 17.6801 20.6673 17.8134C20.8007 17.9467 20.934 18.0801 20.8007 18.2134C20.6673 18.3467 20.5607 18.4534 20.4273 18.5867C20.294 18.7201 21.0273 19.0667 21.7873 19.6267C22.7073 20.3201 23.2007 20.6667 23.334 20.8001C23.4673 20.9334 23.334 21.2534 23.0673 21.6534C22.8007 22.0534 21.6273 22.7201 20.9607 22.8001C20.294 22.8801 19.494 22.5334 18.4007 21.9467C17.1207 21.2801 16.0007 20.3201 15.8673 20.1867C15.734 20.0534 14.6673 19.4401 14.6673 18.8001C14.6673 18.1601 15.014 17.8134 15.1473 17.6801C15.2807 17.5467 15.334 17.4401 15.414 17.3334C15.494 17.2267 16.2407 16.4801 16.4007 16.3201C16.5607 16.1601 16.6407 16.0934 16.8007 16.1601C16.9607 16.2267 18.0007 16.7734 18.8807 17.3334C19.4407 17.7067 20.0007 17.9467 20.3207 18.0267C20.6407 18.1067 21.0273 18.0667 21.7873 18.9334Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
