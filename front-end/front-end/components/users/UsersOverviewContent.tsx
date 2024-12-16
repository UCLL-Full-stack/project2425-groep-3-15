import React from "react";
import OverviewUsers from "../../components/users/OverviewUsers";

type UsersOverviewContentProps = {
  users: any[];
  error: string | null;
  t: (key: string) => string;
};

const UsersOverviewContent: React.FC<UsersOverviewContentProps> = ({
  users,
  error,
  t,
}) => {
  return (
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
  );
};

export default UsersOverviewContent;
