
import React, { useEffect, useState } from "react";
import { CircleUserRound, Lock } from "lucide-react";
import logo from "../../src/images/myerslogo.webp"
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1500);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-myers-darkblue flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6 relative">
          <div className={`transition-all duration-700 ${animationStage >= 1 ? "opacity-100" : "opacity-0"}`}>
          <img src={logo} alt="User Avatar" className="h-20 w-40 text-myers-blue" />
          </div>
          <div className={`absolute transition-all duration-700 ${animationStage >= 2 ? "opacity-100" : "opacity-0"}`}>
            {/* <Lock className="w-8 h-8 text-myers-blue" /> */}
          </div>
        </div>
        <h1 className={`text-4xl font-poppins font-bold text-white mb-2 transition-all duration-700 ${animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          Myers Security
        </h1>
        <p className={`text-xl text-white/80 transition-all duration-700 ${animationStage >= 2 ? "opacity-100" : "opacity-0"}`}>
          Admin Panel
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
