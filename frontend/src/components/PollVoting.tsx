import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export function PollVoting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const castVote = async () => {
    setIsSubmitting(true);
    try {
      let voteBool = false;
      if (vote === "agree") {
        voteBool = true;
      } else if (vote === "decline") {
        voteBool = false;
      }
      console.log("vote ===========", voteBool);
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/vote/vote`,
        {
          proposalId: id,
          support: voteBool,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${window.localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setIsSubmitting(false);
      toast.toast({
        title: "Vote casted successfully",
        description: "Refresh to see the results",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      toast.toast({
        title: "Oops...",
        description: "You've already voted",
        variant: "destructive",
      });
      console.error("Error fetching poll:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!vote) return;
    e.preventDefault();

    setIsSubmitting(true);
    await castVote();
    navigate("/polls");
    setIsSubmitting(false);
  };

  return (
    <Card className="mx-auto max-w-md border-white/[0.09] bg-[#1a1530] text-[#f5f1e8] shadow-none">
      <CardHeader>
        <div>
          <p className="f-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Governance</p>
          <CardTitle className="mt-2 f-display text-xl font-semibold tracking-tight">Cast your vote</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/polls")} className="border-white/[0.12] bg-transparent hover:bg-white/[0.06] hover:text-white">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!vote || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
