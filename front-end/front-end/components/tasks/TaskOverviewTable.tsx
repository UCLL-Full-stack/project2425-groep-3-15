import React from 'react';
import { Project, Task } from '@types';
import TaskService from '@/services/TaskService';
import { useTranslation } from 'next-i18next';

type Props = {
  project: Project & { tasks: Task[] };
  onStatusChange: (taskId: number, newStatus: boolean) => void;
  onTaskRemoved: (taskId: number) => void;
  isEditing: boolean;
};

const TaskOverviewTable: React.FC<Props> = ({ project, onStatusChange, onTaskRemoved, isEditing }) => {
  const { t } = useTranslation('common');

  const handleStatusChange = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      onStatusChange(taskId, newStatus);
    } catch (error) {
      console.error(t('projectDetails.tasks.createError'), error);
    }
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await TaskService.deleteTask(taskId);
      onTaskRemoved(taskId);
    } catch (error) {
      console.error(t('projectDetails.tasks.createError'), error);
    }
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>{t('projectDetails.tasks.name')}</th>
          <th>{t('projectDetails.tasks.description')}</th>
          <th>{t('projectDetails.tasks.due')}</th>
          <th>{t('projectDetails.tasks.status')}</th>
          {isEditing && <th></th>}
        </tr>
      </thead>
      <tbody>
        {project.tasks.map((task: Task) => (
          <tr key={task.taskId}>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
            <td className={task.completed ? 'text-green-500' : 'text-red-500'}>
              {task.completed ? t('projectDetails.tasks.Complete') : t('projectDetails.tasks.Incomplete')}
            </td>
            {isEditing && (
              <>
                <td>
                  <button
                    onClick={() => handleStatusChange(task.taskId, task.completed)}
                    className="btn btn-primary text-white bg-blue-500 px-2 py-2 rounded-md shadow hover:bg-blue-600"
                  >
                    {task.completed ? t('projectDetails.tasks.markIncomplete') : t('projectDetails.tasks.markComplete')}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveTask(task.taskId)}
                    className="btn btn-danger text-white bg-red-500 px-2 py-2 rounded-md shadow hover:bg-red-600"
                  >
                    {t('projectDetails.tasks.remove')}
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskOverviewTable;