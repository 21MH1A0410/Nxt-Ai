# NXT AI - Full Stack AI Career Coach

NXT AI is a Full Stack AI Career Coach application built with modern technologies like Next.js, Neon DB, Tailwind CSS, Prisma, Inngest, and Shadcn UI. It leverages AI (via Gemini API) to provide personalized career coaching and guidance.

## Features

- **User Authentication**: Powered by Clerk for secure sign-in, sign-up, and user management.
- **AI-Powered Coaching**: Integrated with Gemini API for AI-driven career advice.
- **Responsive UI**: Built with Tailwind CSS and Shadcn UI for a sleek and modern design.
- **Database**: Uses Neon DB as the database and Prisma as the ORM for seamless data management.
- **Background Jobs**: Handles asynchronous tasks using Inngest.

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: Neon DB (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI Integration**: Gemini API
- **Background Jobs**: Inngest

---

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A Neon DB database (free tier available)
- A Clerk account for authentication
- A Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nxt-ai.git
   cd nxt-ai
   ```

2. **Install dependencies**
   ```bash
   npm install  # or yarn install or pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   GEMINI_API_KEY=
   ```

### Running the Development Server

```bash
npm run dev  # or yarn dev or pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.


## Deployment

The easiest way to deploy your Next.js app is using [Vercel](https://vercel.com/new).

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Set up environment variables in Vercel.
4. Deploy your project.

More details: [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---

**NXT AI - Empowering Your Career with AI** 🚀

