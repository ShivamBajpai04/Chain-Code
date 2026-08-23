import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  Wallet,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface SignupProps {
  onSignup: (
    username: string,
    email: string,
    password: string,
    walletAddress: string
  ) => void;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const walletRe = /^0x[a-fA-F0-9]{40}$/;

export default function Signup({ onSignup }: SignupProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touchedSubmit, setTouchedSubmit] = useState(false);
  const navigate = useNavigate();

  // password rules, checked live
  const rules = useMemo(
    () => [
      { label: "8+ characters", ok: password.length >= 8 },
      { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
      { label: "One number", ok: /\d/.test(password) },
    ],
    [password]
  );
  const passedCount = rules.filter((r) => r.ok).length;
  const strength = passedCount; // 0–3
  const strengthLabel = ["Too weak", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["#c0392b", "#c0392b", "#d4a017", "#2e7d32"][strength];

  const usernameValid = username.trim().length >= 3;
  const emailValid = emailRe.test(email);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;
  const walletValid = walletRe.test(walletAddress);

  const canSubmit =
    usernameValid && emailValid && strength === 3 && passwordsMatch && walletValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedSubmit(true);
    if (!canSubmit) return;
    onSignup(username.trim(), email, password, walletAddress);
  };

  const field =
    "h-11 w-full rounded-lg border bg-white text-sm text-[#14102e] outline-none transition-all duration-200 placeholder:text-[#14102e]/30 focus:border-[#c89d4a] focus:shadow-[0_0_0_3px_rgba(200,157,74,0.15)]";
  const labelCls =
    "f-mono text-[10px] uppercase tracking-[0.2em] text-[#14102e]/60";

  // per-field border state
  const stateBorder = (valid: boolean, dirty: boolean) =>
    !dirty ? "border-[#14102e]/20" : valid ? "border-[#7fb069]/50" : "border-[#c0392b]/50";

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
            ChainCode · register
          </p>
          <h1 className="mt-3 f-display text-3xl font-semibold tracking-tight text-[#14102e]">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#14102e]/60">
            Three steps and your solves start minting as certificates.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* username */}
            <div>
              <label htmlFor="username" className={labelCls}>
                Username
              </label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14102e]/35" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="satoshi_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${field} pl-10 pr-10 ${stateBorder(usernameValid, username.length > 0)}`}
                />
                {username.length > 0 && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {usernameValid ? (
                      <Check className="h-4 w-4 text-[#2e7d32]" />
                    ) : (
                      <X className="h-4 w-4 text-[#c0392b]" />
                    )}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-[#14102e]/45">
                At least 3 characters. Shown beside your certificates.
              </p>
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className={labelCls}>
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
                  className={`${field} pl-10 pr-10 ${stateBorder(emailValid, email.length > 0)}`}
                />
                {email.length > 0 && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {emailValid ? (
                      <Check className="h-4 w-4 text-[#2e7d32]" />
                    ) : (
                      <X className="h-4 w-4 text-[#c0392b]" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* password + checklist */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className={labelCls}>
                  Password
                </label>
                {password.length > 0 && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
                  </span>
                )}
              </div>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14102e]/35" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${field} pl-10 pr-11`}
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

              {/* live requirement checklist */}
              <ul className="mt-2.5 space-y-1.5">
                {rules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      rule.ok ? "text-[#2e7d32]" : "text-[#14102e]/45"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                        rule.ok
                          ? "border-[#2e7d32] bg-[#2e7d32]"
                          : "border-[#14102e]/25"
                      }`}
                    >
                      {rule.ok && (
                        <svg viewBox="0 0 24 24" className="h-2 w-2 text-white" fill="none" stroke="currentColor" strokeWidth="4">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>

              {/* strength bar */}
              {password.length > 0 && (
                <div className="mt-2.5 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: i < strength ? strengthColor : "rgba(20,16,46,0.12)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={labelCls}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${field} mt-2 px-4 ${stateBorder(passwordsMatch, confirmPassword.length > 0)}`}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1.5 text-xs text-[#a93226]">
                  The two passwords don't match yet.
                </p>
              )}
            </div>

            {/* wallet address */}
            <div>
              <label htmlFor="walletAddress" className={labelCls}>
                Wallet address
              </label>
              <div className="relative mt-2">
                <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14102e]/35" />
                <input
                  id="walletAddress"
                  type="text"
                  spellCheck={false}
                  placeholder="0x…"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className={`${field} pl-10 pr-10 font-mono text-xs ${stateBorder(walletValid, walletAddress.length > 0)}`}
                />
                {walletAddress.length > 0 && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {walletValid ? (
                      <Check className="h-4 w-4 text-[#2e7d32]" />
                    ) : (
                      <X className="h-4 w-4 text-[#c0392b]" />
                    )}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-[#14102e]/45">
                Where your NFT certificates are minted. A standard Ethereum
                address (0x + 40 hex characters). We never ask for a seed phrase.
              </p>
            </div>

            {/* submit — explains itself when blocked */}
            <button
              type="submit"
              disabled={!canSubmit}
              onMouseEnter={() => setTouchedSubmit(true)}
              className="relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-[#ecc76a] to-[#c89d4a] py-3 text-sm font-semibold text-[#14102e] shadow-[0_8px_22px_-6px_rgba(200,157,74,0.55)] transition-all duration-200 enabled:hover:-translate-y-px enabled:hover:shadow-[0_12px_28px_-6px_rgba(200,157,74,0.65)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
              Create account
            </button>
            {!canSubmit && touchedSubmit && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="-mt-2 text-center text-xs text-[#a93226]"
              >
                Finish the highlighted fields above to continue.
              </motion.p>
            )}
          </form>

          <p className="mt-6 border-t border-[#14102e]/10 pt-5 text-center text-sm text-[#14102e]/60">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-[#a4760e] underline-offset-4 transition-colors duration-200 hover:text-[#c89d4a] hover:underline"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
