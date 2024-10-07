// import './card.css'
interface AnimatedCardProps {
  problemId: string;
  code: string;
  language: string;
}

import React from "react";
import { Button } from "./button";

interface AnimatedCardProps {
  title: string;
  code: string;
  language: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  code,
  language,
}) => {
  return (
    <div className="max-w-64 max-h-64 p-8 rounded-xl shadow-lg text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl w-fit mx-auto">
      <h3 className="text-xl font-semibold mb-4">Problem: {title}</h3>
      <div>
        <p className="w-full">{code}</p>
      </div>
      {/* <Button className="mt-4 mx-auto">Copy Code</Button> */}
    </div>
  );
};

export default AnimatedCard;
