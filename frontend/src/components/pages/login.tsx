import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, LockKeyhole, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Enter a valid email and your password to continue.");
      return;
    }
    setError(null);
    try {
      await onLogin(email, password);
      navigate("/problems");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 420px at 15% -10%, rgba(212,160,23,0.06), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(212,160,23,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 25%, transparent 80%)",
        }}
      />

      <Header />

      <div className="container relative z-10 flex min-h-screen items-center justify-center px-4 pb-16 pt-28">
        <motion.div
          className="w-full max-w-md rounded-xl border border-white/[0.09] bg-[#f5f1e8] p-8 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="f-mono text-[10px] uppercase tracking-[0.25em] text-[#14102e]/50">
            ChainCode · access
          </p>
          <h1 className="mt-3 f-display text-3xl font-semibold tracking-tight text-[#14102e]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#14102e]/60">
            Log in to keep solving. Your certificates stay tied to this account.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-start gap-2 rounded-lg border border-[#c0392b]/30 bg-[#c0392b]/[0.07] px-3.5 py-2.5 text-sm text-[#a93226]"
              role="alert"
            >
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="f-mono text-[10px] uppercase tracking-[0.2em] text-[#14102e]/60"
              >
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14102e]/35" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={email.length > 0 && !emailValid}
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#14102e] outline-none transition-all duration-200 placeholder:text-[#14102e]/30 focus:border-[#c89d4a] focus:shadow-[0_0_0_3px_rgba(200,157,74,0.15)] ${
                    email.length > 0 && !emailValid
                      ? "border-[#c0392b]/50"
                      : emailValid
                        ? "border-[#7fb069]/50"
                        : "border-[#14102e]/20"
                  }`}
                />
              </div>
              {email.length > 0 && !emailValid && (
                <p className="mt-1.5 text-xs text-[#a93226]">
                  That doesn't look like an email address.
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="password"
                  className="f-mono text-[10px] uppercase tracking-[0.2em] text-[#14102e]/60"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14102e]/35" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-[#14102e]/20 bg-white pl-10 pr-11 text-sm text-[#14102e] outline-none transition-all duration-200 placeholder:text-[#14102e]/30 focus:border-[#c89d4a] focus:shadow-[0_0_0_3px_rgba(200,157,74,0.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#14102e]/40 transition-colors duration-200 hover:text-[#14102e]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-[#ecc76a] to-[#c89d4a] py-3 text-sm font-semibold text-[#14102e] shadow-[0_8px_22px_-6px_rgba(200,157,74,0.55)] transition-all duration-200 enabled:hover:-translate-y-px enabled:hover:shadow-[0_12px_28px_-6px_rgba(200,157,74,0.65)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
              Log in
            </button>
          </form>

          <p className="mt-6 border-t border-[#14102e]/10 pt-5 text-center text-sm text-[#14102e]/60">
            New to ChainCode?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-medium text-[#a4760e] underline-offset-4 transition-colors duration-200 hover:text-[#c89d4a] hover:underline"
            >
              Create an account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
