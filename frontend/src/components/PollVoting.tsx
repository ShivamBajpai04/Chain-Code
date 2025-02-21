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
import { Label } from "@/components/ui/label";
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
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <RadioGroup value={vote || ""} onValueChange={setVote}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="agree" id="agree" />
              <Label htmlFor="agree">Agree</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="decline" id="decline" />
              <Label htmlFor="decline">Decline</Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/polls")}>
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
