import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { loginUser, registerUser } from "@/lib/api";

type Mode = "login" | "register";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuthStore();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setShowPassword(false);
  };

  const switchMode = () => {
    reset();
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginUser(email, password)
          : await registerUser(email, password, name);
      login(data.token, data.user);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={closeLoginModal}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 space-y-5 bg-(--bg) border border-(--border)"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-(--fg)">
            {mode === "login" ? "Sign in to Clausify" : "Create an account"}
          </h2>
          <button onClick={closeLoginModal} className="text-(--fg-tertiary)">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-(--fg-secondary)">
          Sign in to create and manage tags on your sites.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-(--bg-secondary) border border-(--border) text-(--fg)"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-(--bg-secondary) border border-(--border) text-(--fg)"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm outline-none bg-(--bg-secondary) border border-(--border) text-(--fg)"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--fg-tertiary)"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && <p className="text-xs text-high-text">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 bg-primary text-white"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center text-(--fg-secondary)">
          {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="font-medium hover:underline text-primary"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
