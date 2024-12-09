import React from "react";
import { useTranslation } from "next-i18next";

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type OverviewUsersProps = {
  users: User[];
};

const OverviewUsers: React.FC<OverviewUsersProps> = ({ users = [] }) => {
  const { t } = useTranslation("common");

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>{t("users.name")}</th>
          <th>{t("users.email")}</th>
          <th>{t("users.role")}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.userId}>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OverviewUsers;
