import { Link, useParams } from "react-router-dom";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AnimatedCard from "@/components/ui/animatedCard";
import Navbar from "@/components/navbar";
interface NFTData {
  title: string;
  code: string;
  language: string;
  mintTxHash?: string;
}

async function getNFT(id: string): Promise<NFTData> {
  try {
    const response = await api.get(`/submissions/${id}`);
    // console.log(response.data);
    return {
      title: response.data.problem.title,
      code: response.data.code,
      language: response.data.language,
      mintTxHash: response.data.mintTxHash,
    };
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    throw error;
  }
}

export const DNFT: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nft, setNFT] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getNFT(id)
        .then((data) => {
          setNFT(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error in DNFT component:", err);
          setError("Failed to load NFT data. Please try again.");
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="app-ledger-grid flex min-h-screen flex-col text-[#f5f1e8]">
      <Navbar />
      <div className="flex-1 p-4 md:p-6">
        <Link
          to="/nft"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/45 transition-colors hover:text-[#e8c664]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          My NFTs
        </Link>
        <div className="flex flex-col items-center gap-3 py-8">
          {loading && (
            <p className="f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              Loading certificate…
            </p>
          )}
          {!loading && error && <p className="text-sm text-[#c0392b]">{error}</p>}
          {!loading && !error && !nft && (
            <p className="text-sm text-white/45">No certificate data found.</p>
          )}
          {!loading && !error && nft && (
            <>
              {nft.code ? (
                <AnimatedCard title={nft.title} code={nft.code} seed={id} />
              ) : (
                <div className="flex h-48 w-72 flex-col items-center justify-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="f-mono text-[10px] uppercase tracking-[0.2em] text-[#d4a017]">
                    Sealed certificate
                  </p>
                  <p className="text-xs leading-snug" style={{ color: "rgba(245,241,232,0.45)" }}>
                    Source is private. Authenticity is verifiable on-chain via the mint transaction below.
                  </p>
                </div>
              )}
              {nft.mintTxHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${nft.mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#e8c664] hover:underline"
                >
                  View on Etherscan
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DNFT;
