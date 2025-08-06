import React from "react";

export default function QuestionCard({ question, answer, onAnswer }) {
  if (!question) return null;
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow border border-sky-100">
      <div className="text-lg font-semibold text-custom2">{question.text}</div>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-lg border transition text-left
              ${answer === idx ? "bg-custom2 text-white border-custom2" : "bg-white border-sky-100 hover:bg-custom1/30"}
              ${answer !== null && answer !== idx ? "opacity-60" : ""}
            `}
            onClick={() => onAnswer && onAnswer(idx)}
          
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
} 