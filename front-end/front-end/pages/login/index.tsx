import Head from "next/head";
import Header from "@/components/common/Header";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LoginPageContent from "@/components/login/LoginPageContent";

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
      <LoginPageContent />
    </>
  );
};

export default Login;
