import React, { useState, useEffect } from "react";
import UserService from "services/UserService";
import { User, Project } from "@types"; // Adjust the import path as needed

type AddUsersModalProps = {
  projectId: string;
  selectedProject: Project;
  onClose: () => void;
};

const AddUsersModal: React.FC<AddUsersModalProps> = ({
  projectId,
  selectedProject,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSave = async () => {
    try {
      await UserService.updateProjectUsers(projectId, selectedUsers);
      onClose();
    } catch (error) {
      console.error("Error updating project users", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Users</h2>
        <div className="mb-4">
          {users.map((user) => (
            <div key={user.userId} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.userId)}
                onChange={() => handleUserToggle(user.userId)}
                className="mr-2"
              />
              <span>
                {user.firstName} {user.lastName} ({user.email})
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;
