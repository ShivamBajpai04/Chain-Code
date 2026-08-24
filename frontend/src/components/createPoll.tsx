import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/api";
import { toast } from "@/hooks/use-toast";

export function CreatePoll() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    // Simulating API call to create a new poll
    try {
      const response = await api.post("/vote/propose", {
        title,
        description,
      });
      setIsSubmitting(false);
      toast({
        title: "Poll created successfully",
        description: "Refresh to vote on the poll",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating poll",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md border-white/[0.09] bg-[#1a1530] text-[#f5f1e8] shadow-none">
      <CardHeader>
        <div>
          <p className="f-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Governance</p>
          <CardTitle className="mt-2 f-display text-xl font-semibold tracking-tight">Create new poll</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="f-mono text-[10px] uppercase tracking-[0.2em] text-white/55">Poll title</Label>
            <Input
              id="title"
              placeholder="Enter poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="f-mono text-[10px] uppercase tracking-[0.2em] text-white/55">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter poll description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/polls")} className="border-white/[0.12] bg-transparent hover:bg-white/[0.06] hover:text-white">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
