import { Flag, LogOut, Grid3x3, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import MapPicker from "@/components/MapPicker";
import { storage } from "@/utils/storage";
import { api } from "@/services/api";
import { Report } from "@/types/report";

export default function CreateReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id');
  const typeParam = searchParams.get('type') as 'red-flag' | 'intervention' | null;
  
  const currentUser = storage.getCurrentUser();
  const [reportType, setReportType] = useState<"red-flag" | "intervention">(typeParam || "red-flag");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0.3476);
  const [longitude, setLongitude] = useState(32.5825);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    if (reportId) {
      const report = storage.getReportById(reportId);
      if (report && report.userId === currentUser.id) {
        setReportType(report.type);
        setTitle(report.title);
        setDescription(report.description);
        setLatitude(report.latitude);
        setLongitude(report.longitude);
        setImagePreview(report.image || "");
      }
    }
  }, [reportId]);

  const handleLogout = () => {
    storage.clearCurrentUser();
    navigate("/");
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Prepare payload for backend
    const payload = {
      title,
      description,
      latitude,
      longitude
    };

    (async () => {
      try {
        let resp: any;
        if (reportType === 'red-flag') {
          resp = await api.createRedFlag(payload, []);
        } else {
          resp = await api.createIntervention(payload, []);
        }

        if (resp?.status === 201 || resp?.status === 200) {
          toast({
            title: reportId ? "Report updated" : "Report created",
            description: `Your ${reportType} has been ${reportId ? 'updated' : 'submitted'} successfully.`,
          });

          setTimeout(() => {
            navigate(reportType === 'red-flag' ? '/red-flags' : '/interventions');
          }, 800);
        } else {
          toast({ title: 'Error', description: resp?.message || 'Failed to save report', variant: 'destructive' });
        }
      } catch (err) {
        console.error('Create report error', err);
        toast({ title: 'Error', description: 'Server error while creating report', variant: 'destructive' });
      }
    })();
  };

  return (
    <div className="page-create">
      <aside className="page-aside">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">iReporter</h1>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '2rem' }}>
          <Link to="/dashboard" className="nav-link">
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/red-flags" className="nav-link">
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
          <h2 className="text-3xl font-semibold">{reportId ? 'Edit' : 'Create'} Report</h2>

          <div className="flex items-center gap-3">
            <span>{currentUser?.name}</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>{currentUser?.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
        </div>

        <div className="bg-card record-card" style={{ borderRadius: '1rem', padding: '2rem', maxWidth: '50rem' }}>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <Label className="muted-foreground mb-3 block">Type</Label>
              {typeParam ? (
                <div className={`record-type ${reportType === "red-flag" ? 'badge-destructive' : 'badge-secondary'}`}
                  style={{ 
                    borderRadius: '1rem', 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    border: '2px solid hsl(var(--primary))',
                    cursor: 'default'
                  }}
                >
                  {reportType === "red-flag" ? <Flag size={24} /> : <Plus size={24} />}
                  <span className="font-medium">{reportType === "red-flag" ? "Red Flag" : "Intervention"}</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setReportType("red-flag")}
                    className={`record-type ${reportType === "red-flag" ? 'badge-destructive' : 'badge-secondary'}`}
                    style={{ borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', border: '2px solid transparent' }}
                  >
                    <Flag size={24} />
                    <span className="font-medium">Red Flag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType("intervention")}
                    className={`record-type ${reportType === "intervention" ? 'badge-secondary' : 'badge-secondary'}`}
                    style={{ 
                      borderRadius: '1rem', 
                      padding: '1.25rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      border: reportType === "intervention" ? '2px solid hsl(var(--primary))' : '2px solid transparent'
                    }}
                  >
                    <Plus size={24} />
                    <span className="font-medium">Intervention</span>
                  </button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="title" className="muted-foreground">Title *</Label>
              <Input 
                id="title" 
                placeholder="Enter title" 
                className="input-with-margin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="muted-foreground">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Enter description" 
                className="input-with-margin"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <MapPicker 
                latitude={latitude}
                longitude={longitude}
                onLocationChange={handleLocationChange}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <Label htmlFor="latitude" className="text-xs muted-foreground">Latitude</Label>
                  <Input 
                    id="latitude" 
                    type="number" 
                    step="any" 
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="input-with-margin"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude" className="text-xs muted-foreground">Longitude</Label>
                  <Input 
                    id="longitude" 
                    type="number" 
                    step="any" 
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="input-with-margin"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="muted-foreground">Upload Image (Optional)</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="input-with-margin"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ marginTop: '1rem', maxWidth: '100%', borderRadius: '0.5rem' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" className="flex-1">
                {reportId ? 'UPDATE REPORT' : 'CREATE REPORT'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
