import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedCard from "@/components/ui/animatedCard.tsx";

async function getNFTs() {
  const result = (
    await axios.get(`process.env.DOMAIN/submissions/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;
  console.log(result);
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
    <div className="flex gap-4 overflow-x-auto bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      {nfts.map((nft) => (
        <AnimatedCard
          key={nft._id}
          title={nft.problem.title}
          code={nft.code}
          language={nft.language}
        />
      ))}
    </div>
  );
};

export default NFTPage;
