import { Flag, LogOut, Grid3x3, Plus, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CreateReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<"red-flag" | "intervention">("red-flag");

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Report submitted",
      description: "Your report has been submitted successfully.",
    });
    setTimeout(() => navigate("/dashboard"), 1500);
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

        <Link to="/create">
          <Button className="btn-full" style={{ marginBottom: '2rem' }}>CREATE RECORD</Button>
        </Link>

        <nav className="sidebar-nav">
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
          <h2 className="text-3xl font-semibold">Edit Red Flag</h2>

          <div className="flex items-center gap-3">
            <span>John Doe</span>
            <div className="brand-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span>JD</span>
            </div>
          </div>
        </div>

        <div className="bg-card record-card" style={{ borderRadius: '1rem', padding: '2rem', maxWidth: '42rem' }}>
          <h2 className="text-3xl font-semibold mb-8">Create Record</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <Label className="muted-foreground mb-3 block">Type</Label>
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
                  style={{ borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', border: '2px solid transparent' }}
                >
                  <Plus size={24} />
                  <span className="font-medium">Intervention</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="muted-foreground">Title</Label>
              <Input id="title" placeholder="Enter title" className="input-with-margin" />
            </div>

            <div>
              <Label htmlFor="description" className="muted-foreground">Description</Label>
              <Textarea id="description" placeholder="Enter description" className="input-with-margin" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <Label htmlFor="latitude" className="muted-foreground">Latitude</Label>
                <Input id="latitude" type="number" step="any" placeholder="0.00" className="input-with-margin" />
              </div>

              <div>
                <Label htmlFor="longitude" className="muted-foreground">Longitude</Label>
                <Input id="longitude" type="number" step="any" placeholder="0.00" className="input-with-margin" />
              </div>
            </div>

            <div>
              <Label className="muted-foreground">Upload Image</Label>
              <div className="upload-dropzone">
                <Camera size={32} className="text-muted-foreground mb-2" />
                <p className="muted-foreground">Click to upload or drag and drop<br/>Image files only</p>
                <Input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            <Button type="submit" className="btn-full">CREATE RECORD</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
