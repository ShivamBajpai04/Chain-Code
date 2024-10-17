import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Poll {
  id: number;
  title: string;
  description: string;
}

export function PollVoting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [vote, setVote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulating API call to fetch poll details
    setTimeout(() => {
      setPoll({
        id: Number(id),
        title: "Sample Poll",
        description: "This is a sample poll description.",
      });
    }, 1000);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vote) return;

    setIsSubmitting(true);
    // Simulating API call to submit vote
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/poll");
    }, 1500);
  };

  if (!poll) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abstain" id="abstain" />
              <Label htmlFor="abstain">Abstain</Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/poll")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!vote || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
