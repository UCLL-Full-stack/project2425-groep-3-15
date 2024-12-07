import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import ProjectService from '@/services/ProjectService';
import ProjectOverviewTable from '../../components/projects/ProjectOverviewTable';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { Project } from '@types';
import NewProjectForm from '@/components/projects/NewProjectForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const IndexPage: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const { t } = useTranslation('common');

  const getProjects = async () => {
    try {
      const data = await ProjectService.fetchAndParseProjects();
      console.log('Fetched projects:', data);
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

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setShowNewProjectForm(false);
  };

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta name="description" content="A tool to help teams plan, execute, and monitor their projects and tasks." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-2xl font-bold mb-8">{t("project.title")}</h1>
        <section>
          <div className="flex justify-center">
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600"
              onClick={handleCreateProjectClick}
            >
              {t("project.create")}
            </button>
          </div>
          {showNewProjectForm && <NewProjectForm onProjectCreated={handleProjectCreated} />}
          {projects.length > 0 ? (
            <ProjectOverviewTable 
              projects={projects} 
              selectProject={setSelectedProject} 
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