import React, { useState, useEffect } from "react";

export default function QuestionProgress({ questions, answers, current, onJumpToQuestion }) {
  return (
    <div className="flex gap-1">
      {questions.map((q, idx) => (
        <button
          key={idx}
          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border-2 transition
            ${current === idx ? "border-rose-400" : "border-sky-100"}
            ${answers[idx] !== null ? "bg-custom2 text-white" : "bg-gray-200 text-gray-400"}
          `}
          onClick={() => onJumpToQuestion(idx)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}