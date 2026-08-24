import Navbar from "@/components/navbar";
import ProblemList from "@/components/problemList";

interface ProblemsListProps {
  handleLogout: () => void;
}

export default function ProblemsListPage({ handleLogout }: ProblemsListProps) {
  return (
    <div className="app-ledger-grid-quiet flex min-h-screen flex-col text-[#f5f1e8]">
      <Navbar onLogout={handleLogout} />
      <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-6">
        <h1 className="f-display mb-6 text-2xl font-semibold tracking-tight">
          Problems
        </h1>
        <ProblemList />
      </div>
    </div>
  );
}
