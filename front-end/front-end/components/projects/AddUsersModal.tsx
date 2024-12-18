import React, { useState, useEffect } from "react";
import UserService from "services/UserService";
import { User, Project } from "@types"; // Adjust the import path as needed
import { useTranslation } from "react-i18next";

type AddUsersModalProps = {
  projectId: number;
  selectedProject: Project;
  onClose: () => void;
  onUsersUpdated: () => void;
};

const AddUsersModal: React.FC<AddUsersModalProps> = ({
  projectId,
  selectedProject,
  onClose,
  onUsersUpdated,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const { t } = useTranslation("common");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await UserService.getAllUsers();
        setUsers(allUsers);
        const projectUserIds = selectedProject.users.map(
          (user: User) => user.userId
        );
        setSelectedUsers(projectUserIds);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [selectedProject]);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSave = async () => {
    try {
      await UserService.updateProjectUsers(projectId, selectedUsers);
      onUsersUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating project users", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">
          {t("projectDetails.users.adduserss")}
        </h2>
        <div className="mb-4">
          <table className="table table-inline w-full">
            <thead>
              <tr>
                <th>{t("users.select")}</th>
                <th>{t("users.name")}</th>
                <th>{t("users.email")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="cursor-pointer"
                  onClick={() => handleUserToggle(user.userId)}
                >
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.userId)}
                      onChange={() => handleUserToggle(user.userId)}
                      className="mr-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            {t("projectDetails.users.addusers")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;
