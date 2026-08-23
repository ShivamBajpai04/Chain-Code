import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProblemContext } from "@/context/ProblemContext";

const difficulties = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof difficulties)[number];

const difficultyColor: Record<Difficulty, string> = {
  Easy: "border-[#7fb069]/40 bg-[#7fb069]/10 text-[#7fb069]",
  Medium: "border-[#d4a017]/40 bg-[#d4a017]/10 text-[#e8c664]",
  Hard: "border-[#c0392b]/40 bg-[#c0392b]/10 text-[#d98880]",
};

export default function ProblemList() {
  const { problems, isLoading, error } = useProblemContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">("All");
  const problemsPerPage = 10;

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (difficultyFilter === "All" || problem.difficulty === difficultyFilter)
  );
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / problemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter]);

  const handleProblemSelect = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  if (isLoading && problems.length === 0) {
    return (
      <div className="py-10 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Loading problems…
      </div>
    );
  }

  if (error && problems.length === 0) {
    return <div className="py-10 text-center text-sm text-[#c0392b]">{error}</div>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <span className="f-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Filter by difficulty:
          </span>
          {(["All", ...difficulties] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              aria-pressed={difficultyFilter === d}
              title={d === "All" ? "Show every difficulty" : `Show only ${d} problems`}
              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                difficultyFilter === d
                  ? d === "All"
                    ? "border-[#c89d4a]/50 bg-[#c89d4a]/15 text-[#e8c664]"
                    : difficultyColor[d]
                  : "border-white/[0.12] text-white/45 hover:border-white/25 hover:text-white/70"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/[0.08]">
        <div className="flex items-center gap-4 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2 f-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span className="w-8 text-right">#</span>
          <span className="flex-1">Title</span>
          <span className="hidden w-64 md:block">Topics</span>
          <span className="w-24 text-right">Difficulty</span>
        </div>
        {filteredProblems.length === 0 ? (
          <p className="py-16 text-center text-sm text-white/45">No problems match your filters.</p>
        ) : (
          filteredProblems
            .slice((currentPage - 1) * problemsPerPage, currentPage * problemsPerPage)
            .map((problem, i) => (
              <button
                key={problem._id}
                onClick={() => handleProblemSelect(problem._id)}
                className="flex w-full items-center gap-4 border-b border-white/[0.05] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.04]"
              >
                <span className="w-8 text-right f-mono text-[12px] text-white/35">
                  {(currentPage - 1) * problemsPerPage + i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-[#f5f1e8] hover:text-[#e8c664]">
                  {problem.title}
                </span>
                <span className="hidden w-64 flex-wrap gap-1.5 md:flex">
                  {problem.topics?.slice(0, 3).map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="border-white/[0.12] text-[10px] font-normal text-white/45"
                    >
                      {topic}
                    </Badge>
                  ))}
                </span>
                <span className="w-24 text-right">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase tracking-widest ${difficultyColor[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </Badge>
                </span>
              </button>
            ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
}
