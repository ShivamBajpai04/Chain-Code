import "./card.css";

import React from "react";
import { Link } from "react-router-dom";

interface AnimatedCardProps {
  title: string;
  code: string;
  to?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, code, to }) => {
  const content = (
    <>
      <h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
      <div className="h-40 overflow-y-auto">
        <p className="text-sm">{code}</p>
      </div>
    </>
  );

  const className = "w-64 deck-item h-64 p-6 rounded-xl shadow-lg text-white block";

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
