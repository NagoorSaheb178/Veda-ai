# VedaAI — AI Teacher's Toolkit

VedaAI is a powerful Next.js application designed to streamline the grading process for educators. By leveraging Google's Gemini AI, VedaAI automates the extraction of questions, maps student answers, provides intelligent grading with feedback, and visually highlights answer regions directly on uploaded answer sheets.

## ✨ Features

- **Smart Question Extraction:** Automatically extracts questions from uploaded question papers.
- **Answer Mapping & Grading:** Maps student answers to corresponding questions and grades them instantly using Gemini AI.
- **AI Feedback:** Generates constructive, granular feedback for every student answer.
- **Interactive PDF Viewer:** Highlights exact answer regions directly on the uploaded student answer sheet for visual confirmation.
- **Beautiful UI/UX:** A pristine, responsive, and intuitive interface designed specifically for teachers (featuring a dynamically adjusting sidebar and mobile-friendly layouts).

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Custom CSS with modern UI principles (glassmorphism, gradients, and soft shadows)
- **AI Integration:** Google Gemini
- **PDF Rendering:** `pdfjs-dist` for client-side document viewing and annotation
- **Typography:** Inter & Bricolage Grotesque

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `/src/app`: Contains the main Next.js App Router files (`page.tsx`, `layout.tsx`, `/api/process`).
- `/src/components`: Contains the core UI components (`Sidebar.tsx`, `TopBar.tsx`, `UploadPage.tsx`, `ExtractingScreen.tsx`, `ResultsView.tsx`).
- `/public`: Static assets, icons, and fonts used throughout the application.

## 🌐 Deploy on Vercel

The easiest way to deploy your VedaAI app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
