import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import ProjectService from "@/services/ProjectService";
import ProjectOverviewTable from "../../components/projects/ProjectOverviewTable";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { Project } from "@types";
import NewProjectForm from "@/components/projects/NewProjectForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const IndexPage: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const { t } = useTranslation("common");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setShowNewProjectForm(false);
    setSuccessMessage("Project created successfully!");

    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId); // Backend call
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.projectId !== projectId)
      );
      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getProjects = async () => {
    try {
      const data = await ProjectService.fetchAndParseProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleCreateProjectClick = () => {
    setShowNewProjectForm(true);
  };

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
      <main className="d-flex flex-column justify-content-center align-items-center">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          {t("project.title")}
        </h1>
        <section>
          <div className="flex justify-center">
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
              onClick={handleCreateProjectClick}
            >
              {t("project.create")}
            </button>
          </div>
          {showNewProjectForm && (
            <NewProjectForm
              onProjectCreated={handleProjectCreated}
              setSuccessMessage={setSuccessMessage}
            />
          )}
          {projects.length > 0 ? (
            <ProjectOverviewTable
              projects={projects}
              onDeleteProject={handleDeleteProject}
            />
          ) : (
            <p>{t("project.noProjects")}</p>
          )}
        </section>
      </main>
    </>
  );
};

export default IndexPage;
