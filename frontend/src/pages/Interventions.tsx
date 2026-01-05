import {
  Flag,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Clock,
  User,
  Plus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Report } from "@/types/report";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import MapPicker from "@/components/MapPicker";
import { useUser } from "@/contexts/UserContext";
import Sidebar from  "@/components/Sidebar";
import { getGreeting } from "@/utils/greetingUtils";
import { ShareReport } from "@/components/ShareReport";

export default function Interventions() {
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    resolved: 0,
    unresolved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState<{
    id?: string;
    lat: number;
    lng: number;
    open: boolean;
  } | null>(null);
  const [shareReport, setShareReport] = useState<{
    id: string;
    type: 'red-flag' | 'intervention';
    title: string;
  } | null>(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const FILE_BASE = API_URL.replace(/\/api$/, "");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    loadReports();
  }, [currentUser]);

  const loadReports = async () => {
    try {
      setLoading(true);
      console.log('Loading interventions...');
      const response = await api.getInterventions();
      console.log('Interventions API response:', response);

      if (response.status === 200 && response.data) {
        console.log('Interventions data:', response.data);
        try {
          const mappedReports = response.data.map((item: any) => ({
            id: item.id.toString(),
            type: "intervention" as const,
            title: item.title,
            description: item.description,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            status: item.status
              .toUpperCase()
              .replace("-", " ") as Report["status"],
            userId: item.user_id.toString(),
            userName: `${item.first_name} ${item.last_name}`,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            images: item.images || [],
            videos: item.videos || [],
          }));

          console.log('Mapped interventions:', mappedReports);
          setReports(mappedReports);

          const resolved = mappedReports.filter(
            (r: Report) => r.status === "RESOLVED"
          ).length;
          const unresolved = mappedReports.filter(
            (r: Report) =>
              r.status === "DRAFT" || r.status === "UNDER INVESTIGATION"
          ).length;
          const rejected = mappedReports.filter(
            (r: Report) => r.status === "REJECTED"
          ).length;
          setStats({ resolved, unresolved, rejected });
        } catch (mapError) {
          console.error('Error mapping interventions data:', mapError);
          toast({
            title: "Error",
            description: "Failed to process interventions data",
            variant: "destructive",
          });
        }
      } else {
        console.error('Invalid response:', response);
        toast({
          title: "Error",
          description: "Invalid response from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading interventions:', error);
      toast({
        title: "Error",
        description: "Failed to load interventions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleDelete = async (reportId: string, status: string) => {
    if (status !== "DRAFT") {
      toast({
        title: "Error",
        description: "Cannot delete report - status has been changed by admin",
        variant: "destructive",
      });
      return;
    }
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        await api.deleteIntervention(reportId);
        toast({
          title: "Success",
          description: "Intervention deleted successfully",
        });
        loadReports();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete intervention",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (reportId: string, status: string) => {
    if (status !== "DRAFT") {
      alert("Cannot edit report - status has been changed by admin");
      return;
    }
    navigate(`/create?id=${reportId}&type=intervention`);
  };

  const openLocationEditor = (report: Report) => {
    if (report.status !== "DRAFT") {
      toast({
        title: "Error",
        description: "Cannot update location - status changed",
        variant: "destructive",
      });
      return;
    }
    setEditingLocation({
      id: report.id,
      lat: report.latitude,
      lng: report.longitude,
      open: true,
    });
  };

  const saveLocation = async () => {
    if (!editingLocation?.id) return;
    try {
      const resp = await api.updateInterventionLocation(
        editingLocation.id,
        editingLocation.lat,
        editingLocation.lng
      );
      if (resp.status >= 400) {
        toast({
          title: "Error",
          description: resp.message || "Failed to update location",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Location updated" });
      setEditingLocation(null);
      loadReports();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    }
  };

  const displayName = currentUser
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : "";
  const initials = `${currentUser?.first_name?.[0] || ""}${
    currentUser?.last_name?.[0] || ""
  }`;

  return (
    <div className="page-dashboard min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              to="/dashboard"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home size={16} className="mr-1" />
              Dashboard
            </Link>
            <ChevronRight size={16} />
            <span className="text-foreground font-medium">Interventions</span>
          </nav>
        </div>

        <div className="page-header">
          <div className="flex-1">
            {/* Personalized Greeting */}
            <div className="mb-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock size={16} />
                <span className="text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {(() => {
                  const hour = new Date().getHours();
                  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                  return `${greeting}, ${currentUser?.first_name || 'User'}! 👋`;
                })()}
              </h1>
            </div>

            <div className="page-subtitle">
              <Plus size={20} className="text-blue-500" />
              <span>Interventions Management</span>
            </div>
            <h2 className="text-xl font-semibold text-muted-foreground">My Interventions</h2>
          </div>

          {/* Enhanced User Profile Section */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-foreground">{displayName}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <User size={12} />
                Citizen Reporter
              </div>
            </div>
            <div
              className="brand-icon relative"
              style={{
                width: "3rem",
                height: "3rem",
                overflow: "hidden",
                borderRadius: "50%",
                border: "2px solid hsl(var(--border))",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {currentUser?.profile_picture ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${currentUser.profile_picture}`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">{initials}</span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="cards-grid mb-10">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "hsl(142, 76%, 36%)" }}>
              {stats.resolved}
            </div>
            <div className="stat-label">Resolved Interventions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "hsl(221, 83%, 53%)" }}>
              {stats.unresolved}
            </div>
            <div className="stat-label">Unresolved Interventions</div>
            <div className="text-xs muted-foreground mt-1">
              (Draft or Under Investigation)
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "hsl(0, 84%, 60%)" }}>
              {stats.rejected}
            </div>
            <div className="stat-label">Rejected Interventions</div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/create?type=intervention")}
          className="mb-6"
        >
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
            <p className="muted-foreground">
              No interventions yet. Create your first report!
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {reports.map((report) => (
              <div key={report.id} className="record-card">
                <div className="record-body">
                  <span className="record-badge badge-secondary">
                    Intervention
                  </span>

                  <h4 className="text-lg font-semibold mb-2">{report.title}</h4>

                  <div className="space-y-2 text-sm muted-foreground mb-4">
                    <p>
                      <strong>Report ID:</strong> {report.id}
                    </p>
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <p>{report.description}</p>
                    <p>
                      <strong>Status:</strong>
                    </p>
                    <p
                      className={
                        report.status === "RESOLVED"
                          ? "status-resolved"
                          : "status-other"
                      }
                    >
                      {report.status}
                    </p>
                    <p>
                      <strong>Location:</strong>
                    </p>
                    <p>
                      Lat: {report.latitude.toFixed(6)}, Lon:{" "}
                      {report.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs">
                      Created: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {(report as any).images &&
                    (report as any).images.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {(report as any).images.map(
                          (img: string, idx: number) => (
                            <img
                              key={idx}
                              src={`${FILE_BASE}/uploads/${img}`}
                              alt={`${report.title} ${idx + 1}`}
                              className="record-image"
                            />
                          )
                        )}
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
                      disabled={report.status !== "DRAFT"}
                    >
                      <Edit size={16} />
                      Edit Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShareReport({ id: report.id, type: 'intervention', title: report.title })}
                    >
                      <Share2 size={16} />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(report.id, report.status)}
                      disabled={report.status !== "DRAFT"}
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
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
            }}
            onClick={() => setEditingLocation(null)}
          >
            <div
              className="bg-card"
              style={{
                width: "90%",
                maxWidth: "800px",
                padding: "1.5rem",
                borderRadius: "0.75rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2">Update Location</h3>
              <MapPicker
                latitude={editingLocation.lat}
                longitude={editingLocation.lng}
                onLocationChange={(lat, lng) =>
                  setEditingLocation({ ...editingLocation, lat, lng })
                }
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outline"
                  onClick={() => setEditingLocation(null)}
                >
                  Cancel
                </Button>
                <Button onClick={saveLocation}>Save Location</Button>
              </div>
            </div>
          </div>
        )}

        {/* Share Report Modal */}
        {shareReport && (
          <ShareReport
            reportId={shareReport.id}
            reportType={shareReport.type}
            reportTitle={shareReport.title}
            isOpen={!!shareReport}
            onClose={() => setShareReport(null)}
          />
        )}
      </main>
    </div>
  );
}
