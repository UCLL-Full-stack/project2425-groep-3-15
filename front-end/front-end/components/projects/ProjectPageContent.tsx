// components/projects/ProjectPageContent.tsx
import React from "react";
import { useRouter } from "next/router";
import useProjectDetails from "@/hooks/useProjectDetails";
import TaskSection from "@/components/projects/TaskSection";
import UserOverviewTable from "@/components/users/UserOverviewTable";
import { useTranslation } from "next-i18next";

const ProjectPageContent: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    selectedProject,
    isEditing,
    showTaskForm,
    setIsEditing,
    setShowTaskForm,
    handleTaskCreated,
    handleStatusChange,
    handleTaskRemoved,
  } = useProjectDetails(projectId);
  const { t } = useTranslation("common");

  return (
    <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        {t("projectDetails.title")}{" "}
        {selectedProject ? selectedProject.name : t("loading")}
      </h1>
      {selectedProject ? (
        <div className="flex flex-col w-full max-w-[1200px]">
          <div className="flex-1 mx-2.5 bg-white rounded-md p-4 shadow-md mb-4">
            <h2 className="text-xl font-bold mb-4">
              {t("projectDetails.users.title")}
            </h2>
            <UserOverviewTable project={selectedProject} />
          </div>
          <TaskSection
            project={selectedProject}
            isEditing={isEditing}
            showTaskForm={showTaskForm}
            setIsEditing={setIsEditing}
            setShowTaskForm={setShowTaskForm}
            handleTaskCreated={handleTaskCreated}
            handleStatusChange={handleStatusChange}
            handleTaskRemoved={handleTaskRemoved}
          />
        </div>
      ) : (
        <p>{t("loading")}</p>
      )}
    </main>
  );
};

export default ProjectPageContent;
