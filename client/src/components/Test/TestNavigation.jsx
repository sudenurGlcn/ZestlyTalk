import React from "react";

export default function TestNavigation({ current, setCurrent, total, finished }) {
  return (
    <div className="flex justify-between items-center mt-4 gap-4">
      <button
        className="px-6 py-2 rounded-lg bg-custom2 text-white font-semibold hover:bg-custom1 transition disabled:opacity-50"
        onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        disabled={current === 0} 
      >
        Önceki Soru
      </button>
      <button
        className="px-6 py-2 rounded-lg bg-custom2 text-white font-semibold hover:bg-custom1 transition disabled:opacity-50"
        onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
        disabled={current === total - 1 || finished}
      >
        Sonraki Soru
      </button>
    </div>
  );
} 