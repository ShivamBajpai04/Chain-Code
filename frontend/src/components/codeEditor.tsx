import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import Editor from "@monaco-editor/react";
import { Check, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProblemContext } from "@/context/ProblemContext";
import { submitCode, type SubmitPhase } from "@/utils/submitCode";
import { useToast } from "@/hooks/use-toast";

// Map of our language identifiers to Monaco Editor language identifiers
const languageMap = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

// Map our language identifiers to Judge0 language IDs
const judge0LanguageMap = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  java: 62, // Java
  cpp: 105, // C++
};

interface ResultType {
  error?: string;
  submissionId?: string;
  mintTxHash?: string;
  results?: Array<{
    status?: { description: string };
    time?: number;
    memory?: number;
  }>;
}

export default function CodeEditor() {
  const { code, setCode, selectedProblem, language } = useProblemContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<SubmitPhase | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mintTakingLong, setMintTakingLong] = useState(false);

  // the "verifying" step is honest about what actually happens for a
  // sandbox problem — the backend skips the AI check entirely, so don't
  // imply a real originality check is running
  const stages: { key: SubmitPhase; label: string }[] = [
    { key: "judging", label: `Running ${selectedProblem?.title ?? "the"} test cases` },
    {
      key: "verifying",
      label: selectedProblem?.skipUniqueCheck
        ? "Saving submission (originality check skipped — sandbox)"
        : "Verifying originality",
    },
    {
      key: "minting",
      label: mintTakingLong
        ? "Minting certificate — still working, this can take a couple minutes"
        : "Minting certificate",
    },
  ];

  useEffect(() => {
    setResult(null);
  }, [selectedProblem?._id]);

  // a normal mint confirms in ~20-25s on Sepolia. Past that, let the user
  // know it's not stuck — testnets stall under congestion and the request
  // itself now waits up to 5 minutes before giving up, so silence that long
  // would just look broken.
  useEffect(() => {
    setMintTakingLong(false);
    if (phase !== "minting") return;
    const timer = setTimeout(() => {
      setMintTakingLong(true);
      toast({
        title: "Still minting…",
        description:
          "This is taking longer than usual — Sepolia confirmations can stall under network congestion. Still working, no need to resubmit.",
      });
    }, 30_000);
    return () => clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (result?.error) {
      toast({
        title: `${selectedProblem?.title ?? "Submission"} didn't go through`,
        description: result.error.toString(),
        variant: "destructive",
      });
    }
  }, [result?.error]);
  useEffect(() => {
    if (result?.submissionId) {
      toast({
        title: "Certificate minted",
        description: `Your accepted solution for "${selectedProblem?.title}" is now sealed on-chain.`,
        variant: "success",
        action: (
          <div className="flex flex-col gap-1.5">
            <ToastAction
              altText="View certificate"
              onClick={() => navigate(`/nft/${result.submissionId}`)}
            >
              View certificate
            </ToastAction>
            {result.mintTxHash && (
              <ToastAction
                altText="View on Etherscan"
                onClick={() =>
                  window.open(
                    `https://sepolia.etherscan.io/tx/${result.mintTxHash}`,
                    "_blank"
                  )
                }
              >
                View on Etherscan
              </ToastAction>
            )}
          </div>
        ),
      });
    }
  }, [result?.submissionId]);

  // Get the correct language identifier for Monaco Editor
  const editorLanguage =
    languageMap[language as keyof typeof languageMap] || language;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await submitCode(
        selectedProblem,
        judge0LanguageMap[language as keyof typeof judge0LanguageMap],
        code,
        setPhase
      );
      setResult(data);
    } catch (error: any) {
      console.error("Error submitting code:", error);
    } finally {
      setIsSubmitting(false);
      setPhase(null);
    }
  };

  const activeStageIndex = phase ? stages.findIndex((s) => s.key === phase) : -1;

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#131020] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]">
      <Editor
        height="65vh"
        language={editorLanguage}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            padding: { top: 12 },
          }}
        />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!selectedProblem || isSubmitting}
            title={!selectedProblem ? "Waiting for the problem to load" : undefined}
          >
            {!selectedProblem ? "Loading problem…" : isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
          {selectedProblem?.skipUniqueCheck && (
            <span className="f-mono text-[10px] uppercase tracking-[0.15em] text-[#e8c664]">
              Sandbox — originality check skipped
            </span>
          )}
        </div>

        {isSubmitting && (
          <div className="flex flex-col gap-1.5 rounded-md border border-white/[0.08] bg-black/20 px-3 py-2.5">
            {stages.map((stage, i) => {
              const state =
                activeStageIndex > i ? "done" : activeStageIndex === i ? "active" : "pending";
              return (
                <div key={stage.key} className="flex items-center gap-2 text-[12px]">
                  {state === "done" ? (
                    <Check className="h-3.5 w-3.5 text-[#7fb069]" />
                  ) : state === "active" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#d4a017]" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-white/20" />
                  )}
                  <span className={state === "pending" ? "text-white/30" : "text-white/70"}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-1.5">
            {result.results && (
              <>
                <p className="text-[11px] font-medium text-white/70">
                  {result.results.filter((r) => r.status?.description?.toLowerCase().includes("accepted")).length}
                  /{result.results.length} tests passed
                </p>
                {result.results.map((r, index) => {
                  const passed = r.status?.description?.toLowerCase().includes("accepted");
                  return (
                    <p
                      key={index}
                      className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/25 px-3 py-1.5 font-mono text-[11px] text-white/60"
                    >
                      {passed ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#7fb069]" />
                      ) : (
                        <X className="h-3.5 w-3.5 shrink-0 text-[#d98880]" />
                      )}
                      Test {index + 1}:{" "}
                      <span className={passed ? "text-[#7fb069]" : "text-[#d98880]"}>
                        {r.status?.description}
                      </span>
                      · {r.time}s · {r.memory} KB
                    </p>
                  );
                })}
              </>
            )}
            {result.error && (
              <p className="rounded-md border border-[#c0392b]/30 bg-[#c0392b]/10 px-3 py-1.5 text-[12px] text-[#d98880]">
                {result.error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
