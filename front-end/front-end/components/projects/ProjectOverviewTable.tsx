import React from "react";
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

  const handleSelectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };
  const { t } = useTranslation("common");

  return (
    <>
      {projects && (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>{t("project.projectname")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.name}</td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => handleSelectClick(project.projectId)}
                    >
                      {t("project.select")}
                    </button>
                    <button
                      className="text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() => onDeleteProject(project.projectId)}
                    >
                      {t("project.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ProjectOverviewTable;
