// components/projects/ProjectPageContent.tsx
import React, { useState } from "react";
import ProjectOverviewTable from "../../components/projects/ProjectOverviewTable";
import NewProjectModal from "../../components/projects/NewProjectForm";
import SuccessMessage from "../../components/common/SuccessMessage";
import { Project } from "@types";
import { useTranslation } from "next-i18next";

type ProjectPageContentProps = {
  projects: Array<Project>;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
  onProjectCreated: (newProject: Project) => void;
  onDeleteProject: (projectId: number) => void;
};

const ProjectPageContent: React.FC<ProjectPageContentProps> = ({
  projects,
  successMessage,
  setSuccessMessage,
  onProjectCreated,
  onDeleteProject,
}) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
      {/* Success Message */}
      {successMessage && <SuccessMessage message={successMessage} />}

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        {t("project.title")}
      </h1>

      {/* Create Project Button */}
      <div className="mb-6">
        <button
          className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)} // Open modal
        >
          {t("project.create")}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <NewProjectModal
          onProjectCreated={onProjectCreated} // Handle project creation
          setSuccessMessage={setSuccessMessage}
          onClose={() => setIsModalOpen(false)} // Close modal
        />
      )}

      {/* Project Overview Table */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-md p-6 mx-auto">
        {projects.length > 0 ? (
          <ProjectOverviewTable
            projects={projects}
            onDeleteProject={onDeleteProject}
          />
        ) : (
          <p className="text-gray-500">{t("project.noProjects")}</p>
        )}
      </section>
    </main>
  );
};

export default ProjectPageContent;
