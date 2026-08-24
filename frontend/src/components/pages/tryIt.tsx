import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useProblemContext } from "@/context/ProblemContext";

/** /try — jumps straight to the sandbox problem, wherever it currently lives. */
export default function TryIt() {
  const { problems, isLoading } = useProblemContext();
  const navigate = useNavigate();
  const sandbox = problems.find((p) => p.skipUniqueCheck);

  useEffect(() => {
    if (sandbox) navigate(`/problems/${sandbox._id}`, { replace: true });
  }, [sandbox]);

  if (isLoading) {
    return (
      <div className="app-ledger-grid-quiet flex min-h-screen items-center justify-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Loading sandbox…
      </div>
    );
  }

  // no sandbox problem seeded — fall back to the full list rather than a dead end
  if (!sandbox) return <Navigate to="/problems" replace />;

  return null;
}
