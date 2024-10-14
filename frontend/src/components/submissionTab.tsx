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
  const {toast} = useToast();
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

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading submissions...
      </div>
    );
  }

  if (!selectedProblem?._id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Please select a problem to view submissions.
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        No submissions found for this problem.
      </div>
    );
  }

  return (
    <div className="flex overflow-auto">
      {submissions.map((submission: any) => (
        <AnimatedCard
          key={submission._id}
          title={selectedProblem?.title || "Untitled Problem"}
          code={submission.code}
        />
      ))}
    </div>
  );
}
