import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogIn, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useAuthApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user, token, login } = useAuth();
  const loginMutation = useLogin();

  if (token && user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"}
        replace
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { accessToken, user: loggedInUser } =
        await loginMutation.mutateAsync({
          email: email.trim(),
          password,
        });

      login(accessToken, loggedInUser);
      navigate(
        loggedInUser.role === "ADMIN"
          ? "/admin/dashboard"
          : "/employee/dashboard",
        { replace: true },
      );
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Failed to sign in. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 text-white font-bold text-xl mb-3 shadow-xs">
            D
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Dexa Attendance System
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Employee Attendance & Monitoring System
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@dexa.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loginMutation.isPending}
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
