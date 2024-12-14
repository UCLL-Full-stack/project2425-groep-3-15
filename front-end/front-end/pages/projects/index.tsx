import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import ProjectService from "@/services/ProjectService";
import ProjectOverviewTable from "@/components/projects/ProjectOverviewTable";
import { Project } from "@types";
import NewProjectModal from "@/components/projects/NewProjectForm"; // Import the modal component
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),

      // Fallback projects in case API fails (optional, add/remove as per your logic)
      projects: [],
    },
  };
}

const IndexPage: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const { t } = useTranslation("common");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]); // Add new project to state
    setIsModalOpen(false); // Close the modal
    setSuccessMessage(t("project.successMessage")); // Set success message
    setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.projectId !== projectId)
      );
      setSuccessMessage(t("project.deleteSuccessMessage"));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(t("project.deleteError"), error);
    }
  };

  const getProjects = async () => {
    try {
      const data = await ProjectService.fetchAndParseProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getProjects(); // Fetch projects on mount
  }, []);

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta
          name="description"
          content="A tool to help teams plan, execute, and monitor their projects and tasks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        {/* Success Message */}
        {successMessage && (
          <div
            className="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-lg mb-6 animate-fade-in"
            role="alert"
          >
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          {t("project.title")}
        </h1>

        {/* Create Project Button */}
        <div className="mb-6">
          <button
            className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            {t("project.create")}
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <NewProjectModal
            onProjectCreated={handleProjectCreated} // Pass callback to handle project creation
            setSuccessMessage={setSuccessMessage}
            onClose={() => setIsModalOpen(false)} // Close modal on background click
          />
        )}

        {/* Project Overview Table */}
        <section className="w-full max-w-3xl bg-white shadow-md rounded-md p-6 mx-auto">
          {projects.length > 0 ? (
            <ProjectOverviewTable
              projects={projects}
              onDeleteProject={handleDeleteProject} // Pass delete handler
            />
          ) : (
            <p className="text-gray-500">{t("project.noProjects")}</p>
          )}
        </section>
      </main>
    </>
  );
};

export default IndexPage;
