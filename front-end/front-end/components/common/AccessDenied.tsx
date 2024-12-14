import React from "react";

const AccessDenied: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-700 text-lg font-semibold">{message}</p>
    </div>
  );
};

export default AccessDenied;
