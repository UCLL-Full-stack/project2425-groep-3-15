import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import UserService from "services/UserService";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type Project = {
  projectId: number;
  project: {
    name: string;
    userCount: number;
  };
  // Add other project fields as needed
};

type OverviewUsersProps = {
  users: User[];
};

const OverviewUsers: React.FC<OverviewUsersProps> = ({ users = [] }) => {
  const { t } = useTranslation("common");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleRowClick = async (user: User) => {
    console.log("User clicked:", user); // Add this line to log the user object
    setSelectedUser(user);
    try {
      const data = await UserService.getUserProjects(user.userId);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects for user", error);
    }
  };

  return (
    <div>
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
            <tr key={user.userId} onClick={() => handleRowClick(user)}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-black mb-2">
            {t("projects.subtitle", {
              name: `${selectedUser.firstName} ${selectedUser.lastName}`,
            })}
          </h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-left">{t("projects.name")}</th>
                <th className="text-center">{t("projects.userCount")}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.projectId}>
                  <td className="text-left">{project.project.name}</td>
                  <td className="text-center">{project.project.userCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverviewUsers;
