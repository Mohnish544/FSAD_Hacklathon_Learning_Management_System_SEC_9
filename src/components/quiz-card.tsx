"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizCardProps {
  questions: QuizQuestion[];
}

export function QuizCard({ questions }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const score = useMemo(() => {
    let correct = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correctOption) {
        correct += 1;
      }
    });

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / Math.max(1, questions.length)) * 100),
    };
  }, [answers, questions]);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Quick Quiz</h2>
        <p className="text-sm font-semibold text-emerald-700">
          Score: {score.correct}/{score.total} ({score.percentage}%)
        </p>
      </div>
      {questions.map((question) => (
        <div key={question.id} className="space-y-2 rounded-xl border border-slate-100 p-3">
          <p className="text-sm font-semibold text-slate-900">{question.prompt}</p>
          <div className="grid gap-2">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setAnswers((previous) => ({ ...previous, [question.id]: index }))
                  }
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
