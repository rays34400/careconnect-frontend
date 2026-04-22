import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/authService";
import { getMyProfile } from "@/services/userService";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({ email, password });
      const token = data.token;

      localStorage.setItem("token", token);

      const user = await getMyProfile(token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="h-12 rounded-2xl bg-slate-50"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="h-12 rounded-2xl bg-slate-50"
          required
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="h-12 w-full rounded-2xl bg-violet-600 hover:bg-violet-700"
        disabled={loading}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Pas encore inscrit ?{" "}
        <Link
          to="/register"
          className="font-medium text-violet-600 hover:underline"
        >
          S’inscrire
        </Link>
      </p>
    </form>
  );
}