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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Flag className="text-primary-foreground" size={24} />
          </div>
          <h1 className="text-2xl font-semibold">iReporter</h1>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-3xl font-semibold mb-8">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="firstname" className="text-muted-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    className="mt-2 bg-background border-border"
                  />
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
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoo@gmail.com"
                className="mt-2 bg-background border-border"
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

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
            >
              {isLogin ? "LOGIN" : "SIGN UP"}
            </Button>

            <p className="text-center text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
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
