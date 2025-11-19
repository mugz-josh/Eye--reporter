import React, { useState, useEffect } from "react";
import { Flag } from "lucide-react"; // Icon for branding
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom"; // Navigation and location hooks
import { api, authHelper } from "@/services/api"; // API service and helper for tokens
import { useToast } from "@/hooks/use-toast"; // Custom toast notifications
import { storage } from "@/utils/storage"; // Local storage helper
import type { User } from "@/types/report";

export default function Auth() {
  // Toggle to decide which form to show: login or signup
  const [showLogin, setShowLogin] = useState(false);

  // ---------------- Sign up state ----------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false); // Used to show loading indicator on signup button

  // ---------------- Login state ----------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false); // Loading indicator for login button

  const navigate = useNavigate(); // Hook to programmatically navigate
  const { toast } = useToast(); // Hook for toast notifications
  const location = useLocation(); // Hook to read URL and navigation state

  // ================= DIFFICULT LOGIC =================
  // Determine which form to show based on URL query ?mode=login or state
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || ""); // Get query params from URL
      const q = params.get("mode"); // Read ?mode query param
      const fromState = (location.state as any)?.mode; // Check navigation state for mode
      if (q === "login" || fromState === "login") {
        setShowLogin(true); // Show login form if mode=login
      }
    } catch (e) {
      // Ignore errors if URL parsing fails
    }
  }, [location.search, (location as any).state]);

  // ================= DIFFICULT LOGIC =================
  // Fetch profile from API and store normalized user object in local storage
  // Handles multiple API response shapes (array, single object, or nested user)
  const fetchAndStoreProfile = async () => {
    try {
      const resp = await api.getProfile(); // Call API to fetch user profile

      // Normalize response data to a single user object
      const raw: any =
        (resp as any)?.data?.[0] ?? // If API returns array of users
        (resp as any)?.data ??      // If API returns data object
        (resp as any)?.user ??      // If API returns nested user object
        null;

      if (raw) {
        const mapped: User = {
          id: String(raw.id || raw.user_id || raw.uuid || ""), // Normalize user ID
          name:
            [raw.first_name, raw.last_name].filter(Boolean).join(" ") || // Combine first + last name
            raw.name ||
            raw.full_name ||
            raw.username ||
            raw.email ||
            "User", // Fallback if no name is available
          email: raw.email || "",
          role: (raw.is_admin || raw.isAdmin || raw.role === 'admin') ? 'admin' : 'user', // Normalize role
          createdAt: raw.created_at || raw.createdAt || new Date().toISOString(), // Fallback to current date
        };
        storage.setCurrentUser(mapped); // Save normalized user to local storage
      }
    } catch {
      // Ignore errors fetching profile
    }
  };

  // ================= DIFFICULT LOGIC =================
  // Handle signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit
    setSignupLoading(true); // Show loading spinner

    try {
      // Call API to register new user
      const response = await api.register({
        first_name: firstName,
        last_name: lastName,
        email: signupEmail,
        password: signupPassword
      } as any);

      // If response indicates error, show toast and exit
      if (response.status >= 400) {
        toast({
          title: "Error",
          description: response.message || "Registration failed",
          variant: "destructive"
        });
        return;
      }

      // Extract token from API response
      const token = response?.data?.[0]?.token;
      if (token) {
        authHelper.setToken(token); // Save token in storage/helper
        await fetchAndStoreProfile(); // Fetch full profile after signup
        toast({ title: "Success", description: "Account created successfully!" });

        const u = storage.getCurrentUser(); // Read stored user
        if (u?.role === 'admin') navigate('/admin'); // Navigate to admin dashboard if admin
        else navigate('/dashboard'); // Otherwise go to user dashboard
      }
    } catch (err) {
      toast({ title: "Error", description: "Registration failed", variant: "destructive" });
    } finally {
      setSignupLoading(false); // Stop loading spinner
    }
  };

  // ================= DIFFICULT LOGIC =================
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit
    setLoginLoading(true); // Show loading spinner

    try {
      const response = await api.login(loginEmail, loginPassword); // Call login API

      if (response.status >= 400) {
        toast({ title: "Error", description: response.message || "Login failed", variant: "destructive" });
        return;
      }

      const token = response?.data?.[0]?.token; // Extract token from response
      if (token) {
        authHelper.setToken(token); // Save token
        await fetchAndStoreProfile(); // Fetch profile after login
        toast({ title: "Success", description: "Logged in successfully!" });

        const u = storage.getCurrentUser();
        if (u?.role === 'admin') navigate('/admin'); // Navigate admin
        else navigate('/dashboard'); // Navigate regular user
      }
    } catch (err) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    } finally {
      setLoginLoading(false); // Stop loading spinner
    }
  };

  // ----------------- RENDER -----------------
  return (
    <div className="page-auth">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="brand-icon">
            <Flag className="text-primary-foreground" size={24} />
          </div>
          <h1 className="brand-title">iReporter</h1>
        </div>

        <div className="auth-card">
          {/* Conditional render: show login or signup */}
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
                  <Button type="submit" className="btn-full" disabled={loginLoading}>
                    {loginLoading ? 'Signing In...' : 'LOGIN'}
                  </Button>
                </div>
              </form>
              <div className="text-center" style={{ marginTop: 12 }}>
                <button type="button" className="link-primary" onClick={() => setShowLogin(false)}>
                  Don't have an account? Sign Up
                </button>
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
                  <Button type="submit" className="btn-full" disabled={signupLoading}>
                    {signupLoading ? 'Creating Account...' : 'SIGN UP'}
                  </Button>
                </div>
              </form>
              <div className="text-center" style={{ marginTop: 12 }}>
                <button type="button" className="link-primary" onClick={() => setShowLogin(true)}>
                  Already have an account? Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
