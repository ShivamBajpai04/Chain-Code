"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedCard from "@/components/ui/animatedCard.tsx";
import { BackgroundBeams } from "../ui/background-beams";

async function getNFTs() {
  const result = (
    await axios.get(`${import.meta.env.VITE_DOMAIN}/submissions/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;
  return result;
}

const NFTPage: React.FC = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNFTs().then((result) => {
      setNfts(result);
    });
  }, []);

  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
      <div className="relative z-10 p-8 w-full">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 mb-8">
          MY NFTS
        </h1>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {nfts.map((nft: any, index: number) => (
            <div key={nft._id} className="flex flex-col items-center">
              <AnimatedCard
                title={nft.problem.title}
                code={nft.code}
              />
              <p className="text-neutral-500 mt-2">NFT {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default NFTPage;
