import { Flag, LogOut, Grid3x3, Plus, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = storage.getCurrentUser();

  // State for storing user report stats
  const [stats, setStats] = useState({ redFlags: 0, interventions: 0, total: 0, draft: 0, underInvestigation: 0, resolved: 0, rejected: 0 });

  // State to control mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect user to homepage if not logged in
    // Tricky: Ensures unauthorized access is prevented on page load
    if (!currentUser) {
      navigate("/");
      return;
    }

    // Load user stats once component mounts
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch both red flags and interventions concurrently
      // Tricky: Promise.all runs both requests in parallel for better performance
      const [redFlagsRes, interventionsRes] = await Promise.all([
        api.getRedFlags(),
        api.getInterventions()
      ]);

      // Filter results to include only the current user's reports
      // Tricky:
      // - Ensures correct matching even if API returns numbers vs strings
      // - Uses '|| []' to avoid errors if API returns null or undefined
      const redFlagsCount = (redFlagsRes.data || []).filter((r: any) => r.user_id.toString() === currentUser?.id).length;
      const interventionsCount = (interventionsRes.data || []).filter((r: any) => r.user_id.toString() === currentUser?.id).length;
      
      // Update stats state with computed values
      // Tricky: total is derived dynamically, other fields left as 0 placeholders
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
    // Clear stored user data and navigate to homepage
    // Tricky: Ensures session is fully cleared before redirect
    storage.clearCurrentUser();
    navigate("/");
  };

  return (
    <div className="page-dashboard">
      {/* Sidebar toggle button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay for mobile sidebar */}
      <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`page-aside ${sidebarOpen ? '' : 'mobile-hidden'}`}>
        {/* ...sidebar JSX (not tricky) */}
      </aside>

      <main className="main-content">
        <div className="page-header">
          {/* ...header JSX (not tricky) */}
          <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
            {/* Tricky: Generate initials dynamically from user name */}
            <span>{currentUser?.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
        </div>

        <div className="cards-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {/* ...stat cards JSX (not tricky) */}
        </div>
      </main>
    </div>
  );
}
