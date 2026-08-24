import "./card.css";

import React from "react";
import { Link } from "react-router-dom";
import CertificateArt from "./CertificateArt";

interface AnimatedCardProps {
  title: string;
  code: string;
  to?: string;
  seed?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, code, to, seed }) => {
  const content = (
    <>
      {seed && (
        <CertificateArt
          seed={seed}
          className="pointer-events-none absolute inset-0 h-full w-full rounded-xl object-cover opacity-80"
        />
      )}
      {seed && (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-[#131020] via-[#131020]/55 to-[#131020]/10" />
      )}
      <div className="relative">
        <h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
        <div className="h-40 overflow-y-auto">
          <p className="text-sm">{code}</p>
        </div>
      </div>
    </>
  );

  const className = "w-80 deck-item h-80 p-6 rounded-xl shadow-lg text-white block relative overflow-hidden";

  if (to) {
    return (
      <Link to={to} className={`${className} transition-transform hover:-translate-y-1`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

export default AnimatedCard;
