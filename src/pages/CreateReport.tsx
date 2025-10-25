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
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Flag className="text-primary-foreground" size={20} />
          </div>
          <h1 className="text-xl font-semibold">iReporter</h1>
        </div>

        <Link to="/create">
          <Button className="w-full mb-8 h-12">CREATE RECORD</Button>
        </Link>

        <nav className="space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-foreground"
          >
            <Grid3x3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/red-flags"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-foreground"
          >
            <Flag size={20} />
            <span>Red Flags</span>
          </Link>

          <Link
            to="/interventions"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-foreground"
          >
            <Plus size={20} />
            <span>Interventions</span>
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
          <h2 className="text-3xl font-semibold">Edit Red Flag</h2>

          <div className="flex items-center gap-3">
            <span>John Doe</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span>JD</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8">Create Record</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label className="text-muted-foreground mb-3 block">Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setReportType("red-flag")}
                  className={`rounded-xl p-6 flex flex-col items-center gap-3 border-2 ${
                    reportType === "red-flag"
                      ? "bg-destructive/20 text-destructive border-destructive"
                      : "bg-secondary/20 text-secondary-foreground border-transparent hover:border-border"
                  }`}
                >
                  <Flag size={24} />
                  <span className="font-medium">Red Flag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportType("intervention")}
                  className={`rounded-xl p-6 flex flex-col items-center gap-3 border-2 ${
                    reportType === "intervention"
                      ? "bg-secondary/20 text-secondary-foreground border-secondary"
                      : "bg-secondary/20 text-secondary-foreground border-transparent hover:border-border"
                  }`}
                >
                  <Plus size={24} />
                  <span className="font-medium">Intervention</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-muted-foreground">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter title"
                className="mt-2 bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="mt-2 bg-background border-border min-h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="latitude" className="text-muted-foreground">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="mt-2 bg-background border-border"
                />
              </div>

              <div>
                <Label htmlFor="longitude" className="text-muted-foreground">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="mt-2 bg-background border-border"
                />
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Upload Image</Label>
              <div className="mt-2 p-12 border-2 border-dashed border-border rounded-lg bg-background flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors">
                <Camera size={32} className="text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Click to upload or drag and drop
                  <br />
                  Image files only
                </p>
                <Input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-medium">
              CREATE RECORD
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
