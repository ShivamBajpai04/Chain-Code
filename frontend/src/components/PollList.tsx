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

export function PollList({ onLogout }: { onLogout?: () => void }) {
  const [polls, setPolls] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_DOMAIN}/poll/all`;
      const response = await axios.get(url);
      setPolls(response.data.polls);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14102e] text-[#f5f1e8]">
      <Navbar onLogout={onLogout} />
      <div className="grid grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          {loading && (
            <div className="py-16 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              Loading polls…
            </div>
          )}
          {!loading && !error &&
            polls.map((poll) => <PollCard key={poll.proposalId} poll={poll} />)}
          {!loading && polls.length === 0 && !error && (
            <p className="py-16 text-center text-sm text-white/45">
              No polls yet. Create the first one.
            </p>
          )}
        </div>
        <div className="lg:col-span-2 flex justify-center items-start pt-6 lg:pt-12">
          <CreatePoll />
        </div>
      </div>
    </div>
  );
}

function PollCard({ poll }: { poll: any }) {
  return (
    <Card
      className="m-4 border-white/[0.09] bg-[#1a1530] text-[#f5f1e8] shadow-none transition-colors duration-200 hover:border-white/20"
    >
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3 text-base font-semibold">
          {poll.title}{" "}
          <Badge variant={poll.status === "ongoing" ? "default" : "secondary"}>
            {poll.status === "ongoing" ? "Ongoing" : "Completed"}
          </Badge>
        </CardTitle>
        <CardDescription className="text-white/50">{poll.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center justify-between">
          {poll.status === "ongoing" && (
            <Link
              to={`/polls/${poll.proposalId}`}
              className="inline-flex h-9 items-center rounded-md border border-[#c89d4a]/40 bg-[#c89d4a]/10 px-4 py-2 text-sm font-medium text-[#e8c664] transition-colors duration-200 hover:bg-[#c89d4a]/20"
            >
              Vote
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
