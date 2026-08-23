import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { useProblemContext } from "@/context/ProblemContext";
import { submitCode } from "@/utils/submitCode";
// import { useNavigate } from "react-router-dom";
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
  results?: Array<{
    status?: { description: string };
    time?: number;
    memory?: number;
  }>;
}

export default function CodeEditor() {
  const { code, setCode, selectedProblem, language } = useProblemContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  // const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (result?.error) {
      toast({
        title: "error",
        description: result.error.toString(),
        variant: "destructive",
      });
    }
  }, [result?.error]);
  useEffect(() => {
    if (result?.results) {
      toast({
        title: "Success",
        description: "Code submitted Successfully",
        variant: "success",
      });
    }
  }, [result?.results]);

  // Get the correct language identifier for Monaco Editor
  const editorLanguage =
    languageMap[language as keyof typeof languageMap] || language;

  const handleSubmit = async () => {
    // console.log(code);
    setIsSubmitting(true);
    setResult(null);

    try {
      // console.log(flattenCodeToString(code))
      const data = await submitCode(
        selectedProblem, // Pass selectedProblem here
        judge0LanguageMap[language as keyof typeof judge0LanguageMap],
        code
      );
      // console.log(data);
      setResult(data);
    } catch (error: any) {
      console.error("Error submitting code:", error);
      // const errorMessage =
      //   error.response?.data?.message ||
      //   "An error occurred while submitting your code. Please try again.";
      // console.log("Error message:", errorMessage); // Log the error message
      // setResult({ error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleCreateNFT = () => {
  //   navigate("/nft");
  // };

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
      <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <Button
            onClick={handleSubmit}
            disabled={!selectedProblem || isSubmitting}
            className="mr-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
          {/* <Button onClick={handleCreateNFT}>My NFTs</Button> */}
        </div>
        {result && (
          <div>
            {result.results &&
              result.results.map((r, index) => (
                <p
                  key={index}
                  className="rounded-md border border-white/[0.08] bg-black/25 px-3 py-1.5 font-mono text-[11px] text-white/60"
                >
                  Test {index + 1}:{" "}
                  <span
                    className={
                      r.status?.description?.toLowerCase().includes("accepted")
                        ? "text-[#7fb069]"
                        : "text-[#d98880]"
                    }
                  >
                    {r.status?.description}
                  </span>{" "}
                  · {r.time}s · {r.memory} KB
                </p>
              ))}
            {result.error && <p>{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
