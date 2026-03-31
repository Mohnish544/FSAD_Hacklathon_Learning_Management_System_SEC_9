import type {
  Assignment,
  Course,
  CourseModule,
  Enrollment,
  PlatformMetrics,
  QuizQuestion,
  UserProfile,
} from "@/lib/types";

const assignmentA: Assignment = {
  id: "a1",
  title: "Build a Learning Path API",
  description:
    "Design REST endpoints for course discovery, enrollment, and progress tracking.",
  dueDate: "2026-04-02",
  maxScore: 100,
  submitted: true,
  score: 92,
};

const assignmentB: Assignment = {
  id: "a2",
  title: "Assessment Engine",
  description:
    "Create question randomization and timed attempt handling for module quizzes.",
  dueDate: "2026-04-05",
  maxScore: 100,
  submitted: false,
};

export const users: UserProfile[] = [
  { id: "u1", name: "Aarav Mehta", role: "student", cohort: "FS-2026" },
  { id: "u2", name: "Nisha Reddy", role: "instructor", cohort: "Faculty" },
  { id: "u3", name: "Admin Team", role: "admin", cohort: "Ops" },
];

const baseCourses: Omit<Course, "modules">[] = [
  {
    id: "c1",
    title: "Full Stack Foundations",
    track: "Web Engineering",
    level: "Beginner",
    durationHours: 14,
    learners: 612,
    rating: 4.8,
    skills: ["TypeScript", "React", "API Design"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    instructor: "Nisha Reddy",
    description:
      "Master the fundamentals of modern web apps with TypeScript, React, and API architecture.",
    lessons: [
      {
        id: "l1",
        title: "TypeScript Core Concepts",
        durationMinutes: 28,
        videoUrl: "https://www.youtube.com/embed/30LWjhZzg50",
        completed: true,
      },
      {
        id: "l2",
        title: "App Router and Server Components",
        durationMinutes: 34,
        videoUrl: "https://www.youtube.com/embed/HI6m6l1QQdw",
        completed: false,
      },
      {
        id: "l3",
        title: "Data Flow Patterns",
        durationMinutes: 22,
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
      },
    ],
    assignments: [assignmentA, assignmentB],
    quiz: [
      {
        id: "q1",
        prompt: "Which approach best reduces duplicate API logic across pages?",
        options: [
          "Keeping all fetch calls inline in components",
          "A reusable repository/service layer",
          "Copying utility functions between routes",
          "Disabling type checks for speed",
        ],
        correctOption: 1,
      },
      {
        id: "q2",
        prompt: "What is the main advantage of server components for data-heavy pages?",
        options: [
          "They remove the need for any database",
          "They run only in the browser",
          "They can fetch data without shipping extra client JS",
          "They make CSS unnecessary",
        ],
        correctOption: 2,
      },
    ],
  },
  {
    id: "c2",
    title: "Productive Backend Design",
    track: "Platform Systems",
    level: "Intermediate",
    durationHours: 11,
    learners: 384,
    rating: 4.7,
    skills: ["PostgreSQL", "RBAC", "Observability"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    instructor: "Nisha Reddy",
    description:
      "Ship resilient backend services with schema design, auth, and production-ready observability.",
    lessons: [
      {
        id: "l4",
        title: "Schema Design for LMS",
        durationMinutes: 31,
        videoUrl: "https://www.youtube.com/embed/Vw1fCeD06YI",
        completed: true,
      },
      {
        id: "l5",
        title: "Auth and Role Policies",
        durationMinutes: 27,
        videoUrl: "https://www.youtube.com/embed/j4xw8QomkXs",
        completed: false,
      },
    ],
    assignments: [
      {
        id: "a3",
        title: "Role-based Access Matrix",
        description:
          "Define RBAC for students, instructors, and admins with protected actions.",
        dueDate: "2026-04-10",
        maxScore: 100,
        submitted: false,
      },
    ],
    quiz: [
      {
        id: "q3",
        prompt: "What should a policy check first for an update operation?",
        options: [
          "Client timezone",
          "Auth identity and role",
          "UI theme",
          "Image dimensions",
        ],
        correctOption: 1,
      },
    ],
  },
  {
    id: "c3",
    title: "Cloud Deployment Sprint",
    track: "DevOps",
    level: "Intermediate",
    durationHours: 9,
    learners: 266,
    rating: 4.6,
    skills: ["CI/CD", "Containers", "Release Safety"],
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    instructor: "Rahul Iyer",
    description:
      "Take your app from local to production with CI pipelines, container strategy, and release rollback plans.",
    lessons: [
      {
        id: "l6",
        title: "Pipeline Design Basics",
        durationMinutes: 25,
        videoUrl: "https://www.youtube.com/embed/1uFVr15xDGg",
        completed: false,
      },
      {
        id: "l7",
        title: "Container-first Deployments",
        durationMinutes: 33,
        videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE",
        completed: false,
      },
      {
        id: "l8",
        title: "Zero Downtime Releases",
        durationMinutes: 29,
        videoUrl: "https://www.youtube.com/embed/8Xo3m1zNf0Q",
        completed: false,
      },
    ],
    assignments: [
      {
        id: "a4",
        title: "Ship a Safe Deployment Pipeline",
        description:
          "Build a release checklist with lint, test, build, and rollback controls for a sample service.",
        dueDate: "2026-04-15",
        maxScore: 100,
        submitted: false,
      },
    ],
    quiz: [
      {
        id: "q4",
        prompt: "What protects users most during a bad production release?",
        options: [
          "Hiding errors in logs",
          "Automatic rollback strategy",
          "Skipping smoke tests",
          "Manual edits on live server",
        ],
        correctOption: 1,
      },
    ],
  },
  {
    id: "c4",
    title: "AI Features for Web Apps",
    track: "Product Engineering",
    level: "Advanced",
    durationHours: 12,
    learners: 198,
    rating: 4.9,
    skills: ["Prompt Design", "RAG Basics", "Evaluation"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    instructor: "Meera Joshi",
    description:
      "Design practical AI-powered product features using retrieval, guardrails, and measurable quality loops.",
    lessons: [
      {
        id: "l9",
        title: "Prompt Patterns That Scale",
        durationMinutes: 24,
        videoUrl: "https://www.youtube.com/embed/jA5IMk3xMy0",
        completed: false,
      },
      {
        id: "l10",
        title: "Context Retrieval Fundamentals",
        durationMinutes: 36,
        videoUrl: "https://www.youtube.com/embed/T-D1OfcDW1M",
        completed: false,
      },
    ],
    assignments: [
      {
        id: "a5",
        title: "Build a Help Assistant",
        description:
          "Create an assistant flow using your own docs and define latency and quality metrics.",
        dueDate: "2026-04-18",
        maxScore: 100,
        submitted: false,
      },
    ],
    quiz: [
      {
        id: "q5",
        prompt: "Why is evaluation critical in AI features?",
        options: [
          "To avoid writing prompts",
          "To measure quality and regressions",
          "To remove user feedback",
          "To increase model temperature",
        ],
        correctOption: 1,
      },
    ],
  },
  {
    id: "c5",
    title: "Design Systems in Practice",
    track: "Frontend",
    level: "Beginner",
    durationHours: 8,
    learners: 451,
    rating: 4.5,
    skills: ["Tokens", "Accessibility", "Component APIs"],
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    instructor: "Sana Kapoor",
    description:
      "Build a reusable design system from color tokens to components with accessibility built into every decision.",
    lessons: [
      {
        id: "l11",
        title: "Design Tokens and Naming",
        durationMinutes: 26,
        videoUrl: "https://www.youtube.com/embed/yYJ7GJw6wA8",
        completed: false,
      },
      {
        id: "l12",
        title: "Accessible Component Patterns",
        durationMinutes: 31,
        videoUrl: "https://www.youtube.com/embed/20SHvU2PKsM",
        completed: false,
      },
    ],
    assignments: [
      {
        id: "a6",
        title: "Tokenize a Dashboard UI",
        description:
          "Refactor a dashboard into semantic color and spacing tokens with documented variants.",
        dueDate: "2026-04-20",
        maxScore: 100,
        submitted: false,
      },
    ],
    quiz: [
      {
        id: "q6",
        prompt: "What is the key value of design tokens?",
        options: [
          "Hardcoding each color in every component",
          "Creating a consistent styling source of truth",
          "Avoiding any design reviews",
          "Using only one font size",
        ],
        correctOption: 1,
      },
    ],
  },
  {
    id: "c6",
    title: "Data Storytelling for Product Teams",
    track: "Analytics",
    level: "Intermediate",
    durationHours: 7,
    learners: 322,
    rating: 4.4,
    skills: ["Dashboards", "KPIs", "Narrative Insights"],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    instructor: "Ankit Sharma",
    description:
      "Turn raw metrics into clear product stories that influence roadmap and team decisions.",
    lessons: [
      {
        id: "l13",
        title: "Choosing Metrics That Matter",
        durationMinutes: 21,
        videoUrl: "https://www.youtube.com/embed/9H9f_nx3R6Q",
        completed: false,
      },
      {
        id: "l14",
        title: "Communicating Insight Clearly",
        durationMinutes: 24,
        videoUrl: "https://www.youtube.com/embed/2LhoCfjm8R4",
        completed: false,
      },
    ],
    assignments: [
      {
        id: "a7",
        title: "Weekly Product KPI Narrative",
        description:
          "Create a one-page narrative for leadership summarizing risk, wins, and experiment impact.",
        dueDate: "2026-04-22",
        maxScore: 100,
        submitted: false,
      },
    ],
    quiz: [
      {
        id: "q7",
        prompt: "What improves dashboard decision-making most?",
        options: [
          "More chart colors",
          "Linking metrics to business questions",
          "Adding every metric available",
          "Removing trend context",
        ],
        correctOption: 1,
      },
    ],
  },
];

function createSupplementalQuestions(course: Omit<Course, "modules">): QuizQuestion[] {
  return [
    {
      id: `${course.id}-sq-1`,
      type: "true-false",
      prompt: `True or False: ${course.title} expects hands-on implementation, not only theory.`,
      options: ["True", "False"],
      correctOption: 0,
      explanation:
        "Every track includes practical implementation tasks, module checkpoints, and graded deliverables.",
    },
    {
      id: `${course.id}-sq-2`,
      type: "mcq",
      prompt: `Which action will help you progress faster in ${course.track}?`,
      options: [
        "Skipping module quizzes",
        "Completing lessons and reviewing feedback",
        "Watching only previews",
        "Ignoring assignments",
      ],
      correctOption: 1,
      explanation:
        "High completion learners consistently combine lesson practice, reading, and quiz feedback loops.",
    },
    {
      id: `${course.id}-sq-3`,
      type: "mcq",
      prompt: `In ${course.title}, what is the best approach for long-term retention?`,
      options: [
        "Finish videos only",
        "Use spaced revision with module quizzes",
        "Skip reading resources",
        "Attempt assessments once and move on",
      ],
      correctOption: 1,
      explanation:
        "Spaced revision and repeated active recall improve retention and practical confidence.",
    },
    {
      id: `${course.id}-sq-4`,
      type: "true-false",
      prompt: "True or False: Reading materials are optional and do not affect quiz performance.",
      options: ["True", "False"],
      correctOption: 1,
      explanation:
        "Reading context improves concept depth and has strong impact on quiz performance quality.",
    },
  ];
}

function enrichLessons(course: Omit<Course, "modules">) {
  const videoPool = [
    "https://www.youtube.com/embed/30LWjhZzg50",
    "https://www.youtube.com/embed/HI6m6l1QQdw",
    "https://www.youtube.com/embed/4UZrsTqkcW4",
    "https://www.youtube.com/embed/Vw1fCeD06YI",
    "https://www.youtube.com/embed/j4xw8QomkXs",
    "https://www.youtube.com/embed/1uFVr15xDGg",
    "https://www.youtube.com/embed/3c-iBn73dDE",
    "https://www.youtube.com/embed/jA5IMk3xMy0",
    "https://www.youtube.com/embed/T-D1OfcDW1M",
    "https://www.youtube.com/embed/20SHvU2PKsM",
  ];

  const lessons = course.lessons.map((lesson, index) => ({
    ...lesson,
    summary:
      lesson.summary ??
      `Week ${index + 1} lesson in ${course.title} focused on practical ${course.track.toLowerCase()} skills.`,
  }));

  const templates = [
    "Hands-on Lab",
    "Guided Project Walkthrough",
    "Case Study Breakdown",
    "Peer Review Clinic",
    "Advanced Practice Session",
    "Capstone Milestone",
  ];

  while (lessons.length < 6) {
    const nextIndex = lessons.length + 1;
    const template = templates[(nextIndex - 1) % templates.length];

    lessons.push({
      id: `${course.id}-l${nextIndex}`,
      title: `${template} ${nextIndex - course.lessons.length}`,
      durationMinutes: 20 + (nextIndex % 4) * 6,
      videoUrl:
        videoPool[(nextIndex + course.id.charCodeAt(1)) % videoPool.length] ??
        "https://www.youtube.com/embed/HI6m6l1QQdw",
      completed: false,
      summary: `Practice-first lesson designed to reinforce module outcomes and checkpoint readiness.`,
    });
  }

  return lessons;
}

function getQuizSlice(quizPool: QuizQuestion[], start: number, size: number): QuizQuestion[] {
  const sliced = quizPool.slice(start, start + size);
  if (sliced.length === size) {
    return sliced;
  }

  const fallback = [...quizPool];
  while (sliced.length < size && fallback.length > 0) {
    sliced.push(fallback[sliced.length % fallback.length]);
  }

  return sliced;
}

function buildModules(course: Omit<Course, "modules">, quizPool: QuizQuestion[]): CourseModule[] {
  const chunkSize = Math.max(2, Math.ceil(course.lessons.length / 3));
  const chunks = [
    course.lessons.slice(0, chunkSize),
    course.lessons.slice(chunkSize, chunkSize * 2),
    course.lessons.slice(chunkSize * 2),
  ].filter((chunk) => chunk.length > 0);

  const moduleBlueprints = [
    {
      title: "Week 1-2: Foundations",
      overview: `Build core understanding for ${course.title} with guided concept drills and short checks.`,
      readings: [
        {
          title: `${course.track} Fundamentals Guide`,
          type: "guide" as const,
          url: "https://developer.mozilla.org/en-US/docs/Learn",
          estimatedMinutes: 12,
        },
        {
          title: "Lecture Companion Notes",
          type: "pdf" as const,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          estimatedMinutes: 10,
        },
        {
          title: "Intro Workflow Reading",
          type: "article" as const,
          url: "https://web.dev/learn/",
          estimatedMinutes: 8,
        },
      ],
    },
    {
      title: "Week 3-4: Guided Practice",
      overview: "Apply concepts in practical workflows, reinforce decisions, and solve realistic scenarios.",
      readings: [
        {
          title: "Implementation Playbook",
          type: "guide" as const,
          url: "https://web.dev/learn/",
          estimatedMinutes: 14,
        },
        {
          title: "Architecture Reference PDF",
          type: "pdf" as const,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          estimatedMinutes: 9,
        },
        {
          title: "Best Practices Digest",
          type: "article" as const,
          url: "https://developer.mozilla.org/en-US/docs/Learn",
          estimatedMinutes: 7,
        },
      ],
    },
    {
      title: "Week 5-6: Capstone and Review",
      overview: "Complete a capstone sequence with revision loops, mastery checks, and final readiness review.",
      readings: [
        {
          title: "Capstone Brief",
          type: "guide" as const,
          url: "https://web.dev/learn/",
          estimatedMinutes: 11,
        },
        {
          title: "Final Review Packet",
          type: "pdf" as const,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          estimatedMinutes: 12,
        },
        {
          title: "Career Application Notes",
          type: "article" as const,
          url: "https://developer.mozilla.org/en-US/docs/Learn",
          estimatedMinutes: 8,
        },
      ],
    },
  ];

  return chunks.map((chunk, index) => {
    const blueprint = moduleBlueprints[index] ?? moduleBlueprints[moduleBlueprints.length - 1];
    const start = (index * 2) % Math.max(1, quizPool.length);
    const checkpointQuestions = getQuizSlice(quizPool, start, 3);
    const reviewQuestions = getQuizSlice(quizPool, start + 1, 2);

    return {
      id: `${course.id}-m${index + 1}`,
      title: blueprint.title,
      overview: blueprint.overview,
      lessons: chunk,
      readings: blueprint.readings.map((reading, readingIndex) => ({
        id: `${course.id}-m${index + 1}-r${readingIndex + 1}`,
        ...reading,
      })),
      quizzes: [
        {
          id: `${course.id}-m${index + 1}-q1`,
          title: "Checkpoint Quiz",
          questions: checkpointQuestions,
        },
        {
          id: `${course.id}-m${index + 1}-q2`,
          title: "Quick Review Quiz",
          questions: reviewQuestions,
        },
      ],
    };
  });
}

export const courses: Course[] = baseCourses.map((course) => {
  const lessons = enrichLessons(course);
  const lessonReadyCourse = { ...course, lessons };
  const quizPool = [...course.quiz, ...createSupplementalQuestions(lessonReadyCourse)];

  return {
    ...lessonReadyCourse,
    quiz: quizPool,
    modules: buildModules(lessonReadyCourse, quizPool),
  };
});

export const enrollments: Enrollment[] = [
  { userId: "u1", courseId: "c1", progress: 48, streakDays: 7 },
  { userId: "u1", courseId: "c2", progress: 22, streakDays: 7 },
  { userId: "u1", courseId: "c4", progress: 14, streakDays: 7 },
];

export const platformMetrics: PlatformMetrics = {
  activeLearners: 1248,
  completionRate: 68,
  averageQuizScore: 81,
  assignmentSubmissionRate: 74,
};

export function getCourseById(courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}
