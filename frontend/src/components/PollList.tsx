import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Poll {
  id: number;
  title: string;
  description: string;
  status: "ongoing" | "completed";
}

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    // Simulating API call to fetch polls
    setTimeout(() => {
      setPolls([
        {
          id: 1,
          title: "New Company Logo",
          description: "Vote for the new company logo design",
          status: "ongoing",
        },
        {
          id: 2,
          title: "Office Location",
          description: "Choose the new office location",
          status: "completed",
        },
        {
          id: 3,
          title: "Work Schedule",
          description: "Decide on the new work schedule",
          status: "ongoing",
        },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      {polls.map((poll) => (
        <Card key={poll.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {poll.title}{" "}
              <Badge
                variant={poll.status === "ongoing" ? "default" : "secondary"}
              >
                {poll.status === "ongoing" ? "Ongoing" : "Completed"}
              </Badge>
            </CardTitle>
            <CardDescription>{poll.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center w-96">
              {poll.status === "ongoing" && (
                <Link
                  to={`/polls/${poll.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Vote
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
