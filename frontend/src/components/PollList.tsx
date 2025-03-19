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
import { CreatePoll } from "./createPoll";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import  Navbar  from "./navbar";

export function PollList() {
  const [polls, setPolls] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_DOMAIN}/poll/all`;
      const response = await axios.get(url);
      console.log(response.data);
      setPolls(response.data.polls);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

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
          Loading polls...
        </div>
      );
    }
  };

  return (
    <div className="max-h-screen overflow-hidden">
      
      <div className="grid grid-cols-5 gap-5 p-5">
        <div className="col-span-5 mb-1"> 
          <Navbar  />
        </div>
        
        <div className="col-span-3 overflow-y-scroll max-h-screen">
          {polls &&
        polls.map((poll) => <PollCard key={poll.proposalId} poll={poll} />)}
        </div>
        <div className="col-span-2 justify-items-center content-center">
          <CreatePoll />
        </div>
      </div>
    </div>
  );
}

function PollCard({ poll }: { poll: any }) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow m-5"
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          {poll.title}{" "}
          <Badge variant={poll.status === "ongoing" ? "default" : "secondary"}>
            {poll.status === "ongoing" ? "Ongoing" : "Completed"}
          </Badge>
        </CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center w-96">
          {poll.status === "ongoing" && (
            <Link
              to={`/polls/${poll.proposalId}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Vote
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
