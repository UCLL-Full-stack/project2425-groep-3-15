import Head from "next/head";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Project Management Tool</title>
        <meta name="description" content="A tool to help teams plan, execute, and monitor their projects and tasks." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center p-24 min-h-screen bg-gray-100 rounded-lg">
      <img src="/PMT.png" alt="Project Management Tool Logo" className="w-48 h-48 mb-8" />
        <h1 className="text-4xl font-bold mb-8">Welcome to Project Management Tool</h1>
        <p className="text-center max-w-screen-md w-full mb-8 text-lg">
          This project aims to build a Project Management Tool that helps teams plan, execute, and monitor their projects and tasks. 
          The system will enable users to create and manage projects, assign tasks and roles, form teams, and track progress in real time.
        </p>
        <div className="flex space-x-4">
          <Link href="/projects">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Get Started</button>
          </Link>
        </div>
      </main>
    </>
  );
}