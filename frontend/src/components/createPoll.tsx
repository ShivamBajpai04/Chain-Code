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
import axios from "axios";
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
      const response = await axios.post(
        import.meta.env.VITE_DOMAIN + "/vote/propose",
        {
          title,
          description,
        }
      );
      setIsSubmitting(false);
      toast({
        title: "Poll created successfully",
        description: "Refresh to vote on the poll",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Poll created successfully",
        description: "Refresh to vote on the poll",
        variant: "success",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              placeholder="Enter poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Poll Description</Label>
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
          <Button variant="outline" onClick={() => navigate("/polls")}>
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
