import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Navbar from "./navbar";

interface Poll {
  title: string;
  description: string;
  status: "ongoing" | "completed";
  proposalId: string;
}

export function PollVoting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    axios
      .get(`${import.meta.env.VITE_DOMAIN}/poll/${id}`, {
        headers: { Authorization: `${window.localStorage.getItem("token")}` },
      })
      .then((res) => setPoll(res.data.poll))
      .catch((err) => {
        setLoadError(err.response?.data?.message || "Couldn't load this poll.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const castVote = async (): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/vote/vote`,
        { proposalId: id, support: vote === "agree" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${window.localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      toast({
        title: "Vote cast successfully",
        description: "Refresh to see the results",
        variant: "success",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Vote didn't go through",
        description: error.response?.data?.message || "The vote couldn't be recorded. Please try again.",
        variant: "destructive",
      });
      console.error("Error casting vote:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vote || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await castVote();
    setIsSubmitting(false);
    // only leave the page when the vote actually went through
    if (ok) {
      navigate("/polls");
    }
  };

  return (
    <div className="min-h-screen bg-[#14102e] text-[#f5f1e8]">
      <Navbar />
      <div className="p-4 md:p-6">
        {isLoading && (
          <p className="py-16 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            Loading poll…
          </p>
        )}

        {!isLoading && loadError && (
          <p className="py-16 text-center text-sm text-[#c0392b]">{loadError}</p>
        )}

        {!isLoading && !loadError && poll && (
          <Card className="mx-auto max-w-md border-white/[0.09] bg-[#1a1530] text-[#f5f1e8] shadow-none">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="f-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Governance</p>
                  <CardTitle className="mt-2 f-display text-xl font-semibold tracking-tight">
                    {poll.title}
                  </CardTitle>
                </div>
                <Badge variant={poll.status === "ongoing" ? "default" : "secondary"}>
                  {poll.status === "ongoing" ? "Ongoing" : "Completed"}
                </Badge>
              </div>
              <CardDescription className="text-white/60">{poll.description}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                {poll.status !== "ongoing" ? (
                  <p className="rounded-lg border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                    Voting closed — this poll is no longer accepting votes.
                  </p>
                ) : (
                  <RadioGroup value={vote || ""} onValueChange={setVote}>
                    <label
                      htmlFor="agree"
                      className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-200 ${
                        vote === "agree"
                          ? "border-[#7fb069]/50 bg-[#7fb069]/10 text-[#7fb069]"
                          : "border-white/[0.09] hover:bg-white/[0.04]"
                      }`}
                    >
                      <RadioGroupItem value="agree" id="agree" />
                      <span className="text-sm font-medium">Agree</span>
                    </label>
                    <label
                      htmlFor="decline"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-200 ${
                        vote === "decline"
                          ? "border-[#c0392b]/50 bg-[#c0392b]/10 text-[#d98880]"
                          : "border-white/[0.09] hover:bg-white/[0.04]"
                      }`}
                    >
                      <RadioGroupItem value="decline" id="decline" />
                      <span className="text-sm font-medium">Decline</span>
                    </label>
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/polls")}
                  className="border-white/[0.12] bg-transparent hover:bg-white/[0.06] hover:text-white"
                >
                  Cancel
                </Button>
                {poll.status === "ongoing" && (
                  <Button type="submit" disabled={!vote || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Vote"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
