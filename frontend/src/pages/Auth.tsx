import React, { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { api, authHelper } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";
import { useUser } from "@/contexts/UserContext";
import type { User } from "@/contexts/UserContext"; // ✅ use the User type from UserContext

export default function Auth() {
  const [showLogin, setShowLogin] = useState(false);

  // Sign up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || "");
      const q = params.get("mode");
      const fromState = (location.state as any)?.mode;
      if (q === "login" || fromState === "login") {
        setShowLogin(true);
      }
    } catch (e) {
      // ignore
    }
  }, [location.search, (location as any).state]);

  // ✅ Fixed: added name and role properties
  const fetchAndStoreProfile = async (): Promise<User | null> => {
    try {
      const resp = await api.getProfile();
      const raw: any = resp?.data?.[0] ?? resp?.data ?? null; // no resp.user

      if (raw) {
        const mapped: User = {
          id: String(raw.id || raw.user_id || raw.uuid || ""),
          first_name: raw.first_name || "",
          last_name: raw.last_name || "",
          email: raw.email || "",
          phone: raw.phone || undefined,
          is_admin: raw.is_admin || raw.isAdmin || false,
          created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
          updated_at: raw.updated_at || raw.updatedAt || new Date().toISOString(),
          name: `${raw.first_name || ""} ${raw.last_name || ""}`, // ✅ added
          role: raw.is_admin || raw.isAdmin ? "admin" : "user",   // ✅ added
        };
        storage.setCurrentUser(mapped);
        setUser(mapped);
        return mapped;
      }
    } catch {
      // ignore
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    try {
      const response = await api.register({
        first_name: firstName,
        last_name: lastName,
        email: signupEmail,
        password: signupPassword,
      } as any);

      if (response.status >= 400) {
        toast({ title: "Error", description: response.message || "Registration failed", variant: "destructive" });
        return;
      }

      const token = response?.data?.[0]?.token;
      if (token) {
        authHelper.setToken(token);
        const user = await fetchAndStoreProfile();
        toast({ title: "Success", description: "Account created successfully!" });
        if (user?.is_admin) navigate('/admin');
        else navigate('/dashboard');
      }
    } catch (err) {
      toast({ title: "Error", description: "Registration failed", variant: "destructive" });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await api.login(loginEmail, loginPassword);
      if (response.status >= 400) {
        toast({ title: "Error", description: response.message || "Login failed", variant: "destructive" });
        return;
      }

      const token = response?.data?.[0]?.token;
      if (token) {
        authHelper.setToken(token);
        const user = await fetchAndStoreProfile();
        toast({ title: "Success", description: "Logged in successfully!" });
        if (user?.is_admin) navigate('/admin');
        else navigate('/dashboard');
      }
    } catch (err) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    } finally {
      setLoginLoading(false);
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
          {showLogin ? (
            <div>
              <h2 className="auth-title">Login</h2>
              <form className="auth-form" onSubmit={handleLogin}>
                <div>
                  <Label htmlFor="login-email" className="muted-foreground">Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="input-with-margin" />
                </div>
                <div>
                  <Label htmlFor="login-password" className="muted-foreground">Password</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="input-with-margin" />
                </div>
                <div className="signup-actions">
                  <Button type="submit" className="btn-full" disabled={loginLoading}>{loginLoading ? 'Signing In...' : 'LOGIN'}</Button>
                </div>
              </form>
              <div className="text-center" style={{ marginTop: 12 }}>
                <button type="button" className="link-primary" onClick={() => setShowLogin(false)}>Don't have an account? Sign Up</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="auth-title">Sign Up</h2>
              <form className="auth-form" onSubmit={handleSignup}>
                <div>
                  <Label htmlFor="firstname" className="muted-foreground">First Name</Label>
                  <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="input-with-margin" />
                </div>
                <div>
                  <Label htmlFor="lastname" className="muted-foreground">Last Name</Label>
                  <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="input-with-margin" />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="muted-foreground">Email</Label>
                  <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="input-with-margin" />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="muted-foreground">Password</Label>
                  <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required className="input-with-margin" />
                </div>
                <div className="signup-actions">
                  <Button type="submit" className="btn-full" disabled={signupLoading}>{signupLoading ? 'Creating Account...' : 'SIGN UP'}</Button>
                </div>
              </form>
              <div className="text-center" style={{ marginTop: 12 }}>
                <button type="button" className="link-primary" onClick={() => setShowLogin(true)}>Already have an account? Login</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
