"use client";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton: React.FC = () => {
  const router = useNavigate();

  const handleBack = () => {
    router(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="flex mt-2 mb-2 items-center justify-center w-12 h-12 text-white bg-white rounded-full shadow-lg"
    >
      <ArrowLeft className="w-6 h-6 text-trading-primary" />
    </button>
  );
};

export default BackButton;
