import { useProblemContext } from "@/context/ProblemContext";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function DescriptionTab() {
  const { selectedProblem, isFetchingProblem, error } = useProblemContext();

  if (!selectedProblem) {
    if (error) {
      return <p className="py-16 text-center text-sm text-[#c0392b]">{error}</p>;
    }
    return (
      <p className="py-16 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        {isFetchingProblem ? "Loading problem…" : "Problem not found."}
      </p>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-3xl space-y-4 leading-relaxed text-white/70 [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:bg-black/25 [&_pre]:p-4 [&_strong]:text-[#f5f1e8]">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 className="f-display text-2xl font-semibold tracking-tight text-[#f5f1e8] md:text-3xl">
            {selectedProblem.title}
          </h2>
          {selectedProblem.skipUniqueCheck && (
            <Badge
              variant="outline"
              className="border-[#d4a017]/40 bg-[#d4a017]/10 text-[10px] uppercase tracking-widest text-[#e8c664]"
              title="This problem skips the AI originality check — any correct solution mints, even duplicates."
            >
              Sandbox · no originality check
            </Badge>
          )}
        </div>
        <ReactMarkdown>{selectedProblem.description}</ReactMarkdown>
      </div>
    </div>
  );
}
