import { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/utils/storage";
import { User } from "@/types/report";

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock login - check if user exists
      const users = storage.getUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        storage.setCurrentUser(user);
        navigate("/dashboard");
      } else {
        alert("User not found. Please sign up first.");
      }
    } else {
      // Sign up - create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: `${firstName} ${lastName}`,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      storage.saveUser(newUser);
      storage.setCurrentUser(newUser);
      navigate("/dashboard");
    }
  };

  const handleAdminLogin = () => {
    // Mock admin login
    const adminUser: User = {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@ireporter.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    storage.setCurrentUser(adminUser);
    navigate("/admin");
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

            <Button type="submit" className="btn-full">
              {isLogin ? "LOGIN" : "SIGN UP"}
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

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAdminLogin}
            >
              Login as Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
