import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import OverviewUsers from "@/components/users/OverviewUsers";
import UserService from "@/services/UserService";
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
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
    // Check role in sessionStorage
    const userRole = sessionStorage.getItem("userRole");

    if (userRole === "ADMIN") {
      setIsAdmin(true); // Grant access if user is admin
      fetchUsers(); // Fetch users if the role is admin
    } else {
      setIsAdmin(false); // Deny access for non-admin users
      setLoading(false); // Stop loading if the role check is done
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-gray-500">{t("loading")}</p>
      </div>
    );
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
          <>
            <h1 className="text-3xl font-bold text-blue-700 mb-8">
              {t("users.title")}
            </h1>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}
            {users.length > 0 ? (
              <section className="w-full max-w-3xl bg-white shadow-md rounded-md p-6 mx-auto">
                <OverviewUsers users={users} />
              </section>
            ) : (
              <p className="text-blue-700">{t("users.noUsers")}</p>
            )}
          </>
        ) : (
          <p className="text-red-700 text-lg font-semibold">
            {t("access.denied")} {/* Message for non-admins */}
          </p>
        )}
      </main>
    </>
  );
};

export default UserOverviewPage;
