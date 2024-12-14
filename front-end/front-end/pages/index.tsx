import Head from "next/head";
import Header from "@/components/common/header";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation("common");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the user role from sessionStorage
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta
          name="description"
          content="A tool to help teams plan, execute, and monitor their projects and tasks in real-time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        {/* Logo */}
        <img
          src="/PMT.png"
          alt="Project Management Tool Logo"
          className="w-40 h-40 mb-6"
        />

        {/* Welcome Text */}
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4 text-center">
          {t("app.title")}
        </h1>
        <p className="text-center text-gray-700 text-lg max-w-xl mb-8">
          {t("app.description")}
        </p>

        {/* Call to Action */}
        <div className="flex space-x-4">
          {/* 'Get Started' Button: Visible to all users */}
          <Link
            href="/projects"
            className="px-6 py-3 text-white bg-blue-600 rounded-md shadow-md text-lg font-medium hover:bg-blue-700"
          >
            {t("app.cta.getStarted")}
          </Link>

          {/* 'View Users' Button: Only visible to Admin */}
          {userRole === "ADMIN" && (
            <Link
              href="/users"
              className="px-6 py-3 text-blue-600 bg-white rounded-md shadow-md border border-blue-600 text-lg font-medium hover:bg-blue-50"
            >
              {t("app.cta.viewUsers")}
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
