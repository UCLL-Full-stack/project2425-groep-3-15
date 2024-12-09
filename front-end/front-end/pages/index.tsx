import Head from "next/head";
import Header from "@/components/header";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta
          name="description"
          content="A tool to help teams plan, execute, and monitor their projects and tasks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center p-24 min-h-screen bg-gray-100 rounded-lg">
        <img
          src="/PMT.png"
          alt="Project Management Tool Logo"
          className="w-48 h-48 mb-8"
        />
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          {t("header.welcome")}
        </h1>
        <p className="text-center max-w-screen-md w-full mb-8 text-lg">
          {t("app.description")}
        </p>
      </main>
    </>
  );
}
