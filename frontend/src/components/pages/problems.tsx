import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import CodeEditor from "@/components/codeEditor";
import DescriptionTab from "@/components/descriptionTab";
import SubmissionsTab from "@/components/submissionTab";
import { useProblemContext } from "@/context/ProblemContext";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const languageTemplates = {
  javascript: "// Your JavaScript code here",
  python: "# Your Python code here",
  java: "// Your Java code here",
  cpp: "// Your C++ code here",
};

interface ProblemsProps {
  handleLogout: () => void;
}

export default function Problems({ handleLogout }: ProblemsProps) {
  const { id } = useParams<{ id: string }>();
  const { language, setLanguage, setCode, code, selectedProblem, fetchProblemById } =
    useProblemContext();
  // per problem+language draft, so switching problems resets the editor
  // (like LeetCode) while switching back restores what you had
  const drafts = useRef<Record<string, string>>({});
  const currentKey = useRef<string | null>(null);
  const latestCode = useRef(code);
  latestCode.current = code;

  useEffect(() => {
    if (id && selectedProblem?._id !== id) {
      fetchProblemById(id);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const key = `${id}:${language}`;
    if (currentKey.current === key) return;
    if (currentKey.current) {
      drafts.current[currentKey.current] = latestCode.current;
    }
    currentKey.current = key;
    setCode(
      key in drafts.current
        ? drafts.current[key]
        : languageTemplates[language as keyof typeof languageTemplates]
    );
  }, [id, language]);

  const handleLanguageChange = (value: string) => setLanguage(value);

  return (
    <div className="flex min-h-screen flex-col bg-[#14102e] text-[#f5f1e8]">
      <Navbar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Link
          to="/problems"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/45 transition-colors hover:text-[#e8c664]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All problems
        </Link>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="submissions">All Submissions</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <DescriptionTab />
              </TabsContent>
              <TabsContent value="submissions">
                <SubmissionsTab />
              </TabsContent>
            </Tabs>
          </div>
          <div className="min-w-0">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="mb-4 w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
