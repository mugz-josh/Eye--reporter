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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent text-primary"
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
          <div>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Flag size={20} />
              <span>Recent Records</span>
            </div>
            <h2 className="text-2xl font-semibold">Recent Records</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>John Doe</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span>JD</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-primary rounded-2xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Flag size={24} />
            </div>
            <span className="text-xl font-medium">Red Flag</span>
          </div>

          <div className="bg-secondary rounded-2xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="text-xl font-medium">Intervention</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6">Recent Records</h3>

        <div className="grid grid-cols-2 gap-6">
          {records.map((record) => (
            <div key={record.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6">
                <span
                  className={`inline-block px-3 py-1 rounded text-sm mb-4 ${
                    record.type === "Red Flag"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {record.type}
                </span>

                <h4 className="text-lg font-semibold mb-2">{record.title}</h4>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>Description</p>
                  <p>{record.description}</p>
                  <p>Status</p>
                  <p
                    className={
                      record.status === "RESOLVED"
                        ? "text-green-500"
                        : "text-blue-400"
                    }
                  >
                    {record.status}
                  </p>
                  <p>
                    Lat {record.lat}
                  </p>
                  <p>
                    Lon {record.lon}
                  </p>
                </div>

                <img
                  src={record.image}
                  alt={record.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
