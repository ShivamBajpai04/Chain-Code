import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProblemContext } from "@/context/ProblemContext";

export default function ProblemList() {
  const { problems, fetchProblemById, isLoading, error } = useProblemContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const problemsPerPage = 10;

  useEffect(() => {
    const filtered = problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProblems(filtered);
    setCurrentPage(1);
  }, [searchTerm, problems]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProblemSelect = (problemId: string) => {
    fetchProblemById(problemId);
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Loading problems…
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-sm text-[#c0392b]">{error}</div>;
  }

  return (
    <>
      <h2 className="f-mono mb-4 text-[10px] uppercase tracking-[0.25em] text-white/45">Problem list</h2>
      <Input
        className="mb-4"
        placeholder="Search problems..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ScrollArea className="h-[calc(100vh-200px)]">
        {filteredProblems
          .slice(
            (currentPage - 1) * problemsPerPage,
            currentPage * problemsPerPage
          )
          .map((problem) => (
            <Button
              key={problem._id}
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => handleProblemSelect(problem._id)}
            >
              {/* <span className="mr-2">{problem.title}.</span> */}
              <span className="flex-grow text-left">{problem.title}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                  problem.difficulty === "Easy"
                    ? "border-[#7fb069]/40 bg-[#7fb069]/10 text-[#7fb069]"
                    : problem.difficulty === "Medium"
                    ? "border-[#d4a017]/40 bg-[#d4a017]/10 text-[#e8c664]"
                    : "border-[#c0392b]/40 bg-[#c0392b]/10 text-[#d98880]"
                }`}
              >
                {problem.difficulty}
              </span>
            </Button>
          ))}
      </ScrollArea>
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredProblems.length / problemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredProblems.length / problemsPerPage)
          }
        >
          Next
        </Button>
      </div>
    </>
  );
}
