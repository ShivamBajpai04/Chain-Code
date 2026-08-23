import { useProblemContext } from "@/context/ProblemContext";
import ReactMarkdown from "react-markdown";

export default function DescriptionTab() {
  const { selectedProblem } = useProblemContext();

  return (
    <div className="flex-1">
      {selectedProblem ? (
        <div className="max-w-3xl space-y-4 leading-relaxed text-white/70 [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:bg-black/25 [&_pre]:p-4 [&_strong]:text-[#f5f1e8]">
          <h2 className="f-display mb-5 text-2xl font-semibold tracking-tight text-[#f5f1e8] md:text-3xl">{selectedProblem.title}</h2>
          <ReactMarkdown>{selectedProblem.description}</ReactMarkdown>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-white/45">Select a problem to view its description.</p>
      )}
    </div>
  );
}
