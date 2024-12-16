// pages/users/index.tsx
import React from "react";
import Head from "next/head";
import Header from "@/../components/common/header";
import Loading from "@/../components/common/Loading";
import AccessDenied from "@/../components/common/AccessDenied";
import UsersOverviewContent from "@/../components/users/UsersOverviewContent";
import useUsers from "@/../hooks/useUsers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const UserOverviewPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { users, loading, error, isAdmin } = useUsers(t);

  if (loading) {
    return <Loading message={t("loading")} />;
  }

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta name="description" content={t("app.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        {isAdmin ? (
          <UsersOverviewContent users={users} error={error} t={t} />
        ) : (
          <AccessDenied message={t("access.denied")} />
        )}
      </main>
    </>
  );
};

export default UserOverviewPage;
