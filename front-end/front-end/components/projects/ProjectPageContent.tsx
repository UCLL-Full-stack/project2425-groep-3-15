// components/projects/ProjectPageContent.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import useProjectDetails from "../../hooks/useProjectDetails";
import TaskSection from "../../components/projects/TaskSection";
import UserOverviewTable from "../../components/users/UserOverViewTable";
import { useTranslation } from "next-i18next";
import AddUsersModal from "./AddUsersModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        {t("projectDetails.title")}{" "}
        {selectedProject ? selectedProject.name : t("loading")}
      </h1>
      {selectedProject ? (
        <div className="flex flex-col w-full max-w-[1200px]">
          <div className="flex-1 mx-2.5 bg-white rounded-md p-4 shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {t("projectDetails.users.title")}
              </h2>
              <button
                className="bg-blue-500 text-white px-2 py-2 rounded-md"
                onClick={handleOpenModal}
              >
                + {t("projectDetails.users.adduser")}
              </button>
            </div>
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
      {isModalOpen && (
        <AddUsersModal
          projectId={projectId}
          selectedProject={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default ProjectPageContent;
