import React from "react";
import { Project, User } from "../../types";
import { useTranslation } from "next-i18next";

type Props = {
  project: Project & { users: { user: User }[] };
};

const UserOverviewTable: React.FC<Props> = ({ project }) => {
  const { t } = useTranslation("common");

  return (
    <>
      {project && project.users && project.users.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>{t("projectDetails.users.id")}</th>
              <th>{t("projectDetails.users.name")}</th>
              <th>{t("projectDetails.users.role")}</th>
            </tr>
          </thead>
          <tbody>
            {project.users.map(({ user }: { user: User }, index: number) => (
              <tr key={index}>
                <td>{user.UserId}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("projectDetails.users.noUsers")}</p>
      )}
    </>
  );
};

export default UserOverviewTable;
