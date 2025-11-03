import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { api, authHelper } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";
import type { User } from "@/types/report";

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAndStoreProfile = async () => {
    try {
      const resp = await api.getProfile();
      const raw: any = (resp as any)?.data?.[0] ?? (resp as any)?.data ?? (resp as any)?.user ?? null;
      if (raw) {
        const mapped: User = {
          id: raw.id || raw.user_id || raw.uuid || "",
          name:
            [raw.first_name, raw.last_name].filter(Boolean).join(" ") ||
            raw.name ||
            raw.full_name ||
            raw.username ||
            raw.email ||
            "User",
          email: raw.email || "",
          role: (raw.role || "user") as "user" | "admin",
          createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
        };
        storage.setCurrentUser(mapped);
      }
    } catch {
      // ignore profile fetch errors; token is set
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const response = await api.login(email, password);
        const token = (response as any)?.data?.[0]?.token || (response as any)?.token || (response as any)?.data?.token;
        if ((response.status === 200 || response.status === 201) && token) {
          authHelper.setToken(token);
          await fetchAndStoreProfile();
          toast({ title: "Success", description: "Logged in successfully!" });
          navigate("/dashboard");
        } else {
          toast({ title: "Error", description: response.message || "Invalid credentials", variant: "destructive" });
        }
      } else {
        const response = await api.register({ first_name: firstName, last_name: lastName, email, password });
        const token = (response as any)?.data?.[0]?.token || (response as any)?.token || (response as any)?.data?.token;
        if ((response.status === 200 || response.status === 201) && token) {
          authHelper.setToken(token);
          await fetchAndStoreProfile();
          toast({ title: "Success", description: "Account created successfully!" });
          navigate("/dashboard");
        } else {
          toast({ title: "Error", description: response.message || "Failed to create account", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={24} />
          </div>
          <h1 className="brand-title">iReporter</h1>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
            <div>
              <Label htmlFor="firstname" className="muted-foreground">
                First Name
              </Label>
              <Input 
                id="firstname" 
                placeholder="John" 
                className="input-with-margin"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="lastname" className="muted-foreground">
                Last Name
              </Label>
              <Input
                id="lastname"
                placeholder="Doe"
                className="input-with-margin"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoo@gmail.com"
                className="input-with-margin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="****"
                className="input-with-margin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="btn-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : (isLogin ? "LOGIN" : "SIGN UP")}
            </Button>

            <p className="text-center muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="link-primary"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
