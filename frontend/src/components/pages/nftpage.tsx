"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AnimatedCard from "@/components/ui/animatedCard.tsx";
import { BackgroundBeams } from "../ui/background-beams";
import Navbar from "../navbar";

async function getNFTs() {
  const result = (
    await axios.get(`${import.meta.env.VITE_DOMAIN}/submissions/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
  ).data;
  return result;
}

const NFTPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNFTs()
      .then((result) => setNfts(result))
      .catch((err) => {
        console.error("Error fetching NFTs:", err);
        setError("Couldn't load your certificates. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#14102e] antialiased">
      <div className="relative z-10 p-8 w-full">
        <Navbar onLogout={onLogout}/>
        <h1 className="f-display mb-10 mt-6 text-center text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-tight text-[#f5f1e8]">
          MY NFTS
        </h1>

        {isLoading && (
          <p className="py-16 text-center f-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            Loading certificates…
          </p>
        )}

        {!isLoading && error && (
          <p className="py-16 text-center text-sm text-[#c0392b]">{error}</p>
        )}

        {!isLoading && !error && nfts.length === 0 && (
          <p className="py-16 text-center text-sm text-white/45">
            You haven't minted any certificates yet.{" "}
            <Link to="/problems" className="text-[#e8c664] hover:underline">
              Solve a problem
            </Link>{" "}
            to mint your first one.
          </p>
        )}

        {!isLoading && !error && nfts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {nfts.map((nft: any, index: number) => (
              <div key={nft._id} className="flex flex-col items-center">
                <AnimatedCard title={nft.problem.title} code={nft.code} to={`/nft/${nft._id}`} />
                <p className="mt-2.5 f-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Certificate {String(index + 1).padStart(2, "0")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default NFTPage;
