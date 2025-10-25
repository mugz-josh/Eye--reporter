import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleAdminLogin = () => {
    // Mock admin login - just navigate to admin dashboard
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
                  <Input id="firstname" placeholder="John" className="input-with-margin" />
                </div>

                <div>
                  <Label htmlFor="lastname" className="text-muted-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    className="mt-2 bg-background border-border"
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
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="****"
                className="mt-2 bg-background border-border"
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
