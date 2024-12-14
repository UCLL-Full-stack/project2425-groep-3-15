import Head from "next/head";
import Header from "../../components/common/header";
import React from "react";
import UserLoginForm from "@/components/users/UserLoginForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Login: React.FC = () => {
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
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          {t("login.title")}
        </h1>
        <UserLoginForm />
      </main>
    </>
  );
};

export default Login;
