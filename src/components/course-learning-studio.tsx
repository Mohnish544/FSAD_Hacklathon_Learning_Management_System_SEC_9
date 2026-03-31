"use client";

import { useEffect, useMemo, useState } from "react";
import type { Course, CourseModule, QuizQuestion, StudentQuizResult } from "@/lib/types";

interface CourseLearningStudioProps {
  course: Course;
}

interface StoredCourseProgress {
  completedLessonIds: string[];
  completedReadingIds: string[];
  currentModuleId: string;
  currentLessonId: string;
}

type QuizAnswers = Record<string, number>;
type LearningView = "lecture" | "resources" | "assessment";

function getStorageKeys(courseId: string) {
  return {
    progress: `eduflow-progress-${courseId}`,
    quizResults: `eduflow-quiz-results-${courseId}`,
  };
}

function scoreQuiz(questions: QuizQuestion[], answers: QuizAnswers) {
  let correct = 0;

  questions.forEach((question) => {
    if (answers[question.id] === question.correctOption) {
      correct += 1;
    }
  });

  return {
    total: questions.length,
    correct,
    percentage: Math.round((correct / Math.max(1, questions.length)) * 100),
  };
}

function moduleChecklist(
  module: CourseModule,
  completedLessonIds: string[],
  completedReadingIds: string[],
  quizResults: StudentQuizResult[],
) {
  const lessonDone = module.lessons.every((lesson) => completedLessonIds.includes(lesson.id));
  const readingDone = module.readings.every((reading) => completedReadingIds.includes(reading.id));
  const quizDone = module.quizzes.every((quiz) => {
    const result = quizResults.find((entry) => entry.quizId === quiz.id);
    return Boolean(result && result.score >= 60);
  });

  return {
    lessonDone,
    readingDone,
    quizDone,
    done: lessonDone && readingDone && quizDone,
  };
}

export function CourseLearningStudio({ course }: CourseLearningStudioProps) {
  const firstModule = course.modules[0];
  const firstLesson = firstModule?.lessons[0];

  const [storedState] = useState(() => {
    const fallback = {
      completedLessonIds: [] as string[],
      completedReadingIds: [] as string[],
      currentModuleId: firstModule?.id ?? "",
      currentLessonId: firstLesson?.id ?? "",
      quizResults: [] as StudentQuizResult[],
    };

    if (typeof window === "undefined") {
      return fallback;
    }

    const keys = getStorageKeys(course.id);
    const rawProgress = window.localStorage.getItem(keys.progress);
    const rawQuizResults = window.localStorage.getItem(keys.quizResults);

    let parsedProgress: StoredCourseProgress | null = null;
    let parsedQuizResults: StudentQuizResult[] = [];

    if (rawProgress) {
      try {
        parsedProgress = JSON.parse(rawProgress) as StoredCourseProgress;
      } catch {
        parsedProgress = null;
      }
    }

    if (rawQuizResults) {
      try {
        parsedQuizResults = JSON.parse(rawQuizResults) as StudentQuizResult[];
      } catch {
        parsedQuizResults = [];
      }
    }

    return {
      completedLessonIds: parsedProgress?.completedLessonIds ?? [],
      completedReadingIds: parsedProgress?.completedReadingIds ?? [],
      currentModuleId: parsedProgress?.currentModuleId ?? firstModule?.id ?? "",
      currentLessonId: parsedProgress?.currentLessonId ?? firstLesson?.id ?? "",
      quizResults: parsedQuizResults,
    };
  });

  const [view, setView] = useState<LearningView>("lecture");
  const [notice, setNotice] = useState("Complete lessons, readings, and quizzes to unlock the next module.");

  const [activeModuleId, setActiveModuleId] = useState(storedState.currentModuleId);
  const [activeLessonId, setActiveLessonId] = useState(storedState.currentLessonId);

  const [openModuleIds, setOpenModuleIds] = useState<string[]>(firstModule ? [firstModule.id] : []);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(storedState.completedLessonIds);
  const [completedReadingIds, setCompletedReadingIds] = useState<string[]>(storedState.completedReadingIds);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, QuizAnswers>>({});
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>(storedState.quizResults);

  const activeModule = useMemo(
    () => course.modules.find((module) => module.id === activeModuleId) ?? course.modules[0],
    [activeModuleId, course.modules],
  );

  const activeLesson = useMemo(
    () => activeModule?.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule?.lessons[0],
    [activeLessonId, activeModule],
  );

  useEffect(() => {
    if (!activeModule) {
      return;
    }

    const keys = getStorageKeys(course.id);
    const payload: StoredCourseProgress = {
      completedLessonIds,
      completedReadingIds,
      currentModuleId: activeModule.id,
      currentLessonId: activeLesson?.id ?? "",
    };

    window.localStorage.setItem(keys.progress, JSON.stringify(payload));
  }, [activeLesson?.id, activeModule, completedLessonIds, completedReadingIds, course.id]);

  const moduleStates = useMemo(() => {
    return course.modules.map((module, index) => {
      const checklist = moduleChecklist(module, completedLessonIds, completedReadingIds, quizResults);
      const previous = index === 0 ? null : course.modules[index - 1];
      const previousDone =
        index === 0
          ? true
          : moduleChecklist(previous as CourseModule, completedLessonIds, completedReadingIds, quizResults).done;

      const lessonDoneCount = module.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
      const readingDoneCount = module.readings.filter((reading) => completedReadingIds.includes(reading.id)).length;
      const quizDoneCount = module.quizzes.filter((quiz) => {
        const result = quizResults.find((entry) => entry.quizId === quiz.id);
        return Boolean(result && result.score >= 60);
      }).length;

      return {
        module,
        index,
        checklist,
        unlocked: previousDone,
        lessonDoneCount,
        readingDoneCount,
        quizDoneCount,
      };
    });
  }, [completedLessonIds, completedReadingIds, course.modules, quizResults]);

  const allLessons = useMemo(() => course.modules.flatMap((module) => module.lessons), [course.modules]);
  const allReadings = useMemo(() => course.modules.flatMap((module) => module.readings), [course.modules]);
  const allQuizzes = useMemo(() => course.modules.flatMap((module) => module.quizzes), [course.modules]);

  if (!activeModule) {
    return null;
  }

  const currentModuleState = moduleStates.find((state) => state.module.id === activeModule.id);
  const currentModuleIndex = currentModuleState?.index ?? 0;
  const nextModuleState = moduleStates[currentModuleIndex + 1];

  const moduleLessons = activeModule.lessons;
  const activeLessonIndex = activeLesson ? moduleLessons.findIndex((lesson) => lesson.id === activeLesson.id) : -1;
  const previousLesson = activeLessonIndex > 0 ? moduleLessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex >= 0 && activeLessonIndex < moduleLessons.length - 1 ? moduleLessons[activeLessonIndex + 1] : null;

  const lessonCompleted = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;
  const canMoveNextLesson = Boolean(activeLesson && nextLesson && lessonCompleted);

  const completedCount = allLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const readingCount = allReadings.filter((reading) => completedReadingIds.includes(reading.id)).length;
  const passedQuizzes = quizResults.filter((result) => result.score >= 60).length;

  const overallProgress = Math.round((completedCount / Math.max(1, allLessons.length)) * 100);
  const activeChecklist = moduleChecklist(activeModule, completedLessonIds, completedReadingIds, quizResults);

  const toggleModuleOpen = (moduleId: string) => {
    setOpenModuleIds((previous) =>
      previous.includes(moduleId)
        ? previous.filter((entry) => entry !== moduleId)
        : [...previous, moduleId],
    );
  };

  const selectModule = (moduleId: string, unlocked: boolean) => {
    if (!unlocked) {
      setNotice("This module is locked. Complete the previous module first.");
      return;
    }

    const selected = course.modules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(selected?.lessons[0]?.id ?? "");
    setView("lecture");

    setOpenModuleIds((previous) =>
      previous.includes(moduleId) ? previous : [...previous, moduleId],
    );
  };

  const selectLesson = (moduleId: string, lessonId: string, unlocked: boolean) => {
    if (!unlocked) {
      setNotice("Module is locked. Complete previous requirements first.");
      return;
    }

    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setView("lecture");
  };

  const selectModuleView = (moduleId: string, unlocked: boolean, nextView: LearningView) => {
    if (!unlocked) {
      setNotice("Module is locked. Complete previous requirements first.");
      return;
    }

    const selected = course.modules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(selected?.lessons[0]?.id ?? "");
    setView(nextView);
  };

  const markLessonComplete = () => {
    if (!activeLesson) {
      setNotice("This module has no lesson videos yet. Continue with resources or assessment.");
      return;
    }

    setCompletedLessonIds((previous) =>
      previous.includes(activeLesson.id) ? previous : [...previous, activeLesson.id],
    );
    setNotice("Lesson completed. Continue to readings and quizzes.");
  };

  const markReadingComplete = (readingId: string) => {
    setCompletedReadingIds((previous) =>
      previous.includes(readingId) ? previous : [...previous, readingId],
    );
    setNotice("Reading completed.");
  };

  const submitQuiz = (moduleId: string, quizId: string, questions: QuizQuestion[]) => {
    const answers = quizAnswers[quizId] ?? {};

    if (Object.keys(answers).length < questions.length) {
      setNotice("Answer all quiz questions before submitting.");
      return;
    }

    const score = scoreQuiz(questions, answers);

    const result: StudentQuizResult = {
      courseId: course.id,
      moduleId,
      quizId,
      score: score.percentage,
      attemptedAt: new Date().toISOString(),
    };

    setQuizResults((previous) => {
      const next = [...previous.filter((entry) => entry.quizId !== quizId), result];
      const keys = getStorageKeys(course.id);
      window.localStorage.setItem(keys.quizResults, JSON.stringify(next));
      return next;
    });

    if (score.percentage >= 60) {
      setNotice(`Quiz passed with ${score.percentage}%.`);
    } else {
      setNotice(`Quiz score ${score.percentage}%. You need 60%+ to unlock the next module.`);
    }
  };

  const goNext = () => {
    if (activeLesson && nextLesson) {
      if (!lessonCompleted) {
        setNotice("Mark this lesson complete before moving to the next lesson.");
        return;
      }

      setActiveLessonId(nextLesson.id);
      return;
    }

    if (!activeChecklist.done) {
      setNotice("Finish lessons, readings, and quizzes in this module to continue.");
      return;
    }

    if (!nextModuleState) {
      setNotice("Course complete. Great job.");
      return;
    }

    setActiveModuleId(nextModuleState.module.id);
    setActiveLessonId(nextModuleState.module.lessons[0]?.id ?? "");
    setView("lecture");
    setOpenModuleIds((previous) =>
      previous.includes(nextModuleState.module.id)
        ? previous
        : [...previous, nextModuleState.module.id],
    );
    setNotice("Next module unlocked.");
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Course Progress</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{overallProgress}%</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Lessons Completed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{completedCount}/{allLessons.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Readings Completed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{readingCount}/{allReadings.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Quizzes Passed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{passedQuizzes}/{allQuizzes.length}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-slate-700">
        {notice}
      </section>

      <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Course Curriculum</h3>
            <p className="mt-1 text-xs text-slate-500">Follow modules in sequence, like a guided track.</p>

            <div className="mt-3 space-y-2">
              {moduleStates.map((state) => {
                const isOpen = openModuleIds.includes(state.module.id);
                const isActive = state.module.id === activeModule.id;

                return (
                  <div key={state.module.id} className="rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between gap-2 p-3">
                      <button
                        type="button"
                        onClick={() => selectModule(state.module.id, state.unlocked)}
                        className={`text-left text-sm font-semibold ${isActive ? "text-teal-700" : "text-slate-900"}`}
                      >
                        Module {state.index + 1}: {state.module.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleModuleOpen(state.module.id)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        {isOpen ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="px-3 pb-3 text-xs text-slate-600">
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${state.unlocked ? "bg-cyan-100 text-cyan-800" : "bg-slate-200 text-slate-600"}`}>
                        {state.unlocked ? "Unlocked" : "Locked"}
                      </span>
                      <span className="ml-2">{state.lessonDoneCount}/{state.module.lessons.length} lessons</span>
                    </div>

                    {isOpen ? (
                      <div className="border-t border-slate-100 px-2 py-2">
                        {state.module.lessons.map((lesson) => {
                          const done = completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => selectLesson(state.module.id, lesson.id, state.unlocked)}
                              className={`mb-1 w-full rounded-lg px-2 py-2 text-left text-xs transition ${
                                lesson.id === activeLesson?.id && view === "lecture"
                                  ? "bg-teal-50 text-teal-800"
                                  : "hover:bg-slate-50 text-slate-700"
                              } ${!state.unlocked ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{lesson.title}</span>
                                <span className={`text-[10px] font-semibold ${done ? "text-emerald-700" : "text-slate-500"}`}>
                                  {done ? "Done" : `${lesson.durationMinutes}m`}
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => selectModuleView(state.module.id, state.unlocked, "resources")}
                            className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${
                              isActive && view === "resources"
                                ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                                : "border-slate-300 text-slate-600"
                            }`}
                          >
                            Resources
                          </button>
                          <button
                            type="button"
                            onClick={() => selectModuleView(state.module.id, state.unlocked, "assessment")}
                            className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${
                              isActive && view === "assessment"
                                ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                                : "border-slate-300 text-slate-600"
                            }`}
                          >
                            Assessment
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900">Current Module Checklist</h4>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>Lessons: {activeChecklist.lessonDone ? "Done" : "Pending"}</li>
              <li>Readings: {activeChecklist.readingDone ? "Done" : "Pending"}</li>
              <li>Quizzes: {activeChecklist.quizDone ? "Done" : "Pending"}</li>
            </ul>
          </article>
        </aside>

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Now Learning</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {view === "lecture" ? activeLesson?.title ?? `${activeModule.title} Lecture` : activeModule.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {activeModule.title} • {view === "lecture" ? activeLesson ? `Lesson ${activeLessonIndex + 1}` : "No lesson yet" : view === "resources" ? "Resources" : "Assessment"}
            </p>
          </div>

          <div className="px-5 py-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView("lecture")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  view === "lecture" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Lecture
              </button>
              <button
                type="button"
                onClick={() => setView("resources")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  view === "resources" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Resources
              </button>
              <button
                type="button"
                onClick={() => setView("assessment")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  view === "assessment" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Assessment
              </button>
            </div>

            {view === "lecture" ? (
              <div className="space-y-4">
                {activeLesson ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="aspect-video w-full bg-slate-100">
                      <iframe
                        className="h-full w-full"
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-700">No video lesson in this module yet.</p>
                    <p className="mt-1 text-xs text-slate-500">Use resources or assessment tabs to continue learning.</p>
                  </div>
                )}

                <p className="text-sm text-slate-600">
                  {activeLesson?.summary ?? "Finish this lecture and mark complete to continue."}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={markLessonComplete}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      lessonCompleted ? "bg-emerald-100 text-emerald-700" : "bg-teal-900 text-white"
                    }`}
                  >
                    {lessonCompleted ? "Lesson Completed" : "Mark Lesson Complete"}
                  </button>
                  <button
                    type="button"
                    disabled={!previousLesson}
                    onClick={() => previousLesson && setActiveLessonId(previousLesson.id)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Previous Lesson
                  </button>
                  <button
                    type="button"
                    disabled={!canMoveNextLesson}
                    onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Next Lesson
                  </button>
                </div>
              </div>
            ) : null}

            {view === "resources" ? (
              <div className="space-y-3">
                {activeModule.readings.map((reading) => {
                  const done = completedReadingIds.includes(reading.id);
                  return (
                    <div key={reading.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{reading.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {reading.type.toUpperCase()} • {reading.estimatedMinutes} mins
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={reading.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            Open
                          </a>
                          <button
                            type="button"
                            onClick={() => markReadingComplete(reading.id)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              done ? "bg-emerald-100 text-emerald-700" : "bg-slate-900 text-white"
                            }`}
                          >
                            {done ? "Completed" : "Mark Read"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeModule.readings.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
                    No resources in this module yet.
                  </p>
                ) : null}
              </div>
            ) : null}

            {view === "assessment" ? (
              <div className="space-y-4">
                {activeModule.quizzes.map((quiz) => {
                  const currentAnswers = quizAnswers[quiz.id] ?? {};
                  const result = quizResults.find((entry) => entry.quizId === quiz.id);

                  return (
                    <div key={quiz.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
                        {result ? (
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${result.score >= 60 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {result.score}%
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 space-y-3">
                        {quiz.questions.map((question) => (
                          <div key={question.id} className="space-y-2 rounded-lg border border-slate-100 p-3">
                            <p className="text-sm font-semibold text-slate-800">{question.prompt}</p>
                            <div className="grid gap-1.5">
                              {question.options.map((option, optionIndex) => {
                                const selected = currentAnswers[question.id] === optionIndex;
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                      setQuizAnswers((previous) => ({
                                        ...previous,
                                        [quiz.id]: {
                                          ...(previous[quiz.id] ?? {}),
                                          [question.id]: optionIndex,
                                        },
                                      }))
                                    }
                                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                                      selected
                                        ? "border-cyan-300 bg-cyan-50 text-cyan-900"
                                        : "border-slate-200 text-slate-700 hover:border-cyan-200"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                            {result ? (
                              <p className="text-xs text-slate-500">
                                {question.explanation ?? "Review lecture concepts for this item."}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => submitQuiz(activeModule.id, quiz.id, quiz.questions)}
                        className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  );
                })}
                {activeModule.quizzes.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
                    No assessments in this module yet.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-teal-900 px-5 py-2 text-sm font-semibold text-white"
              >
                Continue Course
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
