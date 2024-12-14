import React from "react";

interface UserProfileProps {
  fullName: string;
  email: string;
  role: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ fullName, email, role }) => {
  return (
    <div className="flex items-center p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <img
        src="profile.jpg"
        alt="Profile"
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex flex-col">
        <h2 className="m-0 text-lg font-bold">{fullName}</h2>
        <p className="m-0 text-sm text-gray-600">{email}</p>
        <p className="m-0 text-xs text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
