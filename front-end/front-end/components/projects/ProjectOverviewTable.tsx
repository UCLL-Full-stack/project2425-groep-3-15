import React from 'react';
import { Project } from '@/types';
import { useRouter } from 'next/router';
import ProjectService from '@/services/ProjectService';

type Props = {
  projects: Array<Project>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>; // Add this prop to update the projects state
};

const ProjectOverviewTable: React.FC<Props> = ({ projects, setProjects }) => {
  const router = useRouter();

  const handleSelectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  const handleRemoveProject = async (projectId: number) => {
    try {
      await ProjectService.deleteProject(projectId);
      onProjectRemoved(projectId);
    } catch (error) {
      console.error('Error removing project', error);
    }
  };

  const onProjectRemoved = (projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter(project => project.id !== projectId));
    console.log(`Project with ID ${projectId} removed`);
  };

  return (
    <table className='table table-hover'>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => (
          <tr key={index}>
            <td>{project.name}</td>
            <td>
              <button
                className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-10 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={() => handleSelectClick(project.id)}
              >
                Select
              </button>
              <button
                className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-10 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                onClick={() => handleRemoveProject(project.id)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectOverviewTable;
