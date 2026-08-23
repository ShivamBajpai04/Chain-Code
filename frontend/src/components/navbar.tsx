import Header from "@/components/Header";

interface NavbarProps {
  onLogout?: () => void;
}

/** Deprecated wrapper — the single navbar lives in Header.tsx. */
export default function Navbar({ onLogout }: NavbarProps) {
  return <Header onLogout={onLogout} />;
}
