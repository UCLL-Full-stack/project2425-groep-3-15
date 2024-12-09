import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import OverviewUsers from "@/components/users/OverviewUsers";
import UserService from "@/services/UserService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const UserOverviewPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || t("error.fetchUsers"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta
          name="description"
          content={t("app.description")}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          {t("users.title")}
        </h1>
        {loading ? (
          <p className="text-blue-700">{t("loading")}</p>
        ) : (
          <section className="w-full max-w-3xl bg-white shadow-md rounded-md p-6 mx-auto">
            {users.length > 0 ? (
              <OverviewUsers users={users} />
            ) : (
              <p className="text-blue-700">{t("users.noUsers")}</p>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default UserOverviewPage;
