import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

type Props = {
  projects: Array<Project>;
  onDeleteProject: (projectId: string) => void;
};

const ProjectOverviewTable: React.FC<Props> = ({
  projects,
  onDeleteProject,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the user's role from sessionStorage
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const handleSelectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      {projects && (
        <div className="overflow-x-auto">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-left px-2 py-3 text-lg">
                  {t("project.projectname")}
                </th>
                <th className="text-center px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-300 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClick(project.projectId)}
                >
                  <td className="text-left px-2 py-3 text-lg">
                    {project.name}
                  </td>
                  <td className="text-right px-2 py-3">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => handleSelectClick(project.projectId)}
                      >
                        {t("project.select")}
                      </button>
                      {userRole === "ADMIN" && (
                        <button
                          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={() => onDeleteProject(project.projectId)}
                        >
                          {t("project.delete")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProjectOverviewTable;
