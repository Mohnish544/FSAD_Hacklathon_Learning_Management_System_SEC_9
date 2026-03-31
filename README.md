# EduFlow LMS MVP

EduFlow is a full-stack learning management system MVP built with Next.js, TypeScript, Tailwind CSS, and a Supabase-ready data layer.

## Included Modules

- Separate login modules for student and admin roles
- Strict role-based routing using middleware + session role cookie
- Student dashboard with continue learning, announcements, leaderboard, and deadlines
- Module-based course player with videos, readings, quizzes, auto-save progress, and resume state
- Course catalog with search, level/track filters, and live stats
- Admin control center with analytics, operational notes, actions, module reordering, and enrollment management

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase client integration with local fallback data

## Run Locally

1. Install dependencies:

	npm install

2. Create environment variables:

	Copy .env.example to .env.local and set values:

	NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
	NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

	If these are not set, the app will run with built-in mock data.

3. Start the app:

	npm run dev

4. Open http://localhost:3000

## Supabase Schema

The starter SQL schema is available at:

- supabase/schema.sql

Apply it in your Supabase SQL editor, then replace mock calls with persisted writes for instructor forms and learner submissions.

## Important App Routes

- / : Role-aware redirect (student/admin/login)
- /login : Role selection
- /login/student : Student login module
- /login/admin : Admin login module
- /student : Student dashboard
- /catalog : Student catalog
- /learn/[courseId] : Module-based learning studio
- /assignments : Assignment tracking
- /admin : Admin dashboard + control center

## Next Suggested Enhancements

- Add Supabase Auth and role-aware routing
- Persist assignment submissions and quiz attempts
- Add instructor CRUD APIs and server actions
- Add charts for cohort-level analytics
