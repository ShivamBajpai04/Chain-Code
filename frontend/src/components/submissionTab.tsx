import { useEffect, useState } from "react";
import axios from "axios";
import { useProblemContext } from "@/context/ProblemContext";
import AnimatedCard from "./ui/animatedCard";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-2">
      <p className="text-[11px] text-white/40">
        Every accepted solution from every user, minted as a certificate — click one to view it.
      </p>
      <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
        {submissions.map((submission: any) => (
          <div key={submission._id} className="flex flex-col items-center gap-1.5">
            <AnimatedCard
              title={selectedProblem?.title || "Untitled Problem"}
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
    </div>
  );
}
