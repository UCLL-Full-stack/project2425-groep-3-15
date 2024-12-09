import React from "react";
import { Project } from "@/types";
import { useRouter } from "next/router";

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

  const handleRowDoubleClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      {projects && (
        <div className="overflow-x-auto">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-center px-2 py-3">Name</th>
                <th className="text-center px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-300 hover:bg-gray-100 cursor-pointer"
                  onDoubleClick={() => handleRowDoubleClick(project.projectId)}
                >
                  <td className="text-center px-2 py-3">{project.name}</td>
                  <td className="text-center px-2 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => handleSelectClick(project.projectId)}
                      >
                        Select
                      </button>
                      <button
                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        onClick={() => onDeleteProject(project.projectId)}
                      >
                        Delete
                      </button>
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
