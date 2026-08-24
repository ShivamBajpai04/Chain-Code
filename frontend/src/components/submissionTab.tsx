import { useEffect, useState } from "react";
import axios from "axios";
import { useProblemContext } from "@/context/ProblemContext";
import AnimatedCard from "./ui/animatedCard";
import { useToast } from "@/hooks/use-toast";

const MAX_CARDS = 12;

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedProblem } = useProblemContext();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentSubmissions();
  }, [selectedProblem]);

  const fetchRecentSubmissions = async () => {
    if (!selectedProblem?._id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${import.meta.env.VITE_DOMAIN}/submissions/problem/${
        selectedProblem._id
      }`;
      const response = await axios.get(url);
      setSubmissions(response.data);
    } catch (error: any) {
      setError(`Failed to fetch recent submissions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Loading submissions…
      </div>
    );
  }

  if (!selectedProblem?._id) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Loading problem…
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-white/45">
        No accepted submissions yet — be the first to solve this one.
      </div>
    );
  }

  const sorted = [...submissions].sort(
    (a: any, b: any) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
  const visible = sorted.slice(0, MAX_CARDS);
  const hidden = sorted.length - visible.length;

  return (
    <div className="flex flex-1 flex-col overflow-auto p-2">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/10 pb-3">
        <p className="f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {sorted.length} accepted · newest first
        </p>
        {selectedProblem.sample && (
          <p className="f-mono text-[10px] uppercase tracking-[0.15em] text-[#e8c664]/70">
            sandbox · clears 1h after each solve
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-5 lg:justify-start">
        {visible.map((submission: any) => (
          <div key={submission._id} className="flex flex-col items-center gap-1.5">
            <AnimatedCard
              title={
                timeAgo(submission.createdAt) ||
                selectedProblem?.title ||
                "Untitled Problem"
              }
              code={submission.code}
              to={`/nft/${submission._id}`}
            />
            {submission.mintTxHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${submission.mintTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-[#e8c664] hover:underline"
              >
                View on Etherscan
              </a>
            )}
          </div>
        ))}
      </div>
      {hidden > 0 && (
        <p className="mt-5 f-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
          +{hidden} more not shown
        </p>
      )}
    </div>
  );
}
