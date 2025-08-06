import React from "react";

export default function TestTimer({ timeLeft }) {
  // Dakika:saniye formatı
  const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const sec = (timeLeft % 60).toString().padStart(2, "0");
  if (timeLeft === 0) {
   
    return (
      <div className="flex items-center gap-2 text-lg font-bold text-custom2">
        <span className="material-icons">timer</span>
        Süre doldu
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-custom2">
      <span className="material-icons">timer</span>
      {min}:{sec}
     
    </div>
  );
} 