"use client";

import { useMemo, useState } from "react";
import { RealtimeRegistrations } from "./realtime-registrations";
import type {
  Course,
  CourseModule,
  Enrollment,
  PlatformMetrics,
  QuizQuestion,
  QuizQuestionType,
  UserProfile,
} from "@/lib/types";

interface AdminControlCenterProps {
  metrics: PlatformMetrics;
  courses: Course[];
  users: UserProfile[];
  enrollments: Enrollment[];
}

type AdminTab = "analytics" | "builder" | "users";

interface NewCourseForm {
  title: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
  description: string;
}

const blankCourse: NewCourseForm = {
  title: "",
  track: "",
  level: "Beginner",
  instructor: "",
  description: "",
};

const tabClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    active
      ? "bg-slate-900 text-white"
      : "bg-white text-slate-700 hover:bg-slate-100"
  }`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminControlCenter({
  metrics,
  courses,
  users,
  enrollments,
}: AdminControlCenterProps) {
  const [tab, setTab] = useState<AdminTab>("analytics");
  const [actionMessage, setActionMessage] = useState("Ready: admin workspace active.");

  const [courseState, setCourseState] = useState(courses);
  const [enrollmentState, setEnrollmentState] = useState(enrollments);

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState(courses[0]?.modules[0]?.id ?? "");

  const [newCourse, setNewCourse] = useState<NewCourseForm>(blankCourse);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleOverview, setNewModuleOverview] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("https://www.youtube.com/embed/HI6m6l1QQdw");
  const [lessonMinutes, setLessonMinutes] = useState(20);
  const [lessonSummary, setLessonSummary] = useState("Admin added lesson.");

  const [readingTitle, setReadingTitle] = useState("");
  const [readingUrl, setReadingUrl] = useState("https://web.dev/learn/");
  const [readingMinutes, setReadingMinutes] = useState(10);
  const [readingType, setReadingType] = useState<"article" | "pdf" | "guide">("article");

  const [quizPrompt, setQuizPrompt] = useState("");
  const [quizType, setQuizType] = useState<QuizQuestionType>("mcq");

  const selectedCourse = useMemo(
    () => courseState.find((course) => course.id === selectedCourseId) ?? courseState[0],
    [courseState, selectedCourseId],
  );

  const selectedModule = useMemo(() => {
    if (!selectedCourse) {
      return undefined;
    }

    return (
      selectedCourse.modules.find((module) => module.id === selectedModuleId) ??
      selectedCourse.modules[0]
    );
  }, [selectedCourse, selectedModuleId]);

  const progressByUser = useMemo(() => {
    return users.map((user) => {
      const rows = enrollmentState.filter((entry) => entry.userId === user.id);
      const average = Math.round(
        rows.reduce((sum, row) => sum + row.progress, 0) / Math.max(1, rows.length),
      );

      return { user, activeCourses: rows.length, averageProgress: average };
    });
  }, [enrollmentState, users]);

  const setAction = (message: string) => {
    setActionMessage(message);
  };

  const hasSelectedCourse = Boolean(selectedCourse);
  const hasSelectedModule = Boolean(selectedModule);
  const canAddCourse =
    newCourse.title.trim().length > 0 &&
    newCourse.track.trim().length > 0 &&
    newCourse.instructor.trim().length > 0;
  const canAddModule = hasSelectedCourse && newModuleTitle.trim().length > 0;
  const canAddLesson = hasSelectedCourse && hasSelectedModule && lessonTitle.trim().length > 0;
  const canAddReading = hasSelectedCourse && hasSelectedModule && readingTitle.trim().length > 0;
  const canAddQuizQuestion = hasSelectedCourse && hasSelectedModule && quizPrompt.trim().length > 0;

  const updateSelectedCourse = (
    field: "title" | "track" | "level" | "instructor" | "description",
    value: string,
  ) => {
    if (!selectedCourse) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) =>
        course.id === selectedCourse.id ? { ...course, [field]: value } : course,
      ),
    );
  };

  const addCourse = () => {
    if (!newCourse.title.trim() || !newCourse.track.trim() || !newCourse.instructor.trim()) {
      setAction("Add Course failed: title, track, and instructor are required.");
      return;
    }

    const idBase = slugify(newCourse.title);
    const id = `c-${idBase || "new"}-${courseState.length + 1}`;

    const moduleId = `${id}-m1`;
    const created: Course = {
      id,
      title: newCourse.title.trim(),
      track: newCourse.track.trim(),
      level: newCourse.level,
      instructor: newCourse.instructor.trim(),
      description: newCourse.description.trim() || "Newly created course draft.",
      thumbnail:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      durationHours: 6,
      learners: 0,
      rating: 4.5,
      skills: ["Foundations", "Practice", "Assessment"],
      featured: false,
      lessons: [
        {
          id: `${id}-l1`,
          title: "Welcome and Orientation",
          durationMinutes: 16,
          videoUrl: "https://www.youtube.com/embed/HI6m6l1QQdw",
          completed: false,
          summary: "Course orientation and outcomes.",
        },
      ],
      assignments: [],
      quiz: [
        {
          id: `${id}-q1`,
          type: "mcq",
          prompt: "What is the first step in this course?",
          options: ["Start module 1", "Skip to final test", "Only read docs", "Wait for reminder"],
          correctOption: 0,
          explanation: "Start with module 1 to establish foundations.",
        },
      ],
      modules: [
        {
          id: moduleId,
          title: "Week 1: Foundations",
          overview: "Initial module for videos, readings, and quizzes.",
          lessons: [
            {
              id: `${id}-m1-l1`,
              title: "Foundation Lecture",
              durationMinutes: 20,
              videoUrl: "https://www.youtube.com/embed/30LWjhZzg50",
              completed: false,
              summary: "Core concepts and learning goals.",
            },
          ],
          readings: [
            {
              id: `${id}-m1-r1`,
              title: "Foundations Guide",
              type: "guide",
              url: "https://web.dev/learn/",
              estimatedMinutes: 10,
            },
          ],
          quizzes: [
            {
              id: `${id}-m1-q1`,
              title: "Week 1 Checkpoint",
              questions: [
                {
                  id: `${id}-m1-q1-i1`,
                  type: "true-false",
                  prompt: "True or False: completing all activities unlocks the next module.",
                  options: ["True", "False"],
                  correctOption: 0,
                  explanation: "Module progression is gated by completion.",
                },
              ],
            },
          ],
        },
      ],
    };

    setCourseState((previous) => [...previous, created]);
    setSelectedCourseId(created.id);
    setSelectedModuleId(moduleId);
    setNewCourse(blankCourse);
    setAction(`Course added: ${created.title}`);
  };

  const addModule = () => {
    if (!selectedCourse) {
      setAction("Select a course first before adding a module.");
      return;
    }

    if (!newModuleTitle.trim()) {
      setAction("Module title is required.");
      return;
    }

    const nextIndex = selectedCourse.modules.length + 1;
    const id = `${selectedCourse.id}-m${nextIndex}`;

    const newModule: CourseModule = {
      id,
      title: newModuleTitle.trim(),
      overview: newModuleOverview.trim() || "Module draft overview.",
      lessons: [],
      readings: [],
      quizzes: [],
    };

    setCourseState((previous) =>
      previous.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, modules: [...course.modules, newModule] }
          : course,
      ),
    );

    setSelectedModuleId(id);
    setNewModuleTitle("");
    setNewModuleOverview("");
    setAction(`Module added in ${selectedCourse.title}: ${newModule.title}`);
  };

  const reorderModule = (index: number, direction: -1 | 1) => {
    if (!selectedCourse) {
      setAction("Select a course first before reordering modules.");
      return;
    }

    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedCourse.modules.length) {
      setAction("This module cannot move further in that direction.");
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        const modules = [...course.modules];
        const temp = modules[index];
        modules[index] = modules[nextIndex];
        modules[nextIndex] = temp;
        return { ...course, modules };
      }),
    );

    setAction("Module order updated.");
  };

  const updateSelectedModule = (field: "title" | "overview", value: string) => {
    if (!selectedCourse || !selectedModule) {
      setAction("Select a module to edit.");
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) =>
            module.id === selectedModule.id ? { ...module, [field]: value } : module,
          ),
        };
      }),
    );
  };

  const deleteModule = (moduleId: string) => {
    if (!selectedCourse || selectedCourse.modules.length <= 1) {
      setAction("At least one module must remain in the course.");
      return;
    }

    const remainingModules = selectedCourse.modules.filter((module) => module.id !== moduleId);
    if (remainingModules.length === selectedCourse.modules.length) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, modules: course.modules.filter((module) => module.id !== moduleId) }
          : course,
      ),
    );

    setSelectedModuleId(remainingModules[0]?.id ?? "");
    setAction("Module removed.");
  };

  const updateLesson = (
    lessonId: string,
    field: "title" | "videoUrl" | "durationMinutes" | "summary",
    value: string | number,
  ) => {
    if (!selectedCourse || !selectedModule) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== selectedModule.id) {
              return module;
            }

            return {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson,
              ),
            };
          }),
        };
      }),
    );
  };

  const deleteLesson = (lessonId: string) => {
    if (!selectedCourse || !selectedModule) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) =>
            module.id === selectedModule.id
              ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
              : module,
          ),
        };
      }),
    );

    setAction("Lesson removed.");
  };

  const updateReading = (
    readingId: string,
    field: "title" | "url" | "estimatedMinutes" | "type",
    value: string | number,
  ) => {
    if (!selectedCourse || !selectedModule) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== selectedModule.id) {
              return module;
            }

            return {
              ...module,
              readings: module.readings.map((reading) =>
                reading.id === readingId ? { ...reading, [field]: value } : reading,
              ),
            };
          }),
        };
      }),
    );
  };

  const deleteReading = (readingId: string) => {
    if (!selectedCourse || !selectedModule) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) =>
            module.id === selectedModule.id
              ? { ...module, readings: module.readings.filter((reading) => reading.id !== readingId) }
              : module,
          ),
        };
      }),
    );

    setAction("Reading removed.");
  };

  const updatePrimaryQuiz = (field: "title", value: string) => {
    if (!selectedCourse || !selectedModule || selectedModule.quizzes.length === 0) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== selectedModule.id) {
              return module;
            }

            return {
              ...module,
              quizzes: module.quizzes.map((quiz, index) =>
                index === 0 ? { ...quiz, [field]: value } : quiz,
              ),
            };
          }),
        };
      }),
    );
  };

  const updateQuizQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    if (!selectedCourse || !selectedModule || selectedModule.quizzes.length === 0) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== selectedModule.id) {
              return module;
            }

            return {
              ...module,
              quizzes: module.quizzes.map((quiz, index) => {
                if (index !== 0) {
                  return quiz;
                }

                return {
                  ...quiz,
                  questions: quiz.questions.map((question) =>
                    question.id === questionId ? { ...question, ...updates } : question,
                  ),
                };
              }),
            };
          }),
        };
      }),
    );
  };

  const updateQuizOption = (questionId: string, optionIndex: number, value: string) => {
    if (!selectedModule || selectedModule.quizzes.length === 0) {
      return;
    }

    const question = selectedModule.quizzes[0].questions.find((entry) => entry.id === questionId);
    if (!question) {
      return;
    }

    const options = [...question.options];
    options[optionIndex] = value;
    updateQuizQuestion(questionId, { options });
  };

  const updateQuizType = (questionId: string, type: QuizQuestionType) => {
    if (type === "true-false") {
      updateQuizQuestion(questionId, {
        type,
        options: ["True", "False"],
        correctOption: 0,
      });
      return;
    }

    updateQuizQuestion(questionId, {
      type,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOption: 0,
    });
  };

  const deleteQuizQuestion = (questionId: string) => {
    if (!selectedCourse || !selectedModule || selectedModule.quizzes.length === 0) {
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== selectedModule.id) {
              return module;
            }

            return {
              ...module,
              quizzes: module.quizzes.map((quiz, index) =>
                index === 0
                  ? { ...quiz, questions: quiz.questions.filter((question) => question.id !== questionId) }
                  : quiz,
              ),
            };
          }),
        };
      }),
    );

    setAction("Quiz question removed.");
  };

  const addLesson = () => {
    if (!selectedCourse || !selectedModule) {
      setAction("Select a course and module first before adding a lesson.");
      return;
    }

    if (!lessonTitle.trim()) {
      setAction("Lesson title is required.");
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        const modules = course.modules.map((module) => {
          if (module.id !== selectedModule.id) {
            return module;
          }

          const next = module.lessons.length + 1;
          return {
            ...module,
            lessons: [
              ...module.lessons,
              {
                id: `${module.id}-l${next}`,
                title: lessonTitle.trim(),
                durationMinutes: lessonMinutes,
                videoUrl: lessonVideoUrl,
                completed: false,
                summary: lessonSummary.trim() || "Admin added lesson.",
              },
            ],
          };
        });

        return { ...course, modules };
      }),
    );

    setLessonTitle("");
    setLessonSummary("Admin added lesson.");
    setAction("Lesson and video added to module.");
  };

  const addReading = () => {
    if (!selectedCourse || !selectedModule) {
      setAction("Select a course and module first before adding a reading.");
      return;
    }

    if (!readingTitle.trim()) {
      setAction("Reading title is required.");
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        const modules = course.modules.map((module) => {
          if (module.id !== selectedModule.id) {
            return module;
          }

          const next = module.readings.length + 1;
          return {
            ...module,
            readings: [
              ...module.readings,
              {
                id: `${module.id}-r${next}`,
                title: readingTitle.trim(),
                type: readingType,
                url: readingUrl,
                estimatedMinutes: readingMinutes,
              },
            ],
          };
        });

        return { ...course, modules };
      }),
    );

    setReadingTitle("");
    setReadingMinutes(10);
    setReadingType("article");
    setAction("Reading material added to module.");
  };

  const addQuizQuestion = () => {
    if (!selectedCourse || !selectedModule) {
      setAction("Select a course and module first before adding a quiz question.");
      return;
    }

    if (!quizPrompt.trim()) {
      setAction("Question prompt is required.");
      return;
    }

    setCourseState((previous) =>
      previous.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        const modules = course.modules.map((module) => {
          if (module.id !== selectedModule.id) {
            return module;
          }

          const currentQuiz = module.quizzes[0] ?? {
            id: `${module.id}-q1`,
            title: "Module Quiz",
            questions: [],
          };

          const nextQuestionIndex = currentQuiz.questions.length + 1;
          const question = {
            id: `${currentQuiz.id}-i${nextQuestionIndex}`,
            type: quizType,
            prompt: quizPrompt.trim(),
            options:
              quizType === "true-false"
                ? ["True", "False"]
                : ["Option A", "Option B", "Option C", "Option D"],
            correctOption: 0,
            explanation: "Update explanation with the exact concept rationale.",
          };

          const updatedQuiz = {
            ...currentQuiz,
            questions: [...currentQuiz.questions, question],
          };

          return {
            ...module,
            quizzes: module.quizzes.length === 0 ? [updatedQuiz] : [updatedQuiz, ...module.quizzes.slice(1)],
          };
        });

        return { ...course, modules };
      }),
    );

    setQuizPrompt("");
    setAction("Quiz question added.");
  };

  const toggleEnrollment = (userId: string, courseId: string) => {
    const exists = enrollmentState.some(
      (entry) => entry.userId === userId && entry.courseId === courseId,
    );

    if (exists) {
      setEnrollmentState((previous) =>
        previous.filter((entry) => !(entry.userId === userId && entry.courseId === courseId)),
      );
      setAction(`Enrollment removed for ${userId} in ${courseId}.`);
      return;
    }

    setEnrollmentState((previous) => [
      ...previous,
      { userId, courseId, progress: 0, streakDays: 0 },
    ]);
    setAction(`Enrollment assigned for ${userId} in ${courseId}.`);
  };

  const quickAction = (message: string) => {
    setAction(message);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTab("analytics")} className={tabClass(tab === "analytics")}>
            Analytics
          </button>
          <button type="button" onClick={() => setTab("builder")} className={tabClass(tab === "builder")}>
            Course Builder
          </button>
          <button type="button" onClick={() => setTab("users")} className={tabClass(tab === "users")}>
            User Control
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-medium text-cyan-900">
        {actionMessage}
      </div>

      {tab === "analytics" ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Active Learners</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{metrics.activeLearners}</h2>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completion Rate</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{metrics.completionRate}%</h2>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Avg Quiz Score</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{metrics.averageQuizScore}%</h2>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Submission Rate</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{metrics.assignmentSubmissionRate}%</h2>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <RealtimeRegistrations />
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Operational Notes</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>1. Completion rates dip when modules exceed 35 minutes.</li>
                <li>2. Assignment submission improves with mid-week reminders.</li>
                <li>3. Quiz outcomes rise when feedback is shown instantly.</li>
              </ul>
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Actions</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                onClick={() => quickAction("Weekly analytics export queued.")}
              >
                Export weekly analytics
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                onClick={() => quickAction("Learner engagement campaign triggered.")}
              >
                Trigger learner engagement campaign
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                onClick={() => quickAction("Risk cohort report opened for review.")}
              >
                Review risk cohort report
              </button>
            </div>
          </section>
        </>
      ) : null}

      {tab === "builder" ? (
        <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
          <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Create Course</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Add New Course</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={newCourse.title}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Course title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={newCourse.track}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, track: event.target.value }))}
                placeholder="Track"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <select
                value={newCourse.level}
                onChange={(event) =>
                  setNewCourse((prev) => ({
                    ...prev,
                    level: event.target.value as "Beginner" | "Intermediate" | "Advanced",
                  }))
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input
                value={newCourse.instructor}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, instructor: event.target.value }))}
                placeholder="Instructor"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                value={newCourse.description}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Course description"
                className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <button
              type="button"
              onClick={addCourse}
              disabled={!canAddCourse}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Course
            </button>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Edit Existing Course</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <select
                  value={selectedCourse?.id ?? ""}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => {
                    setSelectedCourseId(event.target.value);
                    const nextCourse = courseState.find((course) => course.id === event.target.value);
                    setSelectedModuleId(nextCourse?.modules[0]?.id ?? "");
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {courseState.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <input
                  value={selectedCourse?.title ?? ""}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => updateSelectedCourse("title", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Course title"
                />
                <input
                  value={selectedCourse?.track ?? ""}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => updateSelectedCourse("track", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Track"
                />
                <select
                  value={selectedCourse?.level ?? "Beginner"}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => updateSelectedCourse("level", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <input
                  value={selectedCourse?.instructor ?? ""}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => updateSelectedCourse("instructor", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Instructor"
                />
                <textarea
                  value={selectedCourse?.description ?? ""}
                  disabled={!hasSelectedCourse}
                  onChange={(event) => updateSelectedCourse("description", event.target.value)}
                  className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                  rows={3}
                />
              </div>
            </div>
          </article>

          <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Module Builder</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Build Course Content</h3>
            </div>

            <div className="space-y-2">
              {(selectedCourse?.modules ?? []).map((module, index) => (
                <div key={module.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModuleId(module.id)}
                      className={`text-left text-sm font-semibold ${
                        selectedModule?.id === module.id ? "text-teal-700" : "text-slate-800"
                      }`}
                    >
                      {module.title}
                    </button>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => reorderModule(index, -1)} className="rounded border border-slate-300 px-2 py-1 text-xs">Up</button>
                      <button type="button" onClick={() => reorderModule(index, 1)} className="rounded border border-slate-300 px-2 py-1 text-xs">Down</button>
                      <button type="button" onClick={() => deleteModule(module.id)} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {module.lessons.length} lessons • {module.readings.length} readings • {module.quizzes.length} quizzes
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Edit Selected Module</p>
              <input
                value={selectedModule?.title ?? ""}
                disabled={!hasSelectedModule}
                onChange={(event) => updateSelectedModule("title", event.target.value)}
                placeholder="Module title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              <textarea
                value={selectedModule?.overview ?? ""}
                disabled={!hasSelectedModule}
                onChange={(event) => updateSelectedModule("overview", event.target.value)}
                placeholder="Module overview"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <input
                value={newModuleTitle}
                onChange={(event) => setNewModuleTitle(event.target.value)}
                placeholder="New module title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                value={newModuleOverview}
                onChange={(event) => setNewModuleOverview(event.target.value)}
                placeholder="New module overview"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                rows={2}
              />
              <button
                type="button"
                onClick={addModule}
                disabled={!canAddModule}
                className="rounded-xl bg-teal-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Module
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Add Lesson Video</p>
              <input
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                placeholder="Lesson title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={lessonVideoUrl}
                onChange={(event) => setLessonVideoUrl(event.target.value)}
                placeholder="YouTube embed URL"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={5}
                value={lessonMinutes}
                onChange={(event) => setLessonMinutes(Number(event.target.value) || 20)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                value={lessonSummary}
                onChange={(event) => setLessonSummary(event.target.value)}
                placeholder="Lesson summary"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                rows={2}
              />
              <button
                type="button"
                onClick={addLesson}
                disabled={!canAddLesson}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Lesson
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Add Reading</p>
              <input
                value={readingTitle}
                onChange={(event) => setReadingTitle(event.target.value)}
                placeholder="Reading title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={readingUrl}
                onChange={(event) => setReadingUrl(event.target.value)}
                placeholder="Reading URL"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  value={readingMinutes}
                  onChange={(event) => setReadingMinutes(Number(event.target.value) || 10)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <select
                  value={readingType}
                  onChange={(event) => setReadingType(event.target.value as "article" | "pdf" | "guide")}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="article">Article</option>
                  <option value="pdf">PDF</option>
                  <option value="guide">Guide</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addReading}
                disabled={!canAddReading}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Reading
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Add Quiz Question</p>
              <select
                value={quizType}
                onChange={(event) => setQuizType(event.target.value as QuizQuestionType)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="mcq">MCQ</option>
                <option value="true-false">True / False</option>
              </select>
              <input
                value={quizPrompt}
                onChange={(event) => setQuizPrompt(event.target.value)}
                placeholder="Question prompt"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addQuizQuestion}
                disabled={!canAddQuizQuestion}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Question
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Edit Module Content</p>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">Lessons</p>
                {(selectedModule?.lessons ?? []).map((lesson) => (
                  <div key={lesson.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
                    <input
                      value={lesson.title}
                      onChange={(event) => updateLesson(lesson.id, "title", event.target.value)}
                      placeholder="Lesson title"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                    />
                    <input
                      value={lesson.videoUrl}
                      onChange={(event) => updateLesson(lesson.id, "videoUrl", event.target.value)}
                      placeholder="Video URL"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={1}
                        value={lesson.durationMinutes}
                        onChange={(event) => updateLesson(lesson.id, "durationMinutes", Number(event.target.value) || 1)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => deleteLesson(lesson.id)}
                        className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700"
                      >
                        Delete Lesson
                      </button>
                    </div>
                    <textarea
                      value={lesson.summary ?? ""}
                      onChange={(event) => updateLesson(lesson.id, "summary", event.target.value)}
                      placeholder="Lesson summary"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      rows={2}
                    />
                  </div>
                ))}
                {selectedModule?.lessons.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">No lessons yet.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">Readings</p>
                {(selectedModule?.readings ?? []).map((reading) => (
                  <div key={reading.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
                    <input
                      value={reading.title}
                      onChange={(event) => updateReading(reading.id, "title", event.target.value)}
                      placeholder="Reading title"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                    />
                    <input
                      value={reading.url}
                      onChange={(event) => updateReading(reading.id, "url", event.target.value)}
                      placeholder="Reading URL"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min={1}
                        value={reading.estimatedMinutes}
                        onChange={(event) => updateReading(reading.id, "estimatedMinutes", Number(event.target.value) || 1)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      />
                      <select
                        value={reading.type}
                        onChange={(event) => updateReading(reading.id, "type", event.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      >
                        <option value="article">Article</option>
                        <option value="pdf">PDF</option>
                        <option value="guide">Guide</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteReading(reading.id)}
                        className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {selectedModule?.readings.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">No readings yet.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">Quiz</p>
                {selectedModule?.quizzes[0] ? (
                  <div className="space-y-2">
                    <input
                      value={selectedModule.quizzes[0].title}
                      onChange={(event) => updatePrimaryQuiz("title", event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      placeholder="Quiz title"
                    />

                    {selectedModule.quizzes[0].questions.map((question) => (
                      <div key={question.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={question.type ?? "mcq"}
                            onChange={(event) => updateQuizType(question.id, event.target.value as QuizQuestionType)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                          >
                            <option value="mcq">MCQ</option>
                            <option value="true-false">True / False</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteQuizQuestion(question.id)}
                            className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700"
                          >
                            Delete Question
                          </button>
                        </div>
                        <textarea
                          value={question.prompt}
                          onChange={(event) => updateQuizQuestion(question.id, { prompt: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                          placeholder="Question prompt"
                          rows={2}
                        />
                        <div className="grid gap-2">
                          {question.options.map((option, optionIndex) => (
                            <input
                              key={`${question.id}-opt-${optionIndex}`}
                              value={option}
                              onChange={(event) => updateQuizOption(question.id, optionIndex, event.target.value)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={question.correctOption}
                            onChange={(event) =>
                              updateQuizQuestion(question.id, { correctOption: Number(event.target.value) || 0 })
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                          >
                            {question.options.map((_, optionIndex) => (
                              <option key={`${question.id}-correct-${optionIndex}`} value={optionIndex}>
                                Correct: Option {optionIndex + 1}
                              </option>
                            ))}
                          </select>
                          <input
                            value={question.explanation ?? ""}
                            onChange={(event) => updateQuizQuestion(question.id, { explanation: event.target.value })}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                            placeholder="Explanation"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">Add a quiz question to initialize quiz editing.</p>
                )}
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {tab === "users" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">User Control and Enrollment</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Active Courses</th>
                  <th className="px-2 py-2">Avg Progress</th>
                  <th className="px-2 py-2">Assign/Remove</th>
                </tr>
              </thead>
              <tbody>
                {progressByUser.map((row) => (
                  <tr key={row.user.id} className="border-b border-slate-100">
                    <td className="px-2 py-3 font-medium text-slate-800">{row.user.name}</td>
                    <td className="px-2 py-3 text-slate-600">{row.user.role}</td>
                    <td className="px-2 py-3 text-slate-700">{row.activeCourses}</td>
                    <td className="px-2 py-3 text-slate-700">{row.averageProgress}%</td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        {courseState.slice(0, 5).map((course) => {
                          const assigned = enrollmentState.some(
                            (entry) =>
                              entry.userId === row.user.id && entry.courseId === course.id,
                          );

                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => toggleEnrollment(row.user.id, course.id)}
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                assigned
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {assigned ? `Remove ${course.id}` : `Assign ${course.id}`}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
