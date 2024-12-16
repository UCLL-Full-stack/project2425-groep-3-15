// pages/projects/index.tsx
import React from "react";
import Head from "next/head";
import Header from "../../components/common/header";
import ProjectPageContent from "../../components/projects/ProjectsPage";
import useProjects from "../../hooks/useProjects";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ProjectsPage: React.FC = () => {
  const {
    projects,
    successMessage,
    setSuccessMessage,
    handleProjectCreated,
    handleDeleteProject,
  } = useProjects();

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name="description"
          content="A tool to help teams plan, execute, and monitor their projects and tasks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <ProjectPageContent
        projects={projects}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        onProjectCreated={handleProjectCreated}
        onDeleteProject={handleDeleteProject}
      />
    </>
  );
};

export default ProjectsPage;
